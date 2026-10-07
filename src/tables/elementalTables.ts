import type { TableConfig, ElementType } from '../types/table';
import { spaceCadetTable } from './spaceCadetTable';

export interface DailyEventConfig {
  dayIndex: number; // 0=Domingo, 1=Lunes, ... 6=Sábado
  dayName: string;
  isFullContentWeekend: boolean;
  tableConfig: TableConfig;
  dropBonus: string;
}

export interface Special3DayEvent {
  id: string;
  cycleDays: [number, number]; // e.g. [1, 3], [4, 6], [7, 9], [10, 12]
  name: string;
  description: string;
  modifierName: string;
  bossName: string;
  bossHp: number;
  bossAvatar: string;
  element: ElementType;
  tableOverride: Partial<TableConfig>;
}

// 1. Variación Lunes: Caverna de Magma
const fireTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_fire',
  name: 'Caverna de Magma',
  theme: 'Volcánico e Ígneo',
  element: 'fire',
  description: 'Los bumpers generan explosiones de calor que aumentan el rebote un 20%.',
  bumpers: spaceCadetTable.bumpers.map((b) => ({
    ...b,
    color: '#ff3366',
    element: 'fire',
    restitution: b.restitution * 1.15
  }))
};

// 2. Variación Martes: Falla Abisal
const waterTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_water',
  name: 'Falla Abisal',
  theme: 'Acuático y Fluido',
  element: 'water',
  description: 'Fricción casi nula. La bola se desliza a gran velocidad simulando corrientes submarinas.',
  ballFriction: 0.0005,
  bumpers: spaceCadetTable.bumpers.map((b) => ({
    ...b,
    color: '#00f2fe',
    element: 'water'
  }))
};

// 3. Variación Miércoles: Arboleda de Gaia
const earthTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_earth',
  name: 'Bastión de Gaia',
  theme: 'Tierra y Roca',
  element: 'earth',
  description: 'Bola más densa y pesada. Requiere mayor precisión con los flippers para alcanzar la cima.',
  ballRestitution: 0.65,
  gravityY: 1.35,
  bumpers: spaceCadetTable.bumpers.map((b) => ({
    ...b,
    color: '#10b981',
    element: 'earth'
  }))
};

// 4. Variación Jueves: Corredor de Zéfiro
const windTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_wind',
  name: 'Corredor de Zéfiro',
  theme: 'Viento Celestial',
  element: 'wind',
  description: 'Gravedad aligerada y ráfagas ascendentes. Ideal para tiros aéreos y cadenas de combos.',
  gravityY: 0.95,
  bumpers: spaceCadetTable.bumpers.map((b) => ({
    ...b,
    color: '#fbbf24',
    element: 'wind'
  }))
};

// 5. Variación Viernes: Vórtice del Vacío
const voidTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_void',
  name: 'Vórtice del Vacío',
  theme: 'Oscuridad y Portales',
  element: 'void',
  description: 'Los agujeros otorgan el doble de puntuación y maná dimensional.',
  bumpers: spaceCadetTable.bumpers.map((b) => ({
    ...b,
    color: '#a855f7',
    element: 'void'
  })),
  holes: spaceCadetTable.holes.map((h) => ({
    ...h,
    scoreBonus: h.scoreBonus * 2
  }))
};

// Fin de semana: Gran Arena Cósmica (Full Content)
const weekendTable: TableConfig = {
  ...spaceCadetTable,
  id: 'table_weekend',
  name: 'Gran Arena Estelar (Fin de Semana)',
  theme: 'Full Content All-Elements',
  element: 'classic',
  description: '¡Todos los portales elementales activos simultáneamente con bonificación x2!',
  holes: spaceCadetTable.holes.map((h) => ({
    ...h,
    scoreBonus: Math.round(h.scoreBonus * 1.5)
  }))
};

