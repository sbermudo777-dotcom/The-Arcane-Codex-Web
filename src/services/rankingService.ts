import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import type { PlayerStats } from "../types";

export const getRanking = (callback: (rankings: PlayerStats[]) => void) => {
  const q = query(collection(db, "rankings"), orderBy("ecosCollected", "desc"), limit(20));
  
  return onSnapshot(q, (snapshot) => {
    const rankings = snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    } as PlayerStats));
    
    // Cachear localmente
    localStorage.setItem('arcane_ranking_cache', JSON.stringify(rankings));
    
    callback(rankings);
  });
};

export const getCachedRanking = (): PlayerStats[] => {
  const cached = localStorage.getItem('arcane_ranking_cache');
  return cached ? JSON.parse(cached) : [];
};