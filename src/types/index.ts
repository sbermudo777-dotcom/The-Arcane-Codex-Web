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

export interface PlayerStats {
  uid: string;
  username: string;
  level: number;
  ecosCollected: number;
  unlockedEcos: string[]; // IDs de los ecos desbloqueados por este jugador
  lastSync: Date | any;
}