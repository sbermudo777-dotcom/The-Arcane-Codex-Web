/**
 * Representa un fragmento de la historia o criatura del mundo de Aethelgard.
 * Se utiliza en el Códice Arcano (Bestiario/Wiki) para mostrar información desbloqueable.
 */
export interface Eco {
  // Identificador único del fragmento en la base de datos
  id?: string;
  // Nombre del eco o criatura
  name: string;
  // Descripción breve de su naturaleza
  description: string;
  // Historia detallada desbloqueable
  lore: string;
  // Indica si el jugador actual ha desbloqueado este eco
  unlocked: boolean;
  // Tipo de eco (enemigo, historia o ubicación)
  type: 'enemy' | 'lore' | 'location';
  // Rareza del fragmento, influye en su estilo visual
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  // Ruta o URL de la imagen del eco
  imageUrl?: string;
}

/**
 * Representa las estadísticas de combate de un enemigo en el juego.
 */
export interface Enemy {
  // Identificador único del enemigo
  id: string;
  // Nombre de la criatura
  name: string;
  // Categoría o familia de la criatura
  type: 'Acechador' | 'Sabueso' | 'Golem';
  // Descripción de sus patrones y origen
  description: string;
  // Puntos de salud del enemigo
  health: number;
  // Capacidad de daño del ataque
  attack: number;
  // Velocidad de movimiento en combate
  speed: number;
  // Trasfondo mitológico de la criatura
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
