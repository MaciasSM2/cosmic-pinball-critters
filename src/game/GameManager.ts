import Matter from 'matter-js';
import { PinballPhysics, type PhysicsCallbacks } from '../engine/PinballPhysics';
import { PinballRenderer } from '../engine/PinballRenderer';
import { soundEngine } from '../engine/PinballAudio';
import type { CritterStats, ActiveBoss, HoleConfig, BumperConfig, BottomSlotConfig, PegConfig } from '../types/table';
import {
  WEEKLY_SCHEDULE,
  SPECIAL_3DAY_EVENTS,
  getCurrentDayEvent,
  getCurrent3DayEvent,
  type DailyEventConfig,
  type Special3DayEvent
} from '../tables/elementalTables';
import confetti from 'canvas-confetti';

export class GameManager {
  public physics: PinballPhysics;
  public renderer: PinballRenderer;

  // Estado de Sesión Pinball
  public score = 0;
  public highScore = 0;
  public multiplier = 1;
  public ballsRemaining = 3;
  public comboStreak = 0;
  public goldCoins = 0;

  // Monedas y Fragmentos RPG
  public elementalGems: Record<string, number> = {
    fire: 0,
    water: 0,
    earth: 0,
    wind: 0,
    void: 0
  };

  // Estadísticas de la partida en curso
  public runDamageDealt = 0;
  public runGoldEarned = 0;
  public runBossesDefeated = 0;
  public totalBossesDefeated = 0;

  // Escuadrón Extendido de Criaturas (Inspirado en Clash of Critters)
  public critters: CritterStats[] = [
    {
      id: 'critter_fire',
      name: 'Ignis',
      element: 'fire',
      level: 5,
      avatarIcon: '🔥',
      currentHp: 120,
      maxHp: 120,
      currentMana: 40,
      maxMana: 100,
      abilityName: 'Lluvia de Meteoros',
      abilityDescription: 'Causa 1200 de daño al Jefe y multiplica los bumpers por x2 durante 8s.',
      damage: 1200,
      rarity: 'common',
      unlocked: true
    },
    {
      id: 'critter_water',
      name: 'Aquara',
      element: 'water',
      level: 4,
      avatarIcon: '💧',
      currentHp: 100,
      maxHp: 100,
      currentMana: 60,
      maxMana: 100,
      abilityName: 'Burbuja Guardiana',
      abilityDescription: 'Activa un escudo salvavidas en el drenaje inferior que rescata la bola 1 vez.',
      damage: 600,
      rarity: 'common',
      unlocked: true
    },
    {
      id: 'critter_earth',
      name: 'Golemix',
      element: 'earth',
      level: 6,
      avatarIcon: '🌿',
      currentHp: 180,
      maxHp: 180,
      currentMana: 30,
      maxMana: 100,
      abilityName: 'Terremoto de Gemas',
      abilityDescription: 'Extrae 50 gemas y genera una sacudida masiva que centra la bola en la mesa.',
      damage: 800,
      rarity: 'rare',
      unlocked: true
    },
    {
      id: 'critter_wind',
      name: 'Zephyra',
      element: 'wind',
      level: 5,
      avatarIcon: '⚡',
      currentHp: 110,
      maxHp: 110,
      currentMana: 75,
      maxMana: 100,
      abilityName: 'Tornado Multibola',
      abilityDescription: 'Genera una esfera etérea adicional en juego de inmediato.',
      damage: 700,
      rarity: 'rare',
      unlocked: true
    },
    {
      id: 'critter_void',
      name: 'Umbra',
      element: 'void',
      level: 1,
      avatarIcon: '🔮',
      currentHp: 200,
      maxHp: 200,
      currentMana: 20,
      maxMana: 100,
      abilityName: 'Vórtice Gravitacional',
      abilityDescription: 'Genera un agujero negro que absorbe bolas y las lanza a velocidad triple causando 1800 daño.',
      damage: 1800,
      rarity: 'epic',
      unlocked: false
    },
    {
      id: 'critter_light',
      name: 'Solaris',
      element: 'classic',
      level: 1,
      avatarIcon: '☀️',
      currentHp: 250,
      maxHp: 250,
      currentMana: 10,
      maxMana: 100,
      abilityName: 'Supernova Radiante',
      abilityDescription: 'Desata un destello solar supremo que recarga el 100% de maná a todos los aliados y causa 2500 daño.',
      damage: 2500,
      rarity: 'legendary',
      unlocked: false
    }
  ];

