import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import type { Eco } from "../types";

/**
 * Obtiene el listado completo de Ecos (fragmentos de historia y bestias) en tiempo real.
 * Ordena las criaturas alfabéticamente por su nombre para una visualización ordenada en el bestiario.
 *
 * @param callback Función de retorno que recibe el listado actualizado de Ecos.
 * @returns Función de desuscripción de Firestore para liberar los recursos del observador en tiempo real.
 */
export const getEcos = (callback: (ecos: Eco[]) => void, onError?: (error: any) => void) => {
  const q = query(collection(db, "ecos"), orderBy("name"));
  
  return onSnapshot(q, 
    (snapshot) => {
      const ecos: Eco[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Eco));
      callback(ecos);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("Error in getEcos onSnapshot:", error);
      }
    }
  );
};
