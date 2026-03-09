import { supabase } from './supabase-config.js';

const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const instructionText = document.getElementById('instruction-text');
const keys = document.querySelectorAll('.key');
const fingers = document.querySelectorAll('.finger');
const errorReport = document.getElementById('error-report');
const errorList = document.getElementById('error-list');

const categoryTabsContainer = document.getElementById('category-tabs');
const lessonScrollerContainer = document.getElementById('lesson-scroller');

// Finger Mapping
const fingerMap = {
    'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky',
    'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
    'e': 'l-middle', 'd': 'l-middle', 'c': 'l-middle',
    'r': 'l-index', 'f': 'l-index', 'v': 'l-index', 't': 'l-index', 'g': 'l-index', 'b': 'l-index',
    'y': 'r-index', 'h': 'r-index', 'n': 'r-index', 'u': 'r-index', 'j': 'r-index', 'm': 'r-index',
    'i': 'r-middle', 'k': 'r-middle', ',': 'r-middle',
    'o': 'r-ring', 'l': 'r-ring', '.': 'r-ring',
    'p': 'r-pinky', ';': 'r-pinky', '/': 'r-pinky',
    ' ': 'thumb'
};

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let currentText = "";
let missedKeys = {};
let currentLessonKey = null;

// --- MENU LOGIC ---
function renderMenu() {
    const groupNames = Object.keys(window.lessonGroups);
    categoryTabsContainer.innerHTML = '';

    groupNames.forEach((groupName, index) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn';
        btn.innerText = groupName;
        if (index === 0) btn.classList.add('active');

        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLessons(groupName);
        };
        categoryTabsContainer.appendChild(btn);
    });

    renderLessons(groupNames[0]);
}