  // Callbacks de Eventos UI
  public onGameOver?: (stats: { score: number; highScore: number; goldEarned: number; bossDamage: number; bossesDefeated: number }) => void;
  public onBossDefeated?: (bossName: string, tier: number) => void;
  public onCritterUpdated?: () => void;

  // Jefe de la Mesa / Evento Activo
  public activeBoss: ActiveBoss = {
    id: 'boss_titangorgon',
    name: 'Titán Astral Gorgon',
    avatarIcon: '👾',
    element: 'fire',
    currentHp: 15000,
    maxHp: 15000,
    shield: 100
  };

  // Evento Semanal y de 3 Días
  public currentDaily: DailyEventConfig;
  public currentSpecialEvent: { event: Special3DayEvent; dayInEvent: number; hoursRemaining: number };
  public simulatedDayIndex = new Date().getDay();

  // Bucle de Animación
  private lastTime = 0;
  private animationId: number | null = null;
  public isRunning = false;

  // Escudo salvavidas de Aquara
  public isGuardianBubbleActive = false;

  constructor(canvas: HTMLCanvasElement) {
    this.currentDaily = getCurrentDayEvent();
    this.currentSpecialEvent = getCurrent3DayEvent();

    const callbacks: PhysicsCallbacks = {
      onScoreAdd: (points, element, pos) => this.handleScoreAdd(points, element, pos),
      onBumperHit: (bumper) => this.handleBumperHit(bumper),
      onHoleCaptured: (hole) => this.handleHoleCaptured(hole),
      onHoleEjected: (hole) => this.handleHoleEjected(hole),
      onBallDrain: (remaining) => this.handleBallDrain(remaining),
      onTiltTriggered: () => this.handleTiltTriggered(),
      onMultiballTriggered: () => this.handleMultiballTriggered(),
      onPegHit: (peg) => this.handlePegHit(peg),
      onBottomSlotHit: (slot, ball) => this.handleBottomSlotHit(slot, ball),
      onBurstCompleted: () => this.handleBurstCompleted()
    };

    this.physics = new PinballPhysics(this.currentDaily.tableConfig, callbacks);
    this.renderer = new PinballRenderer(canvas, this.physics, this.currentDaily.tableConfig);

    this.loadRpgProgress();
    this.setupEventListeners();
  }

  // Carga persistente de datos (LocalStorage)
  public loadRpgProgress() {
    try {
      const savedHigh = localStorage.getItem('pinball_high_score');
      if (savedHigh) this.highScore = parseInt(savedHigh, 10);

      const savedGold = localStorage.getItem('pinball_rpg_gold');
      if (savedGold) this.goldCoins = parseInt(savedGold, 10);

      const savedGems = localStorage.getItem('pinball_rpg_gems');
      if (savedGems) {
        this.elementalGems = { ...this.elementalGems, ...JSON.parse(savedGems) };
      }

      const savedBossCount = localStorage.getItem('pinball_bosses_defeated');
      if (savedBossCount) this.totalBossesDefeated = parseInt(savedBossCount, 10);

      const savedCritters = localStorage.getItem('pinball_rpg_critters');
      if (savedCritters) {
        const loaded: Partial<CritterStats>[] = JSON.parse(savedCritters);
        loaded.forEach((savedC) => {
          const existing = this.critters.find((c) => c.id === savedC.id);
          if (existing) {
            if (savedC.level !== undefined) existing.level = savedC.level;
            if (savedC.damage !== undefined) existing.damage = savedC.damage;
            if (savedC.maxHp !== undefined) existing.maxHp = savedC.maxHp;
            if (savedC.maxMana !== undefined) existing.maxMana = savedC.maxMana;
            if (savedC.unlocked !== undefined) existing.unlocked = savedC.unlocked;
          }
        });
      }
    } catch {
      // Ignorar fallos de parsing
    }
  }

