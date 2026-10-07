import type { TableConfig } from '../types/table';

export const spaceCadetTable: TableConfig = {
  id: 'table_space_cadet',
  name: 'Nebula Station Alpha',
  theme: 'Estación Espacial Clásica',
  element: 'classic',
  description: 'Mesa de pinball orbital con reactores iónicos, vórtice de teletransporte y bóveda del comandante.',
  width: 500,
  height: 800,
  gravityY: 1.15, // Gravedad inclinada realista
  ballRestitution: 0.72,
  ballFriction: 0.003,

  bumpers: [
    {
      id: 'bumper_top_mid',
      x: 230,
      y: 220,
      radius: 28,
      scoreValue: 500,
      restitution: 1.6,
      color: '#00f2fe',
      element: 'water',
      label: '500'
    },
    {
      id: 'bumper_top_left',
      x: 165,
      y: 280,
      radius: 28,
      scoreValue: 500,
      restitution: 1.6,
      color: '#ff0844',
      element: 'fire',
      label: '500'
    },
    {
      id: 'bumper_top_right',
      x: 295,
      y: 280,
      radius: 28,
      scoreValue: 500,
      restitution: 1.6,
      color: '#ffd200',
      element: 'wind',
      label: '500'
    },
    {
      id: 'bumper_mini_reactor',
      x: 230,
      y: 335,
      radius: 18,
      scoreValue: 1000,
      restitution: 1.8,
      color: '#a855f7',
      element: 'void',
      label: '★'
    }
  ],

  holes: [
    {
      id: 'hole_summon_left',
      x: 85,
      y: 210,
      radius: 22,
      type: 'summon',
      label: 'INVOCACIÓN',
      color: '#38bdf8',
      element: 'water',
      scoreBonus: 2500,
      holdTimeMs: 1400,
      ejectAngleDeg: 45, // Dispara hacia abajo-derecha
      ejectForce: 14
    },
    {
      id: 'hole_boss_vault',
      x: 230,
      y: 110,
      radius: 20,
      type: 'boss_vault',
      label: 'BÓVEDA JEFE',
      color: '#ef4444',
      element: 'fire',
      scoreBonus: 5000,
      holdTimeMs: 1600,
      ejectAngleDeg: 90, // Dispara hacia abajo directamente
      ejectForce: 16
    },
    {
      id: 'hole_multiball_lock',
      x: 405,
      y: 320,
      radius: 22,
      type: 'multiball_lock',
      label: 'LOCK MULTI',
      color: '#eab308',
      element: 'earth',
      scoreBonus: 3500,
      holdTimeMs: 1200,
      ejectAngleDeg: 140, // Dispara hacia el centro-izquierda
      ejectForce: 13
    }
  ],

  dropTargets: [
    { id: 'target_1', x: 65, y: 340, width: 14, height: 26, scoreValue: 300, color: '#38bdf8' },
    { id: 'target_2', x: 65, y: 375, width: 14, height: 26, scoreValue: 300, color: '#f43f5e' },
    { id: 'target_3', x: 65, y: 410, width: 14, height: 26, scoreValue: 300, color: '#eab308' }
  ],

  walls: [
    // Borde exterior izquierdo
    { x1: 25, y1: 180, x2: 25, y2: 600 },
    // Canal de salida izquierdo (Outlane)
    { x1: 65, y1: 520, x2: 65, y2: 650 },
    // Inlane izquierdo hacia flipper
    { x1: 115, y1: 540, x2: 155, y2: 690 },

    // Borde exterior derecho (separador del carril del plunger)
    { x1: 445, y1: 180, x2: 445, y2: 780 },
    // Pared exterior derecha final
    { x1: 485, y1: 180, x2: 485, y2: 780 },
    // Inlane derecho hacia flipper
    { x1: 345, y1: 690, x2: 385, y2: 540 },
    // Outlane derecho
    { x1: 415, y1: 520, x2: 415, y2: 650 },

    // Cúpula superior izquierda (arco)
    { x1: 25, y1: 180, x2: 60, y2: 100 },
    { x1: 60, y1: 100, x2: 130, y2: 45 },
    { x1: 130, y1: 45, x2: 230, y2: 25 },
    // Cúpula superior derecha (arco hacia canal de entrada)
    { x1: 230, y1: 25, x2: 350, y2: 35 },
    { x1: 350, y1: 35, x2: 440, y2: 80 },
    { x1: 440, y1: 80, x2: 485, y2: 180 },

    // Desviadores y rieles centrales superiores
    { x1: 150, y1: 150, x2: 190, y2: 115 },
    { x1: 270, y1: 115, x2: 310, y2: 150 },

    // Slingshots (triángulos elásticos)
    { x1: 110, y1: 560, x2: 110, y2: 640, isBouncy: true, color: '#f43f5e' },
    { x1: 110, y1: 640, x2: 150, y2: 675, isBouncy: true, color: '#f43f5e' },
    { x1: 150, y1: 675, x2: 110, y2: 560, isBouncy: true, color: '#f43f5e' },

    { x1: 390, y1: 560, x2: 390, y2: 640, isBouncy: true, color: '#38bdf8' },
    { x1: 390, y1: 640, x2: 350, y2: 675, isBouncy: true, color: '#38bdf8' },
    { x1: 350, y1: 675, x2: 390, y2: 560, isBouncy: true, color: '#38bdf8' },

    // Deflector del canal del lanzador en la parte superior derecha
    { x1: 445, y1: 120, x2: 415, y2: 60 }
  ],

  // Clavos de Pachinko Asiático (Clash of Critters Style)
  pegs: [
    { id: 'peg_1_1', x: 170, y: 390, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_1_2', x: 230, y: 380, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_1_3', x: 290, y: 390, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_2_1', x: 140, y: 430, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_2_2', x: 200, y: 430, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_2_3', x: 260, y: 430, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_2_4', x: 320, y: 430, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_3_1', x: 170, y: 470, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_3_2', x: 230, y: 465, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_3_3', x: 290, y: 470, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_4_1', x: 140, y: 510, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_4_2', x: 200, y: 505, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_4_3', x: 260, y: 505, radius: 4.5, scoreValue: 100, restitution: 1.3 },
    { id: 'peg_4_4', x: 320, y: 510, radius: 4.5, scoreValue: 100, restitution: 1.3 }
  ],

  // 5 Huecos Inferiores de Puntuación y Salida (Clash of Critters Chutes)
  bottomSlots: [
    {
      id: 'slot_0',
      index: 0,
      x: 75,
      y: 775,
      width: 58,
      height: 28,
      multiplier: 2,
      label: 'x2 GEMA',
      color: '#38bdf8',
      element: 'water',
      rewardType: 'gems'
    },
    {
      id: 'slot_1',
      index: 1,
      x: 145,
      y: 775,
      width: 58,
      height: 28,
      multiplier: 5,
      label: 'x5 MANÁ',
      color: '#a855f7',
      element: 'void',
      rewardType: 'mana'
    },
    {
      id: 'slot_2',
      index: 2,
      x: 230,
      y: 775,
      width: 76,
      height: 28,
      multiplier: 10,
      label: '★ x10 JACKPOT ★',
      color: '#ffd200',
      element: 'classic',
      rewardType: 'boss_strike'
    },
    {
      id: 'slot_3',
      index: 3,
      x: 315,
      y: 775,
      width: 58,
      height: 28,
      multiplier: 5,
      label: 'x5 MANÁ',
      color: '#10b981',
      element: 'earth',
      rewardType: 'mana'
    },
    {
      id: 'slot_4',
      index: 4,
      x: 385,
      y: 775,
      width: 58,
      height: 28,
      multiplier: 2,
      label: 'x2 ORO',
      color: '#f43f5e',
      element: 'fire',
      rewardType: 'gold'
    }
  ]
};
