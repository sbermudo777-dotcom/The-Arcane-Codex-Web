// Importación de funciones esenciales de los SDKs de Firebase requeridos para el proyecto
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración de conexión de Firebase para la aplicación web "The Arcane Codex"
const firebaseConfig = {
  apiKey: "AIzaSyA6g_OyljnZgmeFjqOvRjd4NtinYjKpOUQ",
  authDomain: "the-arcane-codex.firebaseapp.com",
  projectId: "the-arcane-codex",
  storageBucket: "the-arcane-codex.firebasestorage.app",
  messagingSenderId: "65959588585",
  appId: "1:65959588585:web:ff91d4ea1741ae4fc67678"
};

// Inicialización de la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicialización de los servicios base de la base de datos Firestore y la autenticación
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;