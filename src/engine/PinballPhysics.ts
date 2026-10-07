import Matter from 'matter-js';
import type { TableConfig, HoleConfig, BumperConfig, PegConfig, BottomSlotConfig, GameMode } from '../types/table';
import { soundEngine } from './PinballAudio';

const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;

export interface PhysicsCallbacks {
  onScoreAdd: (points: number, element: string, position: { x: number; y: number }) => void;
  onBumperHit: (bumper: BumperConfig) => void;
  onHoleCaptured: (hole: HoleConfig) => void;
  onHoleEjected: (hole: HoleConfig) => void;
  onBallDrain: (remainingBalls: number) => void;
  onTiltTriggered: () => void;
  onMultiballTriggered: () => void;
  onPegHit: (peg: PegConfig) => void;
  onBottomSlotHit: (slot: BottomSlotConfig, ball: Matter.Body) => void;
  onBurstCompleted: () => void;
}

export class PinballPhysics {
  public engine: Matter.Engine;
  public table: TableConfig;
  public balls: Matter.Body[] = [];
  
  // Modos de Juego: Clásico (1 bola) vs Pachinko Masivo (15 bolas continuas)
  public gameMode: GameMode = 'classic_single';
  public isBurstActive = false;
  public burstBallsRemaining = 0;
  private burstIntervalTimer: number | null = null;
  
  // Flippers
  public leftFlipper!: Matter.Body;
  public rightFlipper!: Matter.Body;
  private leftPivot!: { x: number; y: number };
  private rightPivot!: { x: number; y: number };
  public isLeftFlipperUp = false;
  public isRightFlipperUp = false;

  // Plunger
  public isPlungerCharging = false;
  public plungerCharge = 0; // 0 a 1

  // Nudge / Tilt System
  public tiltWarnings = 0;
  public isTilted = false;
  private tiltResetTimer: number | null = null;
  private tiltLockoutTimer: number | null = null;
  public tableShakeOffset = { x: 0, y: 0 };

  // Manipulación Activa: Pulso Magnético / Dirección
  public isMagneticActive = false;
  public magneticEnergy = 100; // 0 a 100
  public maxMagneticEnergy = 100;
  public magneticTargetPos: { x: number; y: number } | null = null;

  // Estado de Hoyos
  public capturedBalls: Map<Matter.Body, { hole: HoleConfig; releaseTime: number }> = new Map();
  public multiballLockCount = 0;

  // Callbacks
  private callbacks: PhysicsCallbacks;

  constructor(table: TableConfig, callbacks: PhysicsCallbacks) {
    this.table = table;
    this.callbacks = callbacks;
    this.engine = Engine.create({
      gravity: { x: 0, y: table.gravityY, scale: 0.001 }
    });

    this.setupTable();
    this.setupFlippers();
    this.setupCollisionHandlers();
    this.spawnBall();
  }