function renderLessons(groupName) {
    lessonScrollerContainer.innerHTML = '';
    const lessonKeys = window.lessonGroups[groupName];

    lessonKeys.forEach(key => {
        const lesson = window.lessonData[key];
        const chip = document.createElement('div');
        chip.className = 'lesson-chip';
        chip.innerText = lesson.title;

        if (currentLessonKey === key) chip.classList.add('active');

        chip.onclick = () => {
            document.querySelectorAll('.lesson-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentLessonKey = key;
            loadLesson(key);
        };

        lessonScrollerContainer.appendChild(chip);
    });
}

function highlightVisuals(char) {
    keys.forEach(key => key.classList.remove('active'));
    fingers.forEach(finger => finger.classList.remove('active'));

    if (!char) return;

    if (char !== char.toLowerCase()) {
        document.querySelectorAll('.key[data-key="shift"]').forEach(k => k.classList.add('active'));
    }

    const keyChar = char.toLowerCase();
    let targetKey = null;
    keys.forEach(key => {
        if (key.dataset.key === keyChar) targetKey = key;
    });
    if (targetKey) targetKey.classList.add('active');

    let fingerId = fingerMap[keyChar];
    if (fingerId === 'thumb') {
        document.getElementById('f-r-thumb').classList.add('active');
        document.getElementById('f-l-thumb').classList.add('active');
    } else if (fingerId) {
        const elId = 'f-' + fingerId;
        const fingerEl = document.getElementById(elId);
        if (fingerEl) fingerEl.classList.add('active');
    }
}

// Auto-Scroll Logic for Multi-line
function scrollToCurrentCursor(cursorElement) {
    if (!cursorElement) return;
    const container = quoteDisplayElement;

    // Simple check: is the element out of view?
    // We want the cursor to be roughly in the middle or at least visible
    const containerRect = container.getBoundingClientRect();
    const cursorRect = cursorElement.getBoundingClientRect();

    if (cursorRect.bottom > containerRect.bottom || cursorRect.top < containerRect.top) {
        cursorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function loadLesson(key) {
    clearInterval(timer);
    isTyping = false;
    timeLeft = maxTime;
    timerElement.innerText = "60s";
    wpmElement.innerText = "0";
    accuracyElement.innerText = "100%";
    quoteInputElement.value = "";
    quoteInputElement.disabled = false;
    quoteInputElement.focus();

    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    errorReport.classList.add('hidden');

    // Show Game Elements
    // Show Game Elements; Hide Results
    const visuals = document.querySelector('.visuals-container');
    const typingArea = document.querySelector('.typing-area');
    const typingView = document.getElementById('typing-view');
    const resultsScreen = document.getElementById('results-screen');
    const resultsContent = document.getElementById('results-content'); // Clear content too

    if (typingView) typingView.style.display = 'block';
    if (visuals) visuals.style.display = 'flex';
    if (typingArea) typingArea.style.display = 'flex';
    if (resultsScreen) {
        resultsScreen.style.display = 'none';
    }
    if (resultsContent) {
        resultsContent.innerHTML = '';
    }

    charIndex = 0;
    mistakes = 0;
    missedKeys = {}; // Reset misses
    isTyping = false; // Reset typing state

    const data = window.lessonData[key];
    if (!data) return;

    currentText = data.text;
    instructionText.innerText = data.instruction;

    quoteDisplayElement.innerHTML = '';
    currentText.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplayElement.appendChild(charSpan);
    });

    highlightVisuals(currentText[0]);
    const firstChar = quoteDisplayElement.querySelector('span');
    if (firstChar) {
        firstChar.classList.add('current');
        scrollToCurrentCursor(firstChar); // Ensure start is visible
    }
}

// Global Stats
let cardsCompleted = 0;
let totalWPM = 0;
let totalAcc = 0;
let totalErr = 0;
let completedCardNumbers = [];

const gCardsEl = document.getElementById('g-cards');
const gWpmEl = document.getElementById('g-wpm');
const gAccEl = document.getElementById('g-acc');
const gErrEl = document.getElementById('g-err');
const completedCardsEl = document.getElementById('completed-cards');

function initTyping() {
    const characters = quoteDisplayElement.querySelectorAll('span');
    const inputVal = quoteInputElement.value;
    const typedChar = inputVal.split('')[charIndex];

    // Prevent Backspace handling by checking if input length decreased (though keydown prevents it, this is a safety check)
    if (inputVal.length < charIndex) {
        quoteInputElement.value = inputVal; // partial revert if somehow managed
        return;
    }

    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        // Logic strictly for forward typing
        if (typedChar != null) {
            const currentChar = characters[charIndex];
            if (currentChar.innerText === typedChar) {
                currentChar.classList.add('correct');
            } else {
                mistakes++;
                currentChar.classList.add('incorrect');
                const expected = currentChar.innerText;
                missedKeys[expected] = (missedKeys[expected] || 0) + 1;
            }
            currentChar.classList.remove('current');
            charIndex++;
            if (charIndex < characters.length) {
                const nextChar = characters[charIndex];
                nextChar.classList.add('current');
                highlightVisuals(nextChar.innerText);
                scrollToCurrentCursor(nextChar); // SCROLL IF NEEDED
            } else {
                finishGame();
            }
        }

        // Stats
        let wpm = Math.round(((charIndex - mistakes) / 5) / ((maxTime - timeLeft) / 60));
        wpm = (isFinite(wpm) && wpm > 0) ? wpm : 0;
        wpmElement.innerText = wpm;

        let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
        accuracy = (accuracy < 0 || !isFinite(accuracy)) ? 100 : accuracy;
        accuracyElement.innerText = accuracy + '%';
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.innerText = timeLeft + "s";
    } else {
        finishGame();
    }
}