  // Guardado persistente continuo de progreso
  public saveRpgProgress() {
    try {
      localStorage.setItem('pinball_high_score', this.highScore.toString());
      localStorage.setItem('pinball_rpg_gold', this.goldCoins.toString());
      localStorage.setItem('pinball_rpg_gems', JSON.stringify(this.elementalGems));
      localStorage.setItem('pinball_bosses_defeated', this.totalBossesDefeated.toString());
      localStorage.setItem(
        'pinball_rpg_critters',
        JSON.stringify(
          this.critters.map((c) => ({
            id: c.id,
            level: c.level,
            damage: c.damage,
            maxHp: c.maxHp,
            maxMana: c.maxMana,
            unlocked: c.unlocked
          }))
        )
      );
    } catch {
      // Ignorar fallos de LocalStorage
    }
  }

  // Cálculo de coste de mejora para criaturas
  public getCritterUpgradeCost(critterIndex: number) {
    const critter = this.critters[critterIndex];
    if (!critter) return { gold: 9999, gems: 999, element: 'fire', canAfford: false };

    const goldCost = Math.round(120 * Math.pow(1.3, critter.level));
    const gemCost = Math.round(4 + critter.level * 1.5);
    const gemElement = critter.element === 'classic' ? 'void' : critter.element;
    const currentGems = this.elementalGems[gemElement] || 0;

    const canAfford = this.goldCoins >= goldCost && currentGems >= gemCost;
    return { gold: goldCost, gems: gemCost, element: gemElement, canAfford };
  }

  // Subir nivel a una criatura
  public upgradeCritter(critterIndex: number): boolean {
    const critter = this.critters[critterIndex];
    if (!critter || !critter.unlocked) return false;

    const cost = this.getCritterUpgradeCost(critterIndex);
    if (!cost.canAfford) return false;

    // Descontar costes
    this.goldCoins -= cost.gold;
    this.elementalGems[cost.element] -= cost.gems;

    // Mejorar atributos
    critter.level++;
    critter.damage = Math.round(critter.damage * 1.25);
    critter.maxHp += 25;
    critter.currentHp = critter.maxHp;
    critter.maxMana = Math.min(150, critter.maxMana + 5);

    // Audio y feedback
    soundEngine.playLevelUp();
    this.saveRpgProgress();
    this.onCritterUpdated?.();

    this.renderer.addScorePopup(`▲ ${critter.name} NV.${critter.level}!`, 250, 420, '#ffd200');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    return true;
  }

