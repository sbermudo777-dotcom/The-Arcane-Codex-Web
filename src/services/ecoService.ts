import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import type { Eco } from "../types";

export const getEcos = (callback: (ecos: Eco[]) => void) => {
  const q = query(collection(db, "ecos"), orderBy("name"));
  
  return onSnapshot(q, (snapshot) => {
    const ecos: Eco[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Eco));
    callback(ecos);
  });
};