import { PinballPhysics } from './PinballPhysics';
import type { TableConfig } from '../types/table';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

interface BallTrailPoint {
  x: number;
  y: number;
  alpha: number;
}

export class PinballRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private physics: PinballPhysics;
  private table: TableConfig;

  private bgImage: HTMLImageElement | null = null;
  private isBgLoaded = false;

  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private ballTrails: Map<unknown, BallTrailPoint[]> = new Map();
  private bumperFlashTimers: Map<string, number> = new Map();

  constructor(canvas: HTMLCanvasElement, physics: PinballPhysics, table: TableConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.physics = physics;
    this.table = table;

    this.loadBackgroundImage();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private loadBackgroundImage() {
    this.bgImage = new Image();
    this.bgImage.src = '/assets/pinball_playfield_bg.jpg';
    this.bgImage.onload = () => {
      this.isBgLoaded = true;
    };
  }

  private resizeCanvas() {
    this.canvas.width = this.table.width;
    this.canvas.height = this.table.height;
  }

  public setTable(table: TableConfig) {
    this.table = table;
    this.resizeCanvas();
  }

  public addScorePopup(text: string, x: number, y: number, color = '#38bdf8') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 1.0,
      maxLife: 1.0
    });
  }

  public addSparks(x: number, y: number, color = '#00f2fe', count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 0.4 + Math.random() * 0.3,
        color,
        size: 2 + Math.random() * 3
      });
    }
  }

  public triggerBumperFlash(bumperId: string) {
    this.bumperFlashTimers.set(bumperId, performance.now() + 250);
  }

  public render(dtMs: number) {
    const ctx = this.ctx;
    const now = performance.now();
    const shake = this.physics.tableShakeOffset;

    ctx.save();
    // Aplicar temblor de mesa por Nudge
    ctx.translate(shake.x, shake.y);

    // 1. Fondo de la Mesa (Cyber Space Dark Gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.table.height);
    bgGrad.addColorStop(0, '#060913');
    bgGrad.addColorStop(0.5, '#0b1124');
    bgGrad.addColorStop(1, '#05070e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.table.width, this.table.height);

    // Textura Artística del Playfield con mezcla suave
    if (this.isBgLoaded && this.bgImage) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.drawImage(this.bgImage, 0, 0, this.table.width, this.table.height);
      ctx.restore();

      // Tinte temático elemental dinámico según el día/mesa
      const tintColor =
        this.table.element === 'fire' ? 'rgba(255, 8, 68, 0.22)' :
        this.table.element === 'water' ? 'rgba(0, 242, 254, 0.22)' :
        this.table.element === 'earth' ? 'rgba(16, 185, 129, 0.22)' :
        this.table.element === 'wind' ? 'rgba(251, 191, 36, 0.22)' :
        this.table.element === 'void' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(0, 0, 0, 0)';

      if (tintColor !== 'rgba(0, 0, 0, 0)') {
        ctx.fillStyle = tintColor;
        ctx.fillRect(0, 0, this.table.width, this.table.height);
      }
    }

    // Rejilla cibernética sutil de fondo
    this.renderGrid(ctx);

    // 2. Líneas y Rieles de Arte en la Madera/Acrílico
    this.renderPlayfieldArt(ctx);

    // 3. Agujeros Estratégicos ("Agujeros Deseados")
    this.renderHoles(ctx, now);

    // 4. Drop Targets
    this.renderDropTargets(ctx);

    // 5. Paredes y Slingshots
    this.renderWalls(ctx);

    // 5b. 5 Ranuras Inferiores de Puntuación (Clash of Critters Chutes)
    this.renderBottomSlots(ctx, now);

    // 6. Bumpers reactivos con iluminación
    this.renderBumpers(ctx, now);

    // 6b. Clavos de Pachinko (Pegs)
    this.renderPegs(ctx);

    // 7. Flippers
    this.renderFlippers(ctx);

    // 8. Plunger visual
    this.renderPlunger(ctx);

    // 9. Campo Magnético Activo ("Skill Steer")
    this.renderMagneticField(ctx, now);

    // 10. Bolas metálicas con estela y reflejo realista
    this.renderBalls(ctx, dtMs);

    // 11. Partículas de impacto
    this.renderParticles(ctx, dtMs);

    // 12. Textos flotantes de puntuación
    this.renderFloatingTexts(ctx, dtMs);

    // 12b. Banner de Ráfaga Masiva de 15 Bolas
    this.renderBurstBanner(ctx);

    // 13. Overlay de TILT si la mesa está bloqueada
    if (this.physics.isTilted) {
      this.renderTiltOverlay(ctx);
    }

    // 14. Capa de cristal protector y reflejo arcade
    this.renderGlassGlare(ctx);

    ctx.restore();
  }

  private renderGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
    ctx.lineWidth = 1;
    const step = 40;
    for (let x = 0; x < this.table.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.table.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.table.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.table.width, y);
      ctx.stroke();
    }
  }

  private renderPlayfieldArt(ctx: CanvasRenderingContext2D) {
    // Rieles de neón decorativos
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(230, 260, 115, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(244, 63, 94, 0.15)';
    ctx.beginPath();
    ctx.arc(230, 260, 140, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();

    // Líneas de dirección hacia los hoyos deseados
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
    ctx.beginPath();
    ctx.moveTo(230, 700);
    ctx.lineTo(85, 210);
    ctx.moveTo(230, 700);
    ctx.lineTo(230, 110);
    ctx.moveTo(230, 700);
    ctx.lineTo(405, 320);
    ctx.stroke();
    ctx.restore();
  }

  private renderHoles(ctx: CanvasRenderingContext2D, now: number) {
    this.table.holes.forEach((h) => {
      // Borde exterior con brillo
      ctx.save();
      const pulse = Math.sin(now * 0.005 + h.x) * 3;

      // Halo resplandeciente
      const glow = ctx.createRadialGradient(h.x, h.y, h.radius * 0.5, h.x, h.y, h.radius + 14 + pulse);
      glow.addColorStop(0, h.color);
      glow.addColorStop(0.6, 'rgba(0,0,0,0.5)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius + 14 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Interior oscuro del agujero (profundidad)
      ctx.fillStyle = '#020408';
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fill();

      // Anillo metálico de borde
      ctx.strokeStyle = h.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Anillo de vórtice giratorio
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const swirlAngle = (now * 0.003) % (Math.PI * 2);
      ctx.arc(h.x, h.y, h.radius * 0.6, swirlAngle, swirlAngle + Math.PI * 1.2);
      ctx.stroke();

      // Etiqueta flotante del hoyo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = h.color;
      ctx.shadowBlur = 6;
      ctx.fillText(h.label, h.x, h.y + h.radius + 12);

      ctx.restore();
    });
  }

  private renderDropTargets(ctx: CanvasRenderingContext2D) {
    this.table.dropTargets.forEach((t) => {
      ctx.fillStyle = t.color;
      ctx.fillRect(t.x - t.width / 2, t.y - t.height / 2, t.width, t.height);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(t.x - t.width / 2, t.y - t.height / 2, t.width, t.height);
    });
  }

  private renderWalls(ctx: CanvasRenderingContext2D) {
    this.table.walls.forEach((w) => {
      ctx.save();
      if (w.isBouncy) {
        // Slingshot elástico
        ctx.strokeStyle = w.color || '#f43f5e';
        ctx.lineWidth = 5;
        ctx.shadowColor = w.color || '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();
      } else {
        // Pared metálica pulida
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();

        // Línea central de luz de neón
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  private renderBumpers(ctx: CanvasRenderingContext2D, now: number) {
    this.table.bumpers.forEach((b) => {
      const isFlashing = (this.bumperFlashTimers.get(b.id) || 0) > now;
      const radius = isFlashing ? b.radius * 1.12 : b.radius;

      ctx.save();

      // Halo de brillo
      const halo = ctx.createRadialGradient(b.x, b.y, radius * 0.3, b.x, b.y, radius * 1.6);
      halo.addColorStop(0, isFlashing ? '#ffffff' : b.color);
      halo.addColorStop(0.5, b.color);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo exterior del bumper
      ctx.fillStyle = isFlashing ? '#ffffff' : '#0f172a';
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = isFlashing ? 20 : 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Núcleo central iluminado
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Etiqueta de puntuación
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(b.label || '500', b.x, b.y);

      ctx.restore();
    });
  }

  private renderFlippers(ctx: CanvasRenderingContext2D) {
    const renderFlipperBody = (flipper: Matter.Body, color: string) => {
      ctx.save();
      ctx.translate(flipper.position.x, flipper.position.y);
      ctx.rotate(flipper.angle);

      const w = 72;
      const h = 16;
      const r = 7;

      // Cuerpo del Flipper con gradiente metálico
      const grad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, '#0f172a');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, r);
      ctx.fill();
      ctx.stroke();

      // Remache del pivote
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(-w / 2 + 10, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    renderFlipperBody(this.physics.leftFlipper, '#38bdf8');
    renderFlipperBody(this.physics.rightFlipper, '#f43f5e');
  }

  private renderPlunger(ctx: CanvasRenderingContext2D) {
    const x = 465;
    const topY = 720;
    const charge = this.physics.plungerCharge;
    const compression = charge * 35;

    ctx.save();
    // Resorte
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const coils = 6;
    for (let i = 0; i < coils; i++) {
      const curY = topY + compression + i * ((60 - compression) / coils);
      const offsetX = i % 2 === 0 ? -6 : 6;
      if (i === 0) ctx.moveTo(x, curY);
      else ctx.lineTo(x + offsetX, curY);
    }
    ctx.stroke();

    // Cabeza del lanzador
    ctx.fillStyle = charge > 0.1 ? '#ef4444' : '#38bdf8';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, topY + compression, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderMagneticField(ctx: CanvasRenderingContext2D, now: number) {
    if (!this.physics.isMagneticActive || this.physics.magneticEnergy <= 0) return;

    ctx.save();
    this.physics.balls.forEach((ball) => {
      const target = this.physics.magneticTargetPos || { x: 230, y: 150 };

      // Rayo cibernético de atracción
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
      ctx.lineWidth = 2 + Math.sin(now * 0.02) * 1.5;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(ball.position.x, ball.position.y);
      // Arco sinusoidal electromagnético
      const midX = (ball.position.x + target.x) / 2 + Math.sin(now * 0.03) * 15;
      const midY = (ball.position.y + target.y) / 2 + Math.cos(now * 0.03) * 15;
      ctx.quadraticCurveTo(midX, midY, target.x, target.y);
      ctx.stroke();

      // Ondas concéntricas alrededor de la bola
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.beginPath();
      const waveRadius = 14 + ((now * 0.04) % 20);
      ctx.arc(ball.position.x, ball.position.y, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  private renderBalls(ctx: CanvasRenderingContext2D, _dtMs: number) {
    this.physics.balls.forEach((ball) => {
      const x = ball.position.x;
      const y = ball.position.y;
      const radius = 10.5;

      // Actualizar estela
      let trail = this.ballTrails.get(ball);
      if (!trail) {
        trail = [];
        this.ballTrails.set(ball, trail);
      }
      trail.unshift({ x, y, alpha: 0.6 });
      if (trail.length > 8) trail.pop();

      // Dibujar estela luminosa
      ctx.save();
      for (let i = 0; i < trail.length; i++) {
        const pt = trail[i];
        pt.alpha *= 0.82;
        ctx.fillStyle = `rgba(56, 189, 248, ${pt.alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * (1 - i / trail.length), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Sombra dinámica proyectada por la bola de acero
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(x + 5, y + 7, radius * 1.15, radius * 0.75, Math.PI / 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Esfera de acero realista con reflejo cromado
      ctx.save();
      const chromeGrad = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.1,
        x,
        y,
        radius
      );
      chromeGrad.addColorStop(0, '#ffffff'); // Brillo especular
      chromeGrad.addColorStop(0.35, '#cbd5e1'); // Metal claro
      chromeGrad.addColorStop(0.7, '#64748b'); // Sombra de acero
      chromeGrad.addColorStop(1, '#1e293b'); // Borde oscuro

      ctx.fillStyle = chromeGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Anillo de brillo exterior
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    });
  }

  private renderParticles(ctx: CanvasRenderingContext2D, dtMs: number) {
    ctx.save();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dtMs / 1000 / p.maxLife;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D, dtMs: number) {
    ctx.save();
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 1.2;
      ft.life -= dtMs / 1000 / ft.maxLife;

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
        continue;
      }

      ctx.fillStyle = ft.color;
      ctx.globalAlpha = Math.max(0, ft.life);
      ctx.font = 'bold 15px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }

  private renderTiltOverlay(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.fillRect(0, 0, this.table.width, this.table.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 14;
    ctx.fillText('¡TILT!', this.table.width / 2, this.table.height / 2);

    ctx.font = '600 16px sans-serif';
    ctx.fillText('FLIPPERS BLOQUEADOS TEMPORALMENTE', this.table.width / 2, this.table.height / 2 + 45);
    ctx.restore();
  }

  private renderGlassGlare(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const glass = ctx.createLinearGradient(0, 0, this.table.width * 1.2, this.table.height * 0.8);
    glass.addColorStop(0, 'rgba(255, 255, 255, 0.07)');
    glass.addColorStop(0.18, 'rgba(255, 255, 255, 0.01)');
    glass.addColorStop(0.28, 'rgba(255, 255, 255, 0.05)');
    glass.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    glass.addColorStop(0.85, 'rgba(255, 255, 255, 0.015)');
    glass.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glass;
    ctx.fillRect(0, 0, this.table.width, this.table.height);
    ctx.restore();
  }

  // Renderizado de Clavos de Pachinko (Pegs Metálicos)
  private renderPegs(ctx: CanvasRenderingContext2D) {
    if (!this.table.pegs) return;
    this.table.pegs.forEach((p) => {
      ctx.save();
      // Halo luminoso sutil alrededor del clavo
      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
      ctx.fill();

      // Clavo cromado brillante
      const pegGrad = ctx.createRadialGradient(p.x - 1.5, p.y - 1.5, 0.5, p.x, p.y, p.radius);
      pegGrad.addColorStop(0, '#ffffff');
      pegGrad.addColorStop(0.5, '#cbd5e1');
      pegGrad.addColorStop(1, '#334155');
      ctx.fillStyle = pegGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    });
  }

  // Renderizado de las 5 Ranuras Inferiores (Clash of Critters Chutes)
  private renderBottomSlots(ctx: CanvasRenderingContext2D, now: number) {
    if (!this.table.bottomSlots) return;

    this.table.bottomSlots.forEach((slot) => {
      ctx.save();
      const x = slot.x;
      const y = slot.y;
      const w = slot.width;
      const h = slot.height;
      const isJackpot = slot.multiplier >= 10;
      const pulse = isJackpot ? Math.sin(now * 0.008) * 4 : 0;

      // Fondo de la cavidad receptora del slot
      ctx.fillStyle = '#05070e';
      ctx.fillRect(x - w / 2, y - h / 2, w, h);

      // Marco de neón
      ctx.strokeStyle = slot.color;
      ctx.lineWidth = isJackpot ? 2.5 : 1.5;
      ctx.shadowColor = slot.color;
      ctx.shadowBlur = isJackpot ? 12 + pulse : 6;
      ctx.strokeRect(x - w / 2, y - h / 2, w, h);

      // Iluminación interna de fondo
      const slotGrad = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
      slotGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
      slotGrad.addColorStop(1, slot.color + '44');
      ctx.fillStyle = slotGrad;
      ctx.fillRect(x - w / 2, y - h / 2, w, h);

      // Postes divisores a los extremos
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillRect(x - w / 2 - 2, y - h / 2 - 6, 3, 24);
      ctx.fillRect(x + w / 2 - 1, y - h / 2 - 6, 3, 24);

      // Etiqueta de multiplicador y recompensa
      ctx.fillStyle = isJackpot ? '#ffffff' : slot.color;
      ctx.font = `bold ${isJackpot ? 10 : 9}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = slot.color;
      ctx.shadowBlur = 5;
      ctx.fillText(slot.label, x, y);

      ctx.restore();
    });
  }

  // Banner visual cuando la ráfaga de 15 bolas está activa
  private renderBurstBanner(ctx: CanvasRenderingContext2D) {
    if (!this.physics.isBurstActive) return;
    ctx.save();
    ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.strokeStyle = '#ffd200';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ffd200';
    ctx.shadowBlur = 10;

    const bannerY = 40;
    ctx.fillRect(70, bannerY, 360, 26);
    ctx.strokeRect(70, bannerY, 360, 26);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⚡ RÁFAGA PACHINKO: ${this.physics.burstBallsRemaining} / 15 BOLAS`, 250, bannerY + 13);
    ctx.restore();
  }
}
