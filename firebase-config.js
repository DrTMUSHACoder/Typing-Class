import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
export const auth = getAuth(app);
export const db = getDatabase(app);