  // Configuración de paredes, bumpers y hoyos
  private setupTable() {
    const world = this.engine.world;

    // Paredes del tablero
    this.table.walls.forEach((w) => {
      const midX = (w.x1 + w.x2) / 2;
      const midY = (w.y1 + w.y2) / 2;
      const length = Math.hypot(w.x2 - w.x1, w.y2 - w.y1);
      const angle = Math.atan2(w.y2 - w.y1, w.x2 - w.x1);

      const wall = Bodies.rectangle(midX, midY, length, 12, {
        isStatic: true,
        angle: angle,
        restitution: w.isBouncy ? 1.4 : 0.25,
        friction: 0.01,
        render: { visible: false },
        label: w.isBouncy ? 'slingshot' : 'wall'
      });
      Composite.add(world, wall);
    });

    // Bumpers circulares reactivos
    this.table.bumpers.forEach((b) => {
      const bumperBody = Bodies.circle(b.x, b.y, b.radius, {
        isStatic: true,
        restitution: b.restitution,
        friction: 0.0,
        label: `bumper_${b.id}`,
        plugin: { bumperConfig: b }
      });
      Composite.add(world, bumperBody);
    });

    // Drop targets abatibles
    this.table.dropTargets.forEach((t) => {
      const targetBody = Bodies.rectangle(t.x, t.y, t.width, t.height, {
        isStatic: true,
        restitution: 0.8,
        label: `droptarget_${t.id}`,
        plugin: { targetConfig: t }
      });
      Composite.add(world, targetBody);
    });

    // Fondo / Drain sensor (debajo de los flippers)
    const drainSensor = Bodies.rectangle(250, 850, 600, 40, {
      isStatic: true,
      isSensor: true,
      label: 'drain'
    });
    Composite.add(world, drainSensor);

    // Clavos de Pachinko (Pegs metálicos)
    if (this.table.pegs) {
      this.table.pegs.forEach((p) => {
        const pegBody = Bodies.circle(p.x, p.y, p.radius, {
          isStatic: true,
          restitution: p.restitution,
          friction: 0.001,
          label: `peg_${p.id}`,
          plugin: { pegConfig: p }
        });
        Composite.add(world, pegBody);
      });
    }

    // 5 Ranuras Inferiores de Puntuación (Bottom Slots estilo Clash of Critters)
    if (this.table.bottomSlots) {
      this.table.bottomSlots.forEach((s) => {
        const slotSensor = Bodies.rectangle(s.x, s.y, s.width, s.height, {
          isStatic: true,
          isSensor: true,
          label: `bottomslot_${s.index}`,
          plugin: { slotConfig: s }
        });

        // Postes divisores a los lados de la ranura
        const postLeft = Bodies.rectangle(s.x - s.width / 2, s.y - 6, 4, 24, {
          isStatic: true,
          restitution: 0.8,
          label: 'slot_post'
        });
        const postRight = Bodies.rectangle(s.x + s.width / 2, s.y - 6, 4, 24, {
          isStatic: true,
          restitution: 0.8,
          label: 'slot_post'
        });

        Composite.add(world, [slotSensor, postLeft, postRight]);
      });
    }
  }

  // Creación de Flippers con cinemática precisa
  private setupFlippers() {
    const world = this.engine.world;
    const flipperWidth = 72;
    const flipperHeight = 16;

    this.leftPivot = { x: 175, y: 720 };
    this.rightPivot = { x: 325, y: 720 };

    // Flipper Izquierdo
    this.leftFlipper = Bodies.rectangle(this.leftPivot.x + 30, this.leftPivot.y, flipperWidth, flipperHeight, {
      chamfer: { radius: 7 },
      density: 0.02,
      restitution: 0.5,
      friction: 0.05,
      label: 'flipper_left',
      collisionFilter: { group: -1 }
    });

    const leftConstraint = Constraint.create({
      pointA: this.leftPivot,
      bodyB: this.leftFlipper,
      pointB: { x: -flipperWidth / 2 + 10, y: 0 },
      stiffness: 1,
      length: 0
    });

    // Flipper Derecho
    this.rightFlipper = Bodies.rectangle(this.rightPivot.x - 30, this.rightPivot.y, flipperWidth, flipperHeight, {
      chamfer: { radius: 7 },
      density: 0.02,
      restitution: 0.5,
      friction: 0.05,
      label: 'flipper_right',
      collisionFilter: { group: -1 }
    });

    const rightConstraint = Constraint.create({
      pointA: this.rightPivot,
      bodyB: this.rightFlipper,
      pointB: { x: flipperWidth / 2 - 10, y: 0 },
      stiffness: 1,
      length: 0
    });

    Composite.add(world, [this.leftFlipper, leftConstraint, this.rightFlipper, rightConstraint]);
  }

  // Spawn de bola metálica
  public spawnBall(x = 465, y = 730): Matter.Body {
    const ball = Bodies.circle(x, y, 10.5, {
      density: 0.015,
      restitution: this.table.ballRestitution,
      friction: this.table.ballFriction,
      frictionAir: 0.0006,
      label: 'ball'
    });

    this.balls.push(ball);
    Composite.add(this.engine.world, ball);
    return ball;
  }

  // Control de Flipper Izquierdo
  public setLeftFlipper(up: boolean) {
    if (this.isTilted) return;
    if (this.isLeftFlipperUp !== up) {
      this.isLeftFlipperUp = up;
      if (up) soundEngine.playFlipperUp();
      else soundEngine.playFlipperDown();
    }
  }

  // Control de Flipper Derecho
  public setRightFlipper(up: boolean) {
    if (this.isTilted) return;
    if (this.isRightFlipperUp !== up) {
      this.isRightFlipperUp = up;
      if (up) soundEngine.playFlipperUp();
      else soundEngine.playFlipperDown();
    }
  }

