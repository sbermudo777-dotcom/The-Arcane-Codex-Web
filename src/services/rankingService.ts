import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import type { PlayerStats } from "../types";

export const getRanking = (callback: (players: PlayerStats[]) => void) => {
  const q = query(
    collection(db, "rankings"), 
    orderBy("ecosCollected", "desc"), 
    limit(10)
  );
  
  return onSnapshot(q, (snapshot) => {
    const players: PlayerStats[] = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    } as PlayerStats));
    callback(players);
    
    // Mirror persistence to LocalStorage
    localStorage.setItem('arcane_ranking_cache', JSON.stringify(players));
  });
};

export const getCachedRanking = (): PlayerStats[] => {
  const cached = localStorage.getItem('arcane_ranking_cache');
  return cached ? JSON.parse(cached) : [];
};
