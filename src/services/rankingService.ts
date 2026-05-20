import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "../firebase";
import type { PlayerStats } from "../types";

/**
 * Obtiene la clasificación en tiempo real de los 10 jugadores más rápidos (Top 10).
 * Filtra los documentos de la colección 'rankings' que posean un tiempo récord válido
 * y los ordena de menor a mayor (orden ascendente).
 *
 * @param callback Función de retorno que recibe el listado actualizado de estadísticas de jugadores.
 * @returns Función de desuscripción del observador de Firestore.
 */
export const getRanking = (callback: (players: PlayerStats[]) => void) => {
  const q = query(
    collection(db, "rankings"),
    where("bestTime", ">", 0),
    orderBy("bestTime", "asc"),
    limit(10)
  );
  
  return onSnapshot(q, (snapshot) => {
    const players: PlayerStats[] = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    } as PlayerStats));
    callback(players);
    
    // Persistencia de respaldo local para carga inmediata en la interfaz de usuario
    localStorage.setItem('arcane_ranking_cache', JSON.stringify(players));
  });
};

/**
 * Recupera el listado de clasificación almacenado localmente en el caché del navegador.
 * Permite renderizar el ranking de forma instantánea mientras se sincroniza con el servidor.
 *
 * @returns Listado de estadísticas de jugadores recuperado de LocalStorage.
 */
export const getCachedRanking = (): PlayerStats[] => {
  const cached = localStorage.getItem('arcane_ranking_cache');
  return cached ? JSON.parse(cached) : [];
};
