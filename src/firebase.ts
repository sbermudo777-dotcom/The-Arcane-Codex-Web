// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6g_OyljnZgmeFjqOvRjd4NtinYjKpOUQ",
  authDomain: "the-arcane-codex.firebaseapp.com",
  projectId: "the-arcane-codex",
  storageBucket: "the-arcane-codex.firebasestorage.app",
  messagingSenderId: "65959588585",
  appId: "1:65959588585:web:ff91d4ea1741ae4fc67678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;