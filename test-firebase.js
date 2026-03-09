
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVlcFFCuJrrhn51JVZx34KXuvLjkZ9UFg",
    authDomain: "typeflow-eb1bb.firebaseapp.com",
    databaseURL: "https://typeflow-eb1bb-default-rtdb.firebaseio.com",
    projectId: "typeflow-eb1bb",
    storageBucket: "typeflow-eb1bb.firebasestorage.app",
    messagingSenderId: "80670400979",
    appId: "1:80670400979:web:8d3230b6b219df76f50f26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Testing Firebase connectivity...");

signInAnonymously(auth)
    .then(() => {
        console.log("SUCCESS: Firebase Auth is reachable!");
    })
    .catch((error) => {
        console.error("FAILURE: Firebase Auth error:", error.code, error.message);
    });