function finishGame() {
    clearInterval(timer);
    quoteInputElement.disabled = true;
    startBtn.style.display = 'inline-block';
    startBtn.innerText = "Retry";
    startBtn.onclick = () => loadLesson(currentLessonKey);
    restartBtn.style.display = 'none';
    highlightVisuals(null);

    // Hide visuals to show stats without scrolling
    const visuals = document.querySelector('.visuals-container');
    const typingArea = document.querySelector('.typing-area');
    const typingView = document.getElementById('typing-view');
    const resultsScreen = document.getElementById('results-screen');
    const resultsContent = document.getElementById('results-content');

    // ONLY hide typing-view contents, NOT progress-view
    if (visuals) visuals.style.display = 'none';
    if (typingArea) typingArea.style.display = 'none';
    // Let typingView stay block so the Retry button is visible
    if (typingView) typingView.style.display = 'block';

    // Show Results
    if (resultsScreen && resultsContent) {
        // Calculate Top Misses
        let missesHtml = '<p style="color: var(--text-secondary);">Great job!</p>';
        const missedArr = Object.entries(missedKeys).sort((a, b) => b[1] - a[1]);

        if (missedArr.length > 0) {
            const topMisses = missedArr.slice(0, 5).map(([k, v]) => `<span style="color: var(--incorrect-color); font-weight: bold;">${k}</span> (${v})`).join(', ');
            missesHtml = `
                <h3 style="margin-top: 1rem; color: var(--text-primary);">Most Frequent Misses:</h3>
                <p style="margin-top: 0.5rem; font-size: 1.4rem;">${topMisses}</p>
            `;
        } else {
            missesHtml += '<p style="color: var(--correct-color); margin-top: 1rem;">Perfect! No errors.</p>';
        }

        resultsContent.innerHTML = missesHtml;
        resultsScreen.style.display = 'block';
    }

    // Update Global Stats
    if (charIndex > 0) {
        cardsCompleted++;

        let currentWpm = parseInt(wpmElement.innerText) || 0;
        let currentAcc = parseInt(accuracyElement.innerText) || 0;

        totalWPM += currentWpm;
        totalAcc += currentAcc;
        totalErr += mistakes;

        gCardsEl.innerText = cardsCompleted;
        gWpmEl.innerText = Math.round(totalWPM / cardsCompleted);
        gAccEl.innerText = Math.round(totalAcc / cardsCompleted) + '%';
        gErrEl.innerText = Math.round(totalErr / cardsCompleted);

        // Save for Report
        saveSession(window.lessonData[currentLessonKey].title, currentWpm, currentAcc + '%', mistakes, missedKeys);

        // Track Completed Card Number
        const lesson = window.lessonData[currentLessonKey];
        if (lesson) {
            const title = lesson.title;
            // Extract Number: "Card 1: ...", "Letter G (Cards 13-15)"
            // Regex to find "Card X" or "Cards X-Y"
            const match = title.match(/(?:Card|Cards)\s+([\d-]+)/i);
            if (match && match[1]) {
                const num = match[1];
                if (!completedCardNumbers.includes(num)) {
                    completedCardNumbers.push(num);
                    // Sort numerically if possible (handling ranges is tricky, simple sort for now)
                    completedCardNumbers.sort((a, b) => {
                        const valA = parseInt(a.split('-')[0]);
                        const valB = parseInt(b.split('-')[0]);
                        return valA - valB;
                    });
                    completedCardsEl.innerText = "Completed: " + completedCardNumbers.join(', ');
                }
            }
        }
    }

    // Always show results screen
    errorReport.classList.remove('hidden');

    if (Object.keys(missedKeys).length > 0) {
        document.querySelector('.error-report p').innerText = "Most Frequent Misses:";
        const sortedErrors = Object.entries(missedKeys).sort((a, b) => b[1] - a[1]);
        errorList.innerHTML = sortedErrors.slice(0, 5).map(([char, count]) =>
            `<span style="margin-right: 15px; font-family:var(--font-mono)">
                <span style="color:var(--incorrect-color); font-weight:bold">${char === ' ' ? 'Space' : char}</span>: ${count}x
            </span>`
        ).join('');
    } else {
        document.querySelector('.error-report p').innerText = "";
        errorList.innerHTML = `<span style="color:var(--correct-color); font-size:1.2rem; font-weight:bold;">✨ Perfect Round! No errors at all. ✨</span>`;
    }
}

quoteInputElement.addEventListener('input', initTyping);
restartBtn.addEventListener('click', () => loadLesson(currentLessonKey));

// --- REPORTING & SESSION LOGIC ---
const dateTimeEl = document.getElementById('current-datetime');
const attendanceStatusEl = document.getElementById('attendance-status');
const reportBtn = document.getElementById('btn-report');

// Update Date/Time every second
function updateDateTime() {
    const now = new Date();
    // Format: DD/MM/YYYY HH:MM:SS
    const str = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');
    dateTimeEl.innerText = str;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// 6 AM Logic: A "business day" starts at 6:00 AM and ends at 6:00 AM next day
function getReportingWindow() {
    const now = new Date();
    const currentHour = now.getHours();

    // If it's before 6 AM, the reporting day belongs to yesterday
    // If it's after 6 AM, the reporting day starts today at 6 AM
    let start = new Date(now);

    if (currentHour < 6) {
        start.setDate(start.getDate() - 1);
    }

    start.setHours(6, 0, 0, 0);

    let end = new Date(start);
    end.setDate(end.getDate() + 1); // Ends tomorrow 6 AM

    return { start, end };
}

async function saveSession(lessonTitle, wpm, acc, errors, missedKeys = {}) {
    // Get current user for attribution
    const { data: { user } } = await supabase.auth.getUser();
    const localUser = JSON.parse(localStorage.getItem('typeFlow_user'));

    const session = {
        timestamp: new Date().toISOString(),
        lesson: lessonTitle,
        wpm: wpm,
        accuracy: acc,
        errors: errors,
        missed_keys: missedKeys, // Corrected to snake_case for database
        user_id: user ? user.id : (localUser ? localUser.id : null),
        user_email: user ? user.email : (localUser ? localUser.email : 'unknown')
    };

    // 1. Save to Local Storage (Immediate feedback)
    let history = JSON.parse(localStorage.getItem('typeFlow_history') || '[]');
    history.push(session);
    localStorage.setItem('typeFlow_history', JSON.stringify(history));

    // 2. Save to Supabase (Cloud)
    if (session.user_id) {
        try {
            const { data, error } = await supabase
                .from('typing_history')
                .insert([session])
                .select(); // Select back to confirm

            if (error) {
                console.error("Supabase Insert Error:", error);
                throw new Error(error.message);
            }
            console.log("Session saved to cloud:", data);
        } catch (e) {
            console.error("Cloud save failed:", e);
            // Optionally notify user if it's a persistent issue
            // alert("Database error: could not sync your progress. Please check your connection.");
        }
    }

    updateAttendanceStatus();
}

async function updateAttendanceStatus() {
    const { start, end } = getReportingWindow();
    let history = JSON.parse(localStorage.getItem('typeFlow_history') || '[]');

    // Check if any record exists within [start, end]
    const hasAttendance = history.some(rec => {
        const d = new Date(rec.timestamp);
        return d >= start && d < end;
    });

    if (hasAttendance) {
        attendanceStatusEl.innerHTML = 'Attendance: <span class="status-yes">Marked</span>';
    } else {
        attendanceStatusEl.innerHTML = 'Attendance: <span class="status-no">Not Marked</span>';
    }
}

// Initial Check
updateAttendanceStatus();
restoreDailyProgress();

// Restore Progress from LocalStorage for the current daily window
function restoreDailyProgress() {
    const { start, end } = getReportingWindow();
    let history = JSON.parse(localStorage.getItem('typeFlow_history') || '[]');

    // Filter records for the current day
    const dailyRecords = history.filter(rec => {
        const d = new Date(rec.timestamp);
        return d >= start && d < end;
    });

    if (dailyRecords.length === 0) return;

    // Recalculate Stats
    cardsCompleted = dailyRecords.length;
    let sumWPM = 0;
    let sumAcc = 0;
    let sumErr = 0;

    // Reset lists
    completedCardNumbers = [];

    dailyRecords.forEach(rec => {
        sumWPM += parseInt(rec.wpm) || 0;
        sumAcc += parseInt(rec.accuracy) || 0;
        sumErr += parseInt(rec.errors) || 0;

        // Parse Card Number
        const match = rec.lesson.match(/(?:Card|Cards)\s+([\d-]+)/i);
        if (match && match[1]) {
            const num = match[1];
            if (!completedCardNumbers.includes(num)) {
                completedCardNumbers.push(num);
            }
        }
    });

    // Update Totals for running average logic
    totalWPM = sumWPM;
    totalAcc = sumAcc;
    totalErr = sumErr;

    // Sort Card Numbers
    completedCardNumbers.sort((a, b) => {
        const valA = parseInt(a.split('-')[0]);
        const valB = parseInt(b.split('-')[0]);
        return valA - valB;
    });

    // Update DOM
    gCardsEl.innerText = cardsCompleted;
    gWpmEl.innerText = Math.round(totalWPM / cardsCompleted) || 0;
    gAccEl.innerText = (Math.round(totalAcc / cardsCompleted) || 0) + '%';
    gErrEl.innerText = Math.round(totalErr / cardsCompleted) || 0;

    if (completedCardNumbers.length > 0) {
        completedCardsEl.innerText = "Completed: " + completedCardNumbers.join(', ');
    }
}

// Download Report
// Download PDF Report
// --- REPORT MODAL LOGIC ---
let showFullHistory = false;

reportBtn.onclick = renderReportInModal;

function renderReportInModal() {
    const { start, end } = getReportingWindow();
    let history = JSON.parse(localStorage.getItem('typeFlow_history') || '[]');

    // Filter for current window OR show all
    const reportData = showFullHistory ? history : history.filter(rec => {
        const d = new Date(rec.timestamp);
        return d >= start && d < end;
    });

    if (reportData.length === 0) {
        if (showFullHistory) {
            alert("No practice records found.");
        } else {
            alert("No records found for today (6 AM - 6 AM). Switch to 'All-Time' to see past work.");
            showFullHistory = true;
            renderReportInModal();
        }
        return;
    }

    // 1. Calculate Summary
    const dailyCards = reportData.length;
    const dailyWPM = Math.round(reportData.reduce((acc, curr) => acc + curr.wpm, 0) / dailyCards);
    const dailyAcc = Math.round(reportData.reduce((acc, curr) => acc + parseInt(curr.accuracy), 0) / dailyCards);

    // 2. Top Misses Aggregation
    let allMisses = {};
    reportData.forEach(row => {
        // Support both snake_case (DB) and camelCase (old LocalStorage)
        const misses = row.missed_keys || row.missedKeys;
        if (misses) {
            Object.entries(misses).forEach(([key, count]) => {
                allMisses[key] = (allMisses[key] || 0) + count;
            });
        }
    });

    let missesHtml = '';
    if (Object.keys(allMisses).length > 0) {
        const sortedMisses = Object.entries(allMisses)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' | ');
        missesHtml = `
            <div class="misses-section">
                <div class="misses-title">Most Frequent Misses</div>
                <div class="misses-list">${sortedMisses}</div>
            </div>
        `;
    }

    // 3. Build Table HTML
    let tableRows = reportData.map(row => {
        const time = new Date(row.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return `
            <tr>
                <td>${time}</td>
                <td>${row.lesson}</td>
                <td><span style="color:white; font-weight:bold;">${row.wpm}</span></td>
                <td>${row.accuracy}</td>
                <td>${row.errors}</td>
            </tr>
        `;
    }).join('');

    // 4. Construct Modal Content
    const modalBody = document.getElementById('report-modal-body');
    modalBody.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="color:white; margin:0;">${showFullHistory ? 'All-Time Progress' : 'Today\'s Performance'}</h3>
            <button id="toggle-history-depth" class="btn-text-small" style="padding: 5px 15px;">
                ${showFullHistory ? 'View Today Only' : 'View All-Time History'}
            </button>
        </div>
        <div class="report-summary-box">
            <div class="report-stat">
                <span class="val">${dailyCards}</span>
                <span class="lbl">Sessions</span>
            </div>
            <div class="report-stat">
                <span class="val">${dailyWPM}</span>
                <span class="lbl">Avg WPM</span>
            </div>
            <div class="report-stat">
                <span class="val" style="color: var(--correct-color);">${dailyAcc}%</span>
                <span class="lbl">Avg Acc</span>
            </div>
        </div>

        ${missesHtml}

        <div class="report-table-wrapper">
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Lesson</th>
                        <th>WPM</th>
                        <th>Acc</th>
                        <th>Err</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
    `;

    // Show Modal
    document.getElementById('report-modal').style.display = 'flex';

    // Toggle button handler
    const toggleBtn = document.getElementById('toggle-history-depth');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            showFullHistory = !showFullHistory;
            renderReportInModal();
        };
    }
}

// Modal Close Logic
const modal = document.getElementById('report-modal');
const closeBtn = document.getElementById('close-modal-x');
const closeBtnBottom = document.getElementById('btn-close-report');

function closeModal() {
    modal.style.display = 'none';
}

if (closeBtn) closeBtn.onclick = closeModal;
if (closeBtnBottom) closeBtnBottom.onclick = closeModal;
window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
    const guideModal = document.getElementById('guide-modal');
    if (event.target == guideModal) {
        guideModal.style.display = 'none';
    }
    const profileModal = document.getElementById('profile-modal');
    if (event.target == profileModal) {
        profileModal.style.display = 'none';
    }
};

// Guide Modal Triggers
const btnGuide = document.getElementById('btn-guide');
const guideModal = document.getElementById('guide-modal');
const closeGuideX = document.getElementById('close-guide-x');

if (btnGuide && guideModal) {
    btnGuide.onclick = () => guideModal.style.display = 'flex';
}
if (closeGuideX && guideModal) {
    closeGuideX.onclick = () => guideModal.style.display = 'none';
}


document.addEventListener('keydown', (e) => {
    // IGNORE if user is typing in an input field (e.g. Profile Password, Email)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }

    // Disable Backspace (ONLY for the game)
    if (e.key === 'Backspace') {
        e.preventDefault();
        return;
    }

    // Auto-focus game input if not already focused
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && document.activeElement !== quoteInputElement && !quoteInputElement.disabled) {
        quoteInputElement.focus();
    }
});


// --- INITIALIZATION ---
async function initApp() {
    console.log("Initializing App via Supabase...");

    // Mobile Detection Toast
    if (window.innerWidth < 900) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="background: var(--accent-color); color: white; padding: 15px 20px; border-radius: 10px; 
            box-shadow: 0 5px 20px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 10px; max-width: 90%; text-align: left;">
                <span style="font-size: 1.5rem;">💻</span>
                <div>
                    <strong>Pro Tip:</strong><br>
                    Try using a laptop or desktop for the best typing practice experience!
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:white; font-size:1.2rem; cursor:pointer; margin-left:auto;">&times;</button>
            </div>
        `;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.zIndex = '3000';
        toast.id = 'mobile-toast';
        document.body.appendChild(toast);

        // Auto hide after 6 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s';
                setTimeout(() => toast.remove(), 500);
            }
        }, 6000);
    }

    const resultsScreen = document.getElementById('results-screen');
    if (resultsScreen) resultsScreen.style.display = 'none';

    // Auth Listener
    const { data: { session } } = await supabase.auth.getSession();

    const handleUser = async (user) => {
        if (user) {
            console.log("User is signed in:", user.id);

            // Fetch User Profile from 'profiles' table
            const { data: userData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            let finalUserData = userData;
            if (!finalUserData) {
                finalUserData = { id: user.id, name: user.email, email: user.email, role: 'user' };
            }

            // Sync to localStorage
            localStorage.setItem('typeFlow_user', JSON.stringify(finalUserData));

            // SYNC HISTORY (Cloud -> Local)
            try {
                const { data: historyData, error: hErr } = await supabase
                    .from('typing_history')
                    .select('*')
                    .eq('user_id', user.id);

                if (historyData) {
                    localStorage.setItem('typeFlow_history', JSON.stringify(historyData));
                    if (typeof restoreDailyProgress === 'function') restoreDailyProgress();
                    if (typeof updateAttendanceStatus === 'function') updateAttendanceStatus();
                }
            } catch (hErr) { console.error("History sync failed", hErr); }

            // Render UI
            renderMenu();
            renderUserProfile(finalUserData);

            if (finalUserData.role === 'admin') {
                const adminBtn = document.getElementById('btn-admin');
                if (adminBtn) {
                    adminBtn.style.display = 'inline-block';
                    adminBtn.onclick = () => window.location.href = 'admin.html';
                }
            }
            setupProfileFeatures();

            // Select first lesson
            setTimeout(() => {
                const firstChip = document.querySelector('.lesson-chip');
                if (firstChip) firstChip.click();
            }, 100);

        } else {
            console.log("No user signed in. Redirecting...");
            window.location.href = 'login.html';
        }
    };

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            handleUser(session.user);
        } else if (event === 'SIGNED_OUT') {
            localStorage.removeItem('typeFlow_user');
            window.location.href = 'login.html';
        }
    });

    // Initial check
    if (session) {
        handleUser(session.user);
    } else {
        window.location.href = 'login.html';
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
        });
    }

    updateDateTime();
}

