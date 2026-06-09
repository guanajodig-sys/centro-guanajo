import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwEh5Xj33XSXYgjG0qiaAAJ-VHRJgnUJ4",
  authDomain: "centro-digitacion-app-c0163.firebaseapp.com",
  projectId: "centro-digitacion-app-c0163",
  storageBucket: "centro-digitacion-app-c0163.firebasestorage.app",
  messagingSenderId: "755010918894",
  appId: "1:755010918894:web:6c12b546b5201cf71716ff"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);