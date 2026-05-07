import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { PlayerStats } from "../types";

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

export const initializeUserStats = async (uid: string, email: string) => {
  const docRef = doc(db, "rankings", uid);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    const newStats: PlayerStats = {
      uid,
      username: email.split('@')[0],
      level: 1,
      ecosCollected: 0,
      unlockedEcos: [],
      lastSync: new Date()
    };
    await setDoc(docRef, newStats);
  }
};