  // Eclosionar Huevo Astral en el Altar de Invocación
  public hatchCosmicEgg(): { critter: CritterStats; isNewUnlock: boolean; bonusLevels: number } | null {
    const goldCost = 500;
    const voidGemsCost = 5;

    // Si tiene suficiente oro o gemas de vacío
    const canAffordWithGold = this.goldCoins >= goldCost;
    const canAffordWithGems = (this.elementalGems['void'] || 0) >= voidGemsCost;

    if (!canAffordWithGold && !canAffordWithGems) return null;

    if (canAffordWithGold) {
      this.goldCoins -= goldCost;
    } else {
      this.elementalGems['void'] -= voidGemsCost;
    }

    // Ruleta de invocación con probabilidades:
    // 50% criatura común, 30% rara, 15% épica (Umbra), 5% legendaria (Solaris)
    const roll = Math.random() * 100;
    let chosenId = 'critter_fire';

    if (roll < 25) chosenId = 'critter_fire';
    else if (roll < 50) chosenId = 'critter_water';
    else if (roll < 68) chosenId = 'critter_earth';
    else if (roll < 82) chosenId = 'critter_wind';
    else if (roll < 95) chosenId = 'critter_void';
    else chosenId = 'critter_light';

    const critter = this.critters.find((c) => c.id === chosenId)!;
    const isNewUnlock = !critter.unlocked;
    let bonusLevels = 0;

    if (isNewUnlock) {
      critter.unlocked = true;
    } else {
      bonusLevels = critter.rarity === 'legendary' ? 3 : critter.rarity === 'epic' ? 2 : 1;
      critter.level += bonusLevels;
      critter.damage = Math.round(critter.damage * (1 + bonusLevels * 0.15));
      critter.maxHp += bonusLevels * 20;
    }

    soundEngine.playEggHatch();
    this.saveRpgProgress();
    this.onCritterUpdated?.();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 }
    });

    return { critter, isNewUnlock, bonusLevels };
  }

  // Cambio de mesa para probar los 7 días y variantes
  public setDayVariation(dayIndex: number) {
    this.simulatedDayIndex = dayIndex;
    this.currentDaily = WEEKLY_SCHEDULE[dayIndex];
    this.physics.table = this.currentDaily.tableConfig;
    this.renderer.setTable(this.currentDaily.tableConfig);
    this.renderer.addScorePopup(`MESA: ${this.currentDaily.tableConfig.name}`, 250, 400, '#ffd200');
  }

  // Cambio de Evento Especial de 3 Días
  public setSpecialEventByIndex(eventIndex: number) {
    const event = SPECIAL_3DAY_EVENTS[eventIndex];
    this.currentSpecialEvent = {
      event,
      dayInEvent: 1,
      hoursRemaining: 68
    };

    // Actualizar Boss
    this.activeBoss = {
      id: event.id,
      name: event.bossName,
      avatarIcon: event.bossAvatar,
      element: event.element,
      currentHp: event.bossHp,
      maxHp: event.bossHp,
      shield: 100
    };

    this.renderer.addScorePopup(`EVENTO: ${event.name}`, 250, 400, '#f43f5e');
  }

  // Gestión de Puntos, Maná y Combos
  private handleScoreAdd(points: number, element: string, pos: { x: number; y: number }) {
    const finalPoints = points * this.multiplier;
    this.score += finalPoints;
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.saveRpgProgress();
    this.comboStreak++;

    // Subir multiplicador cada 10 combos
    if (this.comboStreak % 10 === 0 && this.multiplier < 5) {
      this.multiplier++;
      this.renderer.addScorePopup(`x${this.multiplier} MULTIPLICADOR!`, 250, 350, '#ffd200');
    }

    // Monedas ganadas
    const coinsEarned = Math.round(finalPoints / 100);
    this.goldCoins += coinsEarned;
    this.runGoldEarned += coinsEarned;

    // Gemas elementales
    if (element in this.elementalGems) {
      this.elementalGems[element] += 1;
    }

    this.renderer.addScorePopup(`+${finalPoints}`, pos.x, pos.y, '#38bdf8');
    this.renderer.addSparks(pos.x, pos.y, '#38bdf8', 8);
  }

  // Bumper Hit: Carga maná de la criatura elemental afín
  private handleBumperHit(bumper: BumperConfig) {
    this.renderer.triggerBumperFlash(bumper.id);
    if ('vibrate' in navigator) {
      try { navigator.vibrate(10); } catch { /* ignore */ }
    }

    const critter = this.critters.find((c) => c.element === bumper.element && c.unlocked);
    if (critter) {
      critter.currentMana = Math.min(critter.maxMana, critter.currentMana + 8);
      if (critter.currentMana === critter.maxMana) {
        this.renderer.addScorePopup(`${critter.name} LISTO!`, bumper.x, bumper.y - 20, '#ffd200');
      }
    }

    // Daño leve residual al jefe
    this.damageBoss(120);
  }

  // Caída en Hoyos Estratégicos ("Agujeros Deseados")
  private handleHoleCaptured(hole: HoleConfig) {
    if (hole.type === 'summon') {
      // Hoyo de Invocación: Carga masiva de maná para todo el equipo + gemas
      this.critters.forEach((c) => {
        if (c.unlocked) {
          c.currentMana = Math.min(c.maxMana, c.currentMana + 35);
        }
      });
      this.renderer.addScorePopup('¡INVOCACIÓN +35 MANÁ!', hole.x, hole.y - 25, '#38bdf8');
      this.renderer.addSparks(hole.x, hole.y, '#38bdf8', 25);
    } else if (hole.type === 'boss_vault') {
      // Bóveda del Jefe: Ataque Crítico Masivo
      const critDamage = 2500 * this.multiplier;
      this.damageBoss(critDamage);
      this.renderer.addScorePopup(`¡CRÍTICO BÓVEDA! -${critDamage}`, hole.x, hole.y - 25, '#ef4444');
      this.renderer.addSparks(hole.x, hole.y, '#ef4444', 30);
    } else if (hole.type === 'multiball_lock') {
      // Bloqueo de bola para multibola
      const currentLocks = this.physics.multiballLockCount;
      this.renderer.addScorePopup(`LOCK ${currentLocks}/3`, hole.x, hole.y - 25, '#eab308');
      this.renderer.addSparks(hole.x, hole.y, '#eab308', 20);
    }
  }

  private handleHoleEjected(hole: HoleConfig) {
    this.renderer.addSparks(hole.x, hole.y, '#ffffff', 14);
  }

  // Rebote en Clavo de Pachinko (Peg)
  private handlePegHit(peg: PegConfig) {
    this.renderer.addSparks(peg.x, peg.y, '#ffd200', 3);
    // Carga sutil de maná para la criatura líder desbloqueada
    const leader = this.critters.find((c) => c.unlocked);
    if (leader) {
      leader.currentMana = Math.min(leader.maxMana, leader.currentMana + 1);
    }
  }

  // Entrada en una de las 5 Ranuras Inferiores (Bottom Slots estilo Clash of Critters)
  private handleBottomSlotHit(slot: BottomSlotConfig, _ball: Matter.Body) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(slot.multiplier >= 10 ? [35, 20, 60] : 18); } catch { /* ignore */ }
    }

    const points = 1000 * slot.multiplier * this.multiplier;
    this.handleScoreAdd(points, slot.element, { x: slot.x, y: slot.y - 15 });

    if (slot.rewardType === 'boss_strike') {
      // Jackpot Central X10 - Ataque Masivo Directo al Jefe
      const jackpotDamage = 2200 * (slot.multiplier / 2);
      this.damageBoss(jackpotDamage);
      soundEngine.playJackpotFanfare();
      this.renderer.addScorePopup(`★ JACKPOT x10! -${jackpotDamage} ★`, 250, 320, '#ffd200');
      this.renderer.addSparks(slot.x, slot.y, '#ffd200', 35);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else if (slot.rewardType === 'mana') {
      // Recarga de Maná a todo el escuadrón
      this.critters.forEach((c) => {
        if (c.unlocked) {
          c.currentMana = Math.min(c.maxMana, c.currentMana + 15 * (slot.multiplier / 2));
        }
      });
      this.renderer.addScorePopup(`+MANÁ x${slot.multiplier}`, slot.x, slot.y - 25, slot.color);
    } else if (slot.rewardType === 'gems') {
      this.elementalGems[slot.element] = (this.elementalGems[slot.element] || 0) + 3;
      this.renderer.addScorePopup(`+3 GEMAS`, slot.x, slot.y - 25, slot.color);
    } else if (slot.rewardType === 'gold') {
      const g = 250 * slot.multiplier;
      this.goldCoins += g;
      this.runGoldEarned += g;
      this.renderer.addScorePopup(`+${g} ORO`, slot.x, slot.y - 25, slot.color);
    }
  }

  // Notificación de Fin de Ráfaga de 15 Bolas
  private handleBurstCompleted() {
    this.renderer.addScorePopup('¡RÁFAGA DE 15 BOLAS FINALIZADA!', 250, 360, '#ffd200');
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });
  }

  // Disparo manual de la Ráfaga de 15 Bolas
  public trigger15BallBurst() {
    this.physics.launch15BallBurst();
    this.renderer.addScorePopup('¡LANZANDO RÁFAGA 15 BOLAS!', 250, 420, '#ffd200');
  }

  // Daño infligido al Jefe de la Mesa
  public damageBoss(amount: number) {
    this.runDamageDealt += amount;
    this.activeBoss.currentHp = Math.max(0, this.activeBoss.currentHp - amount);

    if (this.activeBoss.currentHp <= 0) {
      // ¡Jefe Derrotado!
      this.runBossesDefeated++;
      this.totalBossesDefeated++;
      soundEngine.playBossDefeated();
      this.saveRpgProgress();

      this.renderer.addScorePopup('¡JEFE DERROTADO!', 250, 300, '#ffd200');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 }
      });

      this.score += 25000;
      this.goldCoins += 500;
      this.runGoldEarned += 500;

      // Subir de nivel a las criaturas desbloqueadas
      this.critters.forEach((c) => {
        if (c.unlocked) {
          c.level++;
          c.maxHp += 20;
          c.damage += 150;
        }
      });
      this.onCritterUpdated?.();
      this.onBossDefeated?.(this.activeBoss.name, this.totalBossesDefeated);

      // Respawn del jefe con mayor dificultad
      setTimeout(() => {
        this.activeBoss.maxHp = Math.round(this.activeBoss.maxHp * 1.3);
        this.activeBoss.currentHp = this.activeBoss.maxHp;
        this.renderer.addScorePopup(`¡JEFE NV.${this.totalBossesDefeated + 1} APARECIÓ!`, 250, 300, '#ef4444');
      }, 3500);
    }
  }

  // Activación de Habilidad de Criatura por el jugador
  public castCritterAbility(index: number) {
    const critter = this.critters[index];
    if (!critter || !critter.unlocked || critter.currentMana < critter.maxMana) return;

    critter.currentMana = 0;
    soundEngine.playCreatureAbility(critter.element);
    this.renderer.addScorePopup(`¡${critter.abilityName.toUpperCase()}!`, 250, 350, '#38bdf8');

    if (critter.id === 'critter_fire') {
      // Ignis: Lluvia de Meteoros (daño masivo)
      this.damageBoss(critter.damage);
      this.renderer.addSparks(250, 150, '#ff3366', 40);
    } else if (critter.id === 'critter_water') {
      // Aquara: Burbuja Guardiana
      this.isGuardianBubbleActive = true;
      this.renderer.addScorePopup('🛡️ ESCUDO DRENAJE ACTIVO', 250, 680, '#00f2fe');
    } else if (critter.id === 'critter_earth') {
      // Golemix: Terremoto
      this.physics.nudge(0, -1);
      this.damageBoss(critter.damage);
      this.goldCoins += 150;
      this.runGoldEarned += 150;
    } else if (critter.id === 'critter_wind') {
      // Zephyra: Multiball Tornado
      this.physics.spawnBall(250, 650);
      this.renderer.addScorePopup('⚡ BOLA EXTRA!', 250, 650, '#fbbf24');
    } else if (critter.id === 'critter_void') {
      // Umbra: Vórtice Gravitacional
      this.damageBoss(critter.damage);
      this.physics.nudge(0, -2);
      this.renderer.addSparks(250, 300, '#a855f7', 50);
    } else if (critter.id === 'critter_light') {
      // Solaris: Supernova Radiante
      this.damageBoss(critter.damage);
      this.critters.forEach((c) => { if (c.unlocked) c.currentMana = c.maxMana; });
      this.physics.spawnBall(250, 500);
      this.renderer.addScorePopup('☀️ SUPERNOVA!', 250, 300, '#fef08a');
    }
  }

  private handleBallDrain(remainingBalls: number) {
    this.comboStreak = 0;
    this.multiplier = 1;

    // Si la burbuja guardiana está activa, salvar la bola
    if (this.isGuardianBubbleActive) {
      this.isGuardianBubbleActive = false;
      this.physics.spawnBall(250, 600);
      this.renderer.addScorePopup('¡BURBUJA RESCATÓ LA BOLA!', 250, 650, '#00f2fe');
      return;
    }

    if (remainingBalls === 0) {
      this.ballsRemaining--;
      if (this.ballsRemaining > 0) {
        // Respawn de bola en el plunger
        setTimeout(() => {
          this.physics.spawnBall();
        }, 1200);
      } else {
        // Fin de la partida
        this.saveRpgProgress();
        this.renderer.addScorePopup('FIN DE PARTIDA', 250, 400, '#ef4444');
        this.onGameOver?.({
          score: this.score,
          highScore: this.highScore,
          goldEarned: this.runGoldEarned,
          bossDamage: this.runDamageDealt,
          bossesDefeated: this.runBossesDefeated
        });
      }
    }
  }

  private handleTiltTriggered() {
    this.comboStreak = 0;
    this.multiplier = 1;
    this.renderer.addScorePopup('¡TILT - MESAS BLOQUEADAS!', 250, 450, '#ef4444');
  }

  private handleMultiballTriggered() {
    this.renderer.addScorePopup('¡MULTIBOLA ACTIVADA!', 250, 300, '#eab308');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
  }

  public restartGame() {
    this.score = 0;
    this.multiplier = 1;
    this.comboStreak = 0;
    this.ballsRemaining = 3;
    this.runDamageDealt = 0;
    this.runGoldEarned = 0;
    this.runBossesDefeated = 0;
    this.physics.balls.forEach((b) => Matter.Composite.remove(this.physics.engine.world, b));
    this.physics.balls = [];
    this.physics.capturedBalls.clear();
    this.physics.spawnBall();
  }

  // Teclado y Controles PC
  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      // Flippers
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.physics.setLeftFlipper(true);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.physics.setRightFlipper(true);
      }

      // Plunger
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.physics.chargePlunger(0.08);
      }

      // Nudge (Manipulación Activa)
      if (e.key === 'q' || e.key === 'Q') {
        this.physics.nudge(-1, 0); // Sacudida izquierda
      }
      if (e.key === 'e' || e.key === 'E') {
        this.physics.nudge(1, 0); // Sacudida derecha
      }
      if (e.key === 'w' || e.key === 'W') {
        this.physics.nudge(0, -1); // Sacudida arriba
      }

      // Pulso Magnético (Espacio o Shift)
      if (e.key === ' ' || e.key === 'Shift') {
        this.physics.setMagneticControl(true);
      }

      // Ráfaga Masiva de 15 Bolas [R]
      if (e.key === 'r' || e.key === 'R') {
        this.trigger15BallBurst();
      }

      // Criaturas 1, 2, 3, 4
      if (['1', '2', '3', '4'].includes(e.key)) {
        this.castCritterAbility(parseInt(e.key, 10) - 1);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.physics.setLeftFlipper(false);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.physics.setRightFlipper(false);
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.physics.releasePlunger();
      }
      if (e.key === ' ' || e.key === 'Shift') {
        this.physics.setMagneticControl(false);
      }
    });

    // Control de ratón/touch para el pulso magnético directo
    const canvas = this.renderer['canvas'];
    const updateTarget = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.physics.magneticTargetPos = {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    canvas.addEventListener('mousemove', (e) => {
      if (this.physics.isMagneticActive) {
        updateTarget(e.clientX, e.clientY);
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && this.physics.isMagneticActive) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  // Bucle principal de juego (Game Loop)
  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (now: number) => {
      const dtMs = Math.min(32, now - this.lastTime);
      this.lastTime = now;

      // Si se está cargando el plunger continuamente
      if (this.physics.isPlungerCharging) {
        this.physics.chargePlunger(dtMs / 1000);
      }

      this.physics.update(dtMs);
      this.renderer.render(dtMs);

      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