// Calendario Semanal 7 Días (5 Días Variaciones + 2 Días Full Content)
export const WEEKLY_SCHEDULE: DailyEventConfig[] = [
  { dayIndex: 0, dayName: 'Domingo', isFullContentWeekend: true, tableConfig: weekendTable, dropBonus: '🌟 Todo el Contenido + Drop x2 Criaturas' },
  { dayIndex: 1, dayName: 'Lunes', isFullContentWeekend: false, tableConfig: fireTable, dropBonus: '🔥 Núcleos de Fuego y Rubíes' },
  { dayIndex: 2, dayName: 'Martes', isFullContentWeekend: false, tableConfig: waterTable, dropBonus: '💧 Esencias Abisales y Zafiros' },
  { dayIndex: 3, dayName: 'Miércoles', isFullContentWeekend: false, tableConfig: earthTable, dropBonus: '🌿 Gemas de Gaia y Esmeraldas' },
  { dayIndex: 4, dayName: 'Jueves', isFullContentWeekend: false, tableConfig: windTable, dropBonus: '⚡ Plumas Celestiales y Topacios' },
  { dayIndex: 5, dayName: 'Viernes', isFullContentWeekend: false, tableConfig: voidTable, dropBonus: '🔮 Runas del Vacío y Amatistas' },
  { dayIndex: 6, dayName: 'Sábado', isFullContentWeekend: true, tableConfig: weekendTable, dropBonus: '🌟 Todo el Contenido + Oro x2 en Bumper Hits' }
];

// 4 Eventos de 3 Días que Rotan Cíclicamente en el Mes
export const SPECIAL_3DAY_EVENTS: Special3DayEvent[] = [
  {
    id: 'event_cosmic_invasion',
    cycleDays: [1, 3],
    name: 'Invasión Cósmica',
    description: 'El Titan Estelar ataca la mesa. Emboca en la Bóveda del Jefe para romper su escudo antes de que acaben los 3 días.',
    modifierName: 'Impacto de Meteorito (+Puntuación en Bóveda)',
    bossName: 'Titán Astral Gorgon',
    bossHp: 25000,
    bossAvatar: '👾',
    element: 'fire',
    tableOverride: {
      gravityY: 1.2
    }
  },
  {
    id: 'event_golden_flipper',
    cycleDays: [4, 6],
    name: 'Torneo del Flipper Dorado',
    description: 'Modo Score Attack puro. Compite por el récord de puntos con multiplicadores de combo x3.',
    modifierName: 'Flippers de Oro (Recuperación Instantánea de Maná)',
    bossName: 'Guardián del Flipper',
    bossHp: 30000,
    bossAvatar: '🏆',
    element: 'wind',
    tableOverride: {
      ballRestitution: 0.82
    }
  },
  {
    id: 'event_critter_nursery',
    cycleDays: [7, 9],
    name: 'Santuario de Crías Míticas',
    description: 'Los hoyos de invocación liberan huevos legendarios. ¡Probabilidad triplicada de invocar a Drakonir!',
    modifierName: 'Eclosión Cuántica (Maná Máximo)',
    bossName: 'Quimera Espectral',
    bossHp: 22000,
    bossAvatar: '🐉',
    element: 'void',
    tableOverride: {}
  },
  {
    id: 'event_zero_gravity',
    cycleDays: [10, 12],
    name: 'Falla de Gravedad Cero',
    description: 'Física espacial anómala con gravedad ultra reducida. Requiere dominio del Nudge y el Pulso Magnético.',
    modifierName: 'Microgravedad Orbital (Gravedad reducida 50%)',
    bossName: 'Singularidad Viviente',
    bossHp: 28000,
    bossAvatar: '🌌',
    element: 'water',
    tableOverride: {
      gravityY: 0.58
    }
  }
];

export function getCurrentDayEvent(): DailyEventConfig {
  const day = new Date().getDay();
  return WEEKLY_SCHEDULE[day];
}

export function getCurrent3DayEvent(simulatedDayOfMonth?: number): { event: Special3DayEvent; dayInEvent: number; hoursRemaining: number } {
  const day = simulatedDayOfMonth !== undefined ? simulatedDayOfMonth : new Date().getDate();
  // Ciclo continuo de 12 días (4 eventos x 3 días)
  const cycleDay = ((day - 1) % 12) + 1; // 1 a 12
  const eventIndex = Math.floor((cycleDay - 1) / 3);
  const event = SPECIAL_3DAY_EVENTS[eventIndex];
  const dayInEvent = ((cycleDay - 1) % 3) + 1;
  const hoursRemaining = (3 - dayInEvent) * 24 + 14;

  return { event, dayInEvent, hoursRemaining };
}
