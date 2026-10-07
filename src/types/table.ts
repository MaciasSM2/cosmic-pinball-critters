export type ElementType = 'fire' | 'water' | 'earth' | 'wind' | 'void' | 'classic';

export type HoleType = 'summon' | 'boss_vault' | 'multiball_lock' | 'bonus_pocket';

export type GameMode = 'classic_single' | 'massive_15_burst';

export interface PegConfig {
  id: string;
  x: number;
  y: number;
  radius: number;
  scoreValue: number;
  restitution: number;
}

export interface BottomSlotConfig {
  id: string;
  index: number; // 0 a 4 (5 ranuras)
  x: number;
  y: number;
  width: number;
  height: number;
  multiplier: number; // 2x, 5x, 10x, 5x, 2x
  label: string;
  color: string;
  element: ElementType;
  rewardType: 'gold' | 'mana' | 'boss_strike' | 'gems';
}

export interface BumperConfig {
  id: string;
  x: number;
  y: number;
  radius: number;
  scoreValue: number;
  restitution: number; // Fuerza de rebote
  color: string;
  element: ElementType;
  label?: string;
}

export interface HoleConfig {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: HoleType;
  label: string;
  color: string;
  element: ElementType;
  scoreBonus: number;
  holdTimeMs: number; // Tiempo que retiene la bola antes de dispararla
  ejectAngleDeg: number; // Dirección de salida en grados
  ejectForce: number; // Fuerza con la que expulsa la bola
}

export interface DropTargetConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scoreValue: number;
  color: string;
}

export interface WallSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isBouncy?: boolean;
  color?: string;
}

export interface TableConfig {
  id: string;
  name: string;
  theme: string;
  element: ElementType;
  description: string;
  width: number;
  height: number;
  gravityY: number;
  ballRestitution: number;
  ballFriction: number;
  bumpers: BumperConfig[];
  holes: HoleConfig[];
  dropTargets: DropTargetConfig[];
  walls: WallSegment[];
  pegs?: PegConfig[];
  bottomSlots?: BottomSlotConfig[];
  specialModifiers?: {
    gravityMultiplier?: number;
    frictionMultiplier?: number;
    magneticFieldStrength?: number;
  };
}

export interface CritterStats {
  id: string;
  name: string;
  element: ElementType;
  level: number;
  avatarIcon: string;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  abilityName: string;
  abilityDescription: string;
  damage: number;
}

export interface ActiveBoss {
  id: string;
  name: string;
  avatarIcon: string;
  element: ElementType;
  currentHp: number;
  maxHp: number;
  shield: number;
}
