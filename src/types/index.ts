export interface Eco {
  id?: string;
  name: string;
  description: string;
  lore: string;
  unlocked: boolean;
  type: 'enemy' | 'lore' | 'location';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
}

export interface Enemy {
  id: string;
  name: string;
  type: 'Acechador' | 'Sabueso' | 'Golem';
  description: string;
  health: number;
  attack: number;
  speed: number;
  lore: string;
}

/**
 * Representa las estadísticas y el registro de finalización de un jugador (Guardián).
 * Se utiliza para mapear los documentos de la base de datos Firestore y gestionar el ranking.
 */
export interface PlayerStats {
  // Identificador único del usuario de Firebase
  uid: string;
  // Apodo de la cuenta del usuario
  username?: string;
  // Nombre arcade ingresado por el jugador al terminar la partida
  playerName?: string;
  // El mejor tiempo de finalización registrado (en segundos)
  bestTime?: number;
  // Lista opcional de identificadores de Ecos (criaturas/lore) desbloqueados
  unlockedEcos?: string[];
  // Fecha y hora de la última sincronización con el servidor
  lastSync: Date | any;
}