// --- DASHBOARD GRAPHS & VIEWS ---
let wpmChart = null;

function renderProgressGraph() {
    const history = JSON.parse(localStorage.getItem('typeFlow_history') || '[]');
    if (history.length === 0) return;

    // Take last 20 sessions
    const recent = history.slice(-20);
    const labels = recent.map((_, i) => (i + 1));
    const dataWPM = recent.map(r => r.wpm);
    const dataAcc = recent.map(r => parseInt(r.accuracy) || 0);

    const ctx = document.getElementById('wpmChart');
    if (!ctx) return;

    if (wpmChart) wpmChart.destroy();

    wpmChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'WPM',
                    data: dataWPM,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6'
                },
                {
                    label: 'Accuracy %',
                    data: dataAcc,
                    borderColor: '#4ade80',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#4ade80'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#f1f5f9', font: { family: 'Outfit', size: 12 } }
                }
            }
        }
    });
}

// TOGGLE VIEWS
const typingView = document.getElementById('typing-view');
const progressView = document.getElementById('progress-view');
const btnShowTyping = document.getElementById('show-typing');
const btnShowProgress = document.getElementById('show-progress');

if (btnShowTyping && btnShowProgress) {
    btnShowTyping.onclick = () => {
        typingView.style.display = 'block';
        progressView.style.display = 'none';
        btnShowTyping.classList.add('active');
        btnShowProgress.classList.remove('active');
    };

    btnShowProgress.onclick = () => {
        typingView.style.display = 'none';
        progressView.style.display = 'flex';
        btnShowTyping.classList.remove('active');
        btnShowProgress.classList.add('active');
        renderProgressGraph();
    };
}

function renderUserProfile(user) {
    const avatarEl = document.getElementById('header-avatar');
    const nameEl = document.getElementById('user-name');

    if (nameEl) nameEl.innerText = user.name;

    if (avatarEl) {
        avatarEl.innerHTML = ''; // Clear
        if (user.profilePic) {
            const img = document.createElement('img');
            img.src = user.profilePic;
            avatarEl.appendChild(img);
        } else {
            // Initials
            const initial = user.name.charAt(0).toUpperCase();
            avatarEl.innerText = initial;
        }
    }
}

// --- PROFILE LOGIC ---
window.openProfileModal = function () {
    console.log("Global openProfileModal called");
    const modal = document.getElementById('profile-modal');
    if (!modal) {
        console.error("No modal found");
        return;
    }

    try {
        const user = JSON.parse(localStorage.getItem('typeFlow_user'));
        const emailEl = document.getElementById('profile-email');
        if (emailEl) emailEl.value = (user && user.email) || '';
        const passEl = document.getElementById('profile-password');
        if (passEl) passEl.value = '';

        const preview = document.getElementById('preview-avatar');
        if (preview && user) {
            preview.innerHTML = '';
            if (user.profilePic) {
                const img = document.createElement('img');
                img.src = user.profilePic;
                preview.appendChild(img);
            } else {
                preview.innerText = (user.name || 'U').charAt(0).toUpperCase();
            }
        }
    } catch (e) { console.error(e); }

    modal.style.display = 'flex';
};

function setupProfileFeatures() {
    const btnEdit = document.getElementById('btn-edit-profile');
    const modal = document.getElementById('profile-modal');
    const closeX = document.getElementById('close-profile-x');
    const form = document.getElementById('profile-form');
    const picInput = document.getElementById('profile-pic-input');
    const preview = document.getElementById('preview-avatar');

    if (!btnEdit) return;

    btnEdit.onclick = () => {
        // Populate current data
        const user = JSON.parse(localStorage.getItem('typeFlow_user'));
        document.getElementById('profile-email').value = user.email;
        document.getElementById('profile-password').value = ''; // Don't show password

        // Render Preview
        preview.innerHTML = '';
        if (user.profilePic) {
            const img = document.createElement('img');
            img.src = user.profilePic;
            preview.appendChild(img);
        } else {
            preview.innerText = user.name.charAt(0).toUpperCase();
        }

        modal.style.display = 'flex';
    };

    if (closeX) closeX.onclick = () => modal.style.display = 'none';

    // Image Upload Preview
    picInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save Profile - UPDATED FOR SUPABASE
    form.onsubmit = async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let localUser = JSON.parse(localStorage.getItem('typeFlow_user'));

        const newPass = document.getElementById('profile-password').value;
        const file = picInput.files[0];

        try {
            // 1. Update Password if provided
            if (newPass) {
                const { error: passError } = await supabase.auth.updateUser({ password: newPass });
                if (passError) throw passError;
            }

            // 2. Process Image (Base64)
            let profilePicUrl = localUser.profilePic;
            if (file) {
                profilePicUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            }

            // 3. Update profiles table
            const { error: dbError } = await supabase
                .from('profiles')
                .update({ profile_pic: profilePicUrl })
                .eq('id', user.id);

            if (dbError) throw dbError;

            // 4. Update Local State & UI
            localUser.profilePic = profilePicUrl;
            localStorage.setItem('typeFlow_user', JSON.stringify(localUser));
            renderUserProfile(localUser);
            modal.style.display = 'none';
            alert("Profile updated successfully!");

        } catch (error) {
            console.error(error);
            alert("Update failed: " + error.message);
        }
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