  // Plunger (Lanzador de resorte)
  public chargePlunger(dt: number) {
    if (this.isTilted) return;
    this.isPlungerCharging = true;
    this.plungerCharge = Math.min(1.0, this.plungerCharge + dt * 1.5);
  }

  public releasePlunger() {
    if (this.plungerCharge <= 0.05) {
      this.isPlungerCharging = false;
      this.plungerCharge = 0;
      return;
    }

    const power = this.plungerCharge;
    soundEngine.playPlungerLaunch(power);

    // Buscar la bola que esté en el canal del plunger
    const plungerBall = this.balls.find((b) => b.position.x > 445 && b.position.y > 600);
    if (plungerBall) {
      const launchSpeed = -18 - power * 14; // Impulso vertical masivo hacia el arco
      Body.setVelocity(plungerBall, { x: 0, y: launchSpeed });
    }

    this.plungerCharge = 0;
    this.isPlungerCharging = false;
  }

  // Manipulación Activa 1: Sistema de Nudge (Sacudida de Mesa)
  public nudge(dirX: number, dirY: number) {
    if (this.isTilted) return;

    soundEngine.playNudge();
    this.tableShakeOffset = { x: dirX * 12, y: dirY * 12 };

    // Aplicar fuerza de inercia a todas las bolas activas
    this.balls.forEach((ball) => {
      if (!this.capturedBalls.has(ball)) {
        Body.applyForce(ball, ball.position, {
          x: dirX * 0.009,
          y: dirY * 0.007
        });
      }
    });

    // Control de Tilt
    this.tiltWarnings++;
    if (this.tiltResetTimer) clearTimeout(this.tiltResetTimer);
    this.tiltResetTimer = window.setTimeout(() => {
      this.tiltWarnings = 0;
    }, 4000);

    if (this.tiltWarnings >= 3) {
      this.triggerTilt();
    }
  }

  private triggerTilt() {
    this.isTilted = true;
    this.isLeftFlipperUp = false;
    this.isRightFlipperUp = false;
    soundEngine.playTiltAlarm();
    this.callbacks.onTiltTriggered();

    if (this.tiltLockoutTimer) clearTimeout(this.tiltLockoutTimer);
    this.tiltLockoutTimer = window.setTimeout(() => {
      this.isTilted = false;
      this.tiltWarnings = 0;
    }, 3800);
  }

  // Manipulación Activa 2: Pulso Magnético / Dirección de Bola ("Skill Steer")
  public setMagneticControl(active: boolean, targetPos?: { x: number; y: number }) {
    if (this.isTilted || this.magneticEnergy <= 5) {
      this.isMagneticActive = false;
      soundEngine.stopMagneticHum();
      return;
    }

    this.isMagneticActive = active;
    if (targetPos) {
      this.magneticTargetPos = targetPos;
    }

    if (active) {
      soundEngine.startMagneticHum();
    } else {
      soundEngine.stopMagneticHum();
    }
  }

