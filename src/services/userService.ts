import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { PlayerStats } from "../types";

/**
 * Escucha en tiempo real los cambios en las estadísticas y el registro de un jugador específico.
 *
 * @param uid Identificador único del usuario de Firebase.
 * @param callback Función de retorno que recibe el registro del jugador o null si no existe.
 * @returns Función de desuscripción de Firestore para detener la escucha en tiempo real.
 */
export const getPlayerStats = (uid: string, callback: (stats: PlayerStats | null) => void) => {
  const docRef = doc(db, "rankings", uid);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        ...snapshot.data(),
        uid: snapshot.id
      } as PlayerStats);
    } else {
      callback(null);
    }
  });
};

/**
 * Inicializa el registro de estadísticas de un nuevo jugador en Firestore.
 * Crea un documento por primera vez si no existe en la colección de rankings,
 * omitiendo campos obsoletos de niveles o recolección de fragmentos.
 *
 * @param uid Identificador único de Firebase.
 * @param email Correo electrónico utilizado para extraer el nombre de usuario inicial.
 */
export const initializeUserStats = async (uid: string, email: string) => {
  const docRef = doc(db, "rankings", uid);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    const newStats: PlayerStats = {
      uid,
      username: email.split('@')[0],
      unlockedEcos: [],
      lastSync: new Date()
    };
    await setDoc(docRef, newStats);
  }
};
