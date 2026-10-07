import './style.css';
import { GameManager } from './game/GameManager';
import { soundEngine } from './engine/PinballAudio';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pinball-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const game = new GameManager(canvas);
  game.start();

  // Elementos DOM
  const valScore = document.getElementById('val-score')!;
  const valHighScore = document.getElementById('val-high-score')!;
  const valCombo = document.getElementById('val-combo')!;
  const valBalls = document.getElementById('val-balls')!;
  const valGold = document.getElementById('val-gold')!;
  const gemsList = document.getElementById('gems-list')!;
  const crittersList = document.getElementById('critters-list')!;

  const bossName = document.getElementById('boss-name')!;
  const bossAvatarImg = document.getElementById('boss-avatar-img') as HTMLImageElement | null;
  const bossHpText = document.getElementById('boss-hp-text')!;
  const bossHpFill = document.getElementById('boss-hp-fill') as HTMLElement;

  const led1 = document.getElementById('led-1')!;
  const led2 = document.getElementById('led-2')!;
  const led3 = document.getElementById('led-3')!;

  const magnetVal = document.getElementById('magnet-val')!;
  const magnetBarFill = document.getElementById('magnet-bar-fill') as HTMLElement;

  const lblCurrentDay = document.getElementById('lbl-current-day')!;
  const lblTableName = document.getElementById('lbl-table-name')!;
  const lblTableDesc = document.getElementById('lbl-table-desc')!;
  const lblTableBonus = document.getElementById('lbl-table-bonus')!;

  const lblSpecialName = document.getElementById('lbl-special-name')!;
  const lblSpecialDesc = document.getElementById('lbl-special-desc')!;
  const lblSpecialMod = document.getElementById('lbl-special-mod')!;
  const lblEventTimer = document.getElementById('lbl-event-timer')!;

  const soundIcon = document.getElementById('sound-icon')!;
  const btnSoundToggle = document.getElementById('btn-sound-toggle')!;
  const btnRestart = document.getElementById('btn-restart')!;

  // Render inicial de Criaturas
  function renderCrittersUI() {
    crittersList.innerHTML = '';
    game.critters.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = `critter-card ${c.currentMana >= c.maxMana ? 'ready' : ''}`;
      card.id = `critter-card-${idx}`;

      const elemColor =
        c.element === 'fire' ? '#ff3366' :
        c.element === 'water' ? '#00f2fe' :
        c.element === 'earth' ? '#10b981' : '#fbbf24';

      card.innerHTML = `
        <div class="critter-header-row">
          <div class="critter-badge">
            <span class="critter-avatar">${c.avatarIcon}</span>
            <div>
              <div class="critter-name">${c.name}</div>
              <div class="critter-level">Nivel ${c.level} • ${c.element.toUpperCase()}</div>
            </div>
          </div>
          <button class="btn-critter-ability" data-index="${idx}">
            [${idx + 1}] ACT
          </button>
        </div>
        <div class="mana-bar-track">
          <div class="mana-bar-fill" id="critter-mana-${idx}" style="width: ${(c.currentMana / c.maxMana) * 100}%; background: ${elemColor};"></div>
        </div>
        <div class="critter-desc">${c.abilityDescription}</div>
      `;

      card.querySelector('.btn-critter-ability')?.addEventListener('click', () => {
        game.castCritterAbility(idx);
      });

      crittersList.appendChild(card);
    });
  }

  // Render inicial de Gemas
  function renderGemsUI() {
    const gemMeta = [
      { key: 'fire', icon: '🔥', label: 'Fuego' },
      { key: 'water', icon: '💧', label: 'Agua' },
      { key: 'earth', icon: '🌿', label: 'Tierra' },
      { key: 'wind', icon: '⚡', label: 'Viento' },
      { key: 'void', icon: '🔮', label: 'Vacío' }
    ];

    gemsList.innerHTML = gemMeta.map((g) => `
      <div class="gem-box">
        <span class="gem-icon">${g.icon}</span>
        <span class="gem-count" id="gem-count-${g.key}">${game.elementalGems[g.key]}</span>
      </div>
    `).join('');
  }

  // Actualización de Textos de Calendario
  function updateCalendarUI() {
    lblCurrentDay.textContent = game.currentDaily.dayName.toUpperCase();
    lblTableName.textContent = game.currentDaily.tableConfig.name;
    lblTableDesc.textContent = game.currentDaily.tableConfig.description;
    lblTableBonus.textContent = game.currentDaily.dropBonus;

    document.querySelectorAll('.btn-day').forEach((btn) => {
      const d = parseInt((btn as HTMLElement).dataset.day || '0', 10);
      btn.classList.toggle('active', d === game.simulatedDayIndex);
    });
  }

  // Actualización de Evento Especial de 3 Días
  function updateSpecialEventUI() {
    const ev = game.currentSpecialEvent.event;
    lblSpecialName.textContent = ev.name;
    lblSpecialDesc.textContent = ev.description;
    lblSpecialMod.textContent = `⚡ MODIFICADOR: ${ev.modifierName}`;
    lblEventTimer.textContent = `⏳ ${game.currentSpecialEvent.hoursRemaining}h restantes (Día ${game.currentSpecialEvent.dayInEvent}/3)`;

    bossName.textContent = game.activeBoss.name;
    if (bossAvatarImg) {
      bossAvatarImg.src = '/assets/boss_titan_gorgon.jpg';
    }

    document.querySelectorAll('.btn-special').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === Math.floor(((game.simulatedDayIndex % 12)) / 3));
    });
  }

  // Event Listeners de Botones de Cabina
  btnSoundToggle.addEventListener('click', () => {
    const isMuted = soundEngine.toggleMute();
    soundIcon.textContent = isMuted ? '🔇' : '🔊';
  });

  btnRestart.addEventListener('click', () => {
    game.restartGame();
  });

  // Botón de Pantalla Completa Móvil
  const btnFullscreen = document.getElementById('btn-fullscreen');
  btnFullscreen?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      try {
        if ('orientation' in screen && 'lock' in (screen.orientation as unknown as { lock: (o: string) => Promise<void> })) {
          (screen.orientation as unknown as { lock: (o: string) => Promise<void> }).lock('portrait').catch(() => {});
        }
      } catch {
        // ignore
      }
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Selectores de Día de la Semana
  document.querySelectorAll('.btn-day').forEach((btn) => {
    btn.addEventListener('click', () => {
      const day = parseInt((btn as HTMLElement).dataset.day || '0', 10);
      game.setDayVariation(day);
      updateCalendarUI();
    });
  });

  // Selectores de Evento de 3 Días
  document.querySelectorAll('.btn-special').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      game.setSpecialEventByIndex(idx);
      updateSpecialEventUI();
    });
  });

  // Controles Táctiles de Flippers en la Pantalla
  const leftTouch = document.getElementById('touch-left-flipper')!;
  const rightTouch = document.getElementById('touch-right-flipper')!;

  leftTouch.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    game.physics.setLeftFlipper(true);
  });
  leftTouch.addEventListener('pointerup', (e) => {
    e.preventDefault();
    game.physics.setLeftFlipper(false);
  });
  leftTouch.addEventListener('pointerleave', () => {
    game.physics.setLeftFlipper(false);
  });

  rightTouch.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    game.physics.setRightFlipper(true);
  });
  rightTouch.addEventListener('pointerup', (e) => {
    e.preventDefault();
    game.physics.setRightFlipper(false);
  });
  rightTouch.addEventListener('pointerleave', () => {
    game.physics.setRightFlipper(false);
  });

  // Controles On-Screen de Nudge
  document.getElementById('btn-nudge-left')?.addEventListener('click', () => {
    game.physics.nudge(-1, 0);
  });
  document.getElementById('btn-nudge-up')?.addEventListener('click', () => {
    game.physics.nudge(0, -1);
  });
  document.getElementById('btn-nudge-right')?.addEventListener('click', () => {
    game.physics.nudge(1, 0);
  });

  // Botón de Plunger On-Screen (mantener pulsado para cargar y soltar para disparar)
  const btnPlunger = document.getElementById('btn-plunger-hold')!;
  btnPlunger.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btnPlunger.classList.add('charging');
    game.physics.chargePlunger(0.2);
  });
  btnPlunger.addEventListener('pointerup', (e) => {
    e.preventDefault();
    btnPlunger.classList.remove('charging');
    game.physics.releasePlunger();
  });

  // Botón de Pulso Magnético On-Screen
  const btnMagnet = document.getElementById('btn-magnet-toggle')!;
  btnMagnet.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btnMagnet.classList.add('holding');
    game.physics.setMagneticControl(true);
  });
  btnMagnet.addEventListener('pointerup', (e) => {
    e.preventDefault();
    btnMagnet.classList.remove('holding');
    game.physics.setMagneticControl(false);
  });
  btnMagnet.addEventListener('pointerleave', () => {
    btnMagnet.classList.remove('holding');
    game.physics.setMagneticControl(false);
  });

  // Botón de Ráfaga de 15 Bolas (Pachinko Burst)
  const btnBurst = document.getElementById('btn-burst-15');
  btnBurst?.addEventListener('click', () => {
    game.trigger15BallBurst();
  });

  // Inicializar UI
  renderCrittersUI();
  renderGemsUI();
  updateCalendarUI();
  updateSpecialEventUI();

  // Bucle de sincronización de UI (30fps)
  setInterval(() => {
    // Marcador
    valScore.textContent = game.score.toString().padStart(6, '0');
    valHighScore.textContent = game.highScore.toString().padStart(6, '0');
    valCombo.textContent = `x${game.multiplier} (${game.comboStreak})`;
    valGold.textContent = game.goldCoins.toLocaleString();

    // Bolas
    valBalls.textContent = '⚪ '.repeat(Math.max(0, game.ballsRemaining)).trim() || 'AGOTADAS';

    // Gemas
    Object.keys(game.elementalGems).forEach((k) => {
      const el = document.getElementById(`gem-count-${k}`);
      if (el) el.textContent = game.elementalGems[k].toString();
    });

    // Boss Bar
    const bossPercent = Math.max(0, (game.activeBoss.currentHp / game.activeBoss.maxHp) * 100);
    bossHpText.textContent = `${game.activeBoss.currentHp} / ${game.activeBoss.maxHp}`;
    bossHpFill.style.width = `${bossPercent}%`;

    // Tilt LEDs
    const warnings = game.physics.tiltWarnings;
    const tilted = game.physics.isTilted;
    led1.className = `led ${warnings >= 1 || tilted ? 'active-1' : ''}`;
    led2.className = `led ${warnings >= 2 || tilted ? 'active-2' : ''}`;
    led3.className = `led ${warnings >= 3 || tilted ? 'active-3' : ''}`;

    // Pulso Magnético Bar
    const magPercent = Math.round(game.physics.magneticEnergy);
    magnetVal.textContent = `${magPercent}%`;
    magnetBarFill.style.width = `${magPercent}%`;

    // Barras de Maná de Criaturas
    game.critters.forEach((c, idx) => {
      const fill = document.getElementById(`critter-mana-${idx}`);
      if (fill) fill.style.width = `${(c.currentMana / c.maxMana) * 100}%`;

      const card = document.getElementById(`critter-card-${idx}`);
      if (card) {
        card.classList.toggle('ready', c.currentMana >= c.maxMana);
      }
    });
  }, 66);
});