  // Manejador de Colisiones e Impactos
  private setupCollisionHandlers() {
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null;
        const other = ball === bodyA ? bodyB : bodyA;

        if (!ball || !other) continue;

        // Bumper Hit
        if (other.label?.startsWith('bumper_')) {
          const cfg = (other as unknown as { plugin: { bumperConfig: BumperConfig } }).plugin?.bumperConfig;
          if (cfg) {
            soundEngine.playBumperHit();
            this.callbacks.onBumperHit(cfg);
            this.callbacks.onScoreAdd(cfg.scoreValue, cfg.element, { x: other.position.x, y: other.position.y });

            // Recupera energía magnética al golpear bumpers
            this.magneticEnergy = Math.min(this.maxMagneticEnergy, this.magneticEnergy + 12);

            // Impulso extra para gran rebote arcade
            const dir = Vector.normalise(Vector.sub(ball.position, other.position));
            Body.applyForce(ball, ball.position, Vector.mult(dir, 0.022));
          }
        }

        // Slingshot Hit
        if (other.label === 'slingshot') {
          soundEngine.playSlingshot();
          this.callbacks.onScoreAdd(150, 'classic', { x: ball.position.x, y: ball.position.y });
          const normal = Vector.normalise({ x: 250 - ball.position.x, y: -0.6 });
          Body.applyForce(ball, ball.position, Vector.mult(normal, 0.016));
        }

        // Drop Target Hit
        if (other.label?.startsWith('droptarget_')) {
          soundEngine.playSlingshot();
          this.callbacks.onScoreAdd(300, 'classic', { x: ball.position.x, y: ball.position.y });
        }

        // Pachinko Peg Hit
        if (other.label?.startsWith('peg_')) {
          soundEngine.playPegHit();
          const pConfig = (other as unknown as { plugin: { pegConfig: PegConfig } }).plugin?.pegConfig;
          if (pConfig) {
            this.callbacks.onPegHit(pConfig);
            this.callbacks.onScoreAdd(pConfig.scoreValue, 'classic', { x: other.position.x, y: other.position.y });
          }
        }

        // Entrada en una de las 5 Ranuras Inferiores (Bottom Slots)
        if (other.label?.startsWith('bottomslot_')) {
          const sIndex = parseInt(other.label.split('_')[1], 10);
          const slot = this.table.bottomSlots?.find((s) => s.index === sIndex);
          if (slot) {
            soundEngine.playSlotHit(slot.multiplier);
            this.callbacks.onBottomSlotHit(slot, ball);

            // Remover la bola que entró a la ranura
            Composite.remove(this.engine.world, ball);
            this.balls = this.balls.filter((b) => b !== ball);
            this.capturedBalls.delete(ball);

            if (this.isBurstActive) {
              this.burstBallsRemaining--;
              if (this.burstBallsRemaining <= 0) {
                this.isBurstActive = false;
                this.callbacks.onBurstCompleted();
              }
            }
          }
        }

        // Drain general
        if (other.label === 'drain') {
          this.handleBallDrain(ball);
        }
      }
    });
  }

  // Drenado de bola
  private handleBallDrain(ball: Matter.Body) {
    Composite.remove(this.engine.world, ball);
    this.balls = this.balls.filter((b) => b !== ball);
    this.capturedBalls.delete(ball);

    soundEngine.playBallDrain();
    this.callbacks.onBallDrain(this.balls.length);
  }

  // Detección y manejo de Hoyos Estratégicos ("Agujeros Deseados")
  private updateHoles(now: number) {
    for (const ball of this.balls) {
      if (this.capturedBalls.has(ball)) {
        const capture = this.capturedBalls.get(ball)!;
        // Mantener la bola centrada en el hoyo
        Body.setPosition(ball, { x: capture.hole.x, y: capture.hole.y });
        Body.setVelocity(ball, { x: 0, y: 0 });

        if (now >= capture.releaseTime) {
          // Expulsar la bola
          this.capturedBalls.delete(ball);
          soundEngine.playHoleEject();
          this.callbacks.onHoleEjected(capture.hole);

          const rad = (capture.hole.ejectAngleDeg * Math.PI) / 180;
          const force = capture.hole.ejectForce;
          Body.setVelocity(ball, {
            x: Math.cos(rad) * force,
            y: Math.sin(rad) * force
          });
        }
        continue;
      }

      // Comprobar si entra a algún hoyo
      for (const hole of this.table.holes) {
        const dist = Math.hypot(ball.position.x - hole.x, ball.position.y - hole.y);
        const ballSpeed = Vector.magnitude(ball.velocity);

        // Si la bola está cerca y no va a velocidad supersónica (o es succionada)
        if (dist < hole.radius && ballSpeed < 22) {
          soundEngine.playHoleCapture(hole.type === 'boss_vault');
          this.capturedBalls.set(ball, {
            hole,
            releaseTime: now + hole.holdTimeMs
          });

          this.callbacks.onHoleCaptured(hole);
          this.callbacks.onScoreAdd(hole.scoreBonus, hole.element, { x: hole.x, y: hole.y });

          // Lógica especial de hoyo Multiball Lock
          if (hole.type === 'multiball_lock') {
            this.multiballLockCount++;
            if (this.multiballLockCount >= 3) {
              this.multiballLockCount = 0;
              this.triggerMultiball();
            }
          }
          break;
        }
      }
    }
  }

  // Disparo de Multibola
  public triggerMultiball() {
    this.callbacks.onMultiballTriggered();
    // Spawn de 2 bolas adicionales disparadas hacia arriba
    const b1 = this.spawnBall(220, 680);
    const b2 = this.spawnBall(280, 680);
    Body.setVelocity(b1, { x: -6, y: -18 });
    Body.setVelocity(b2, { x: 6, y: -18 });
  }

  // Actualización de física en cada frame
  public update(dtMs: number) {
    const now = performance.now();

    // Reducción del temblor de mesa por nudge
    this.tableShakeOffset.x *= 0.85;
    this.tableShakeOffset.y *= 0.85;

    // Actualización de Flipper Izquierdo
    const targetLeftAngle = this.isLeftFlipperUp ? -0.52 : 0.48;
    const leftCurrentAngle = this.leftFlipper.angle;
    const leftAngleDiff = targetLeftAngle - leftCurrentAngle;
    Body.setAngularVelocity(this.leftFlipper, leftAngleDiff * 0.35);

    // Actualización de Flipper Derecho
    const targetRightAngle = this.isRightFlipperUp ? 0.52 : -0.48;
    const rightCurrentAngle = this.rightFlipper.angle;
    const rightAngleDiff = targetRightAngle - rightCurrentAngle;
    Body.setAngularVelocity(this.rightFlipper, rightAngleDiff * 0.35);

    // Actualización de manipulación magnética activa
    if (this.isMagneticActive && this.magneticEnergy > 0) {
      this.magneticEnergy = Math.max(0, this.magneticEnergy - (dtMs / 1000) * 22);

      // Si no se agotó, aplicar la fuerza de atracción
      this.balls.forEach((ball) => {
        if (!this.capturedBalls.has(ball)) {
          let target = this.magneticTargetPos;
          // Si no hay target explícito del ratón/touch, buscar el hoyo más cercano
          if (!target) {
            let closestHole: HoleConfig | null = null;
            let minDist = Infinity;
            this.table.holes.forEach((h) => {
              const d = Math.hypot(ball.position.x - h.x, ball.position.y - h.y);
              if (d < minDist) {
                minDist = d;
                closestHole = h;
              }
            });
            if (closestHole) {
              target = { x: (closestHole as HoleConfig).x, y: (closestHole as HoleConfig).y };
            }
          }

          if (target) {
            const pullVector = Vector.sub(target, ball.position);
            const dist = Vector.magnitude(pullVector);
            if (dist > 10 && dist < 320) {
              const pullForce = Vector.mult(Vector.normalise(pullVector), 0.0035);
              Body.applyForce(ball, ball.position, pullForce);
            }
          }
        }
      });

      if (this.magneticEnergy <= 0) {
        this.setMagneticControl(false);
      }
    } else {
      // Regeneración pasiva lenta de energía magnética
      this.magneticEnergy = Math.min(this.maxMagneticEnergy, this.magneticEnergy + (dtMs / 1000) * 3);
    }

    // Comprobar hoyos
    this.updateHoles(now);

    // Sub-stepping de física: 4 iteraciones a 240Hz para evitar tunneling y garantizar rebotes hiperprecisos
    const subSteps = 4;
    const subDelta = 1000 / 60 / subSteps;
    for (let s = 0; s < subSteps; s++) {
      Engine.update(this.engine, subDelta);
    }
  }

  // Lanzamiento de Ráfaga Masiva Pachinko de 15 Bolas Continuas (Asian / Clash of Critters Style)
  public launch15BallBurst() {
    if (this.isBurstActive) return;
    this.isBurstActive = true;
    this.gameMode = 'massive_15_burst';
    this.burstBallsRemaining = 15;
    let launched = 0;

    if (this.burstIntervalTimer !== null) {
      window.clearInterval(this.burstIntervalTimer);
    }

    this.burstIntervalTimer = window.setInterval(() => {
      if (launched >= 15) {
        if (this.burstIntervalTimer !== null) {
          window.clearInterval(this.burstIntervalTimer);
          this.burstIntervalTimer = null;
        }
        return;
      }

      launched++;
      const ball = this.spawnBall(465, 730);
      soundEngine.playBurstLaunch();
      const launchSpeed = -24 - Math.random() * 5.5;
      const angleJitter = (Math.random() - 0.5) * 1.8;
      Body.setVelocity(ball, { x: angleJitter, y: launchSpeed });
    }, 90);
  }
}
