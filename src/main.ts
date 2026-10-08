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

  function getGemIcon(elem: string): string {
    switch (elem) {
      case 'fire': return '<img src="/assets/items/gem_fire.svg" class="mini-gem-img" alt="Fuego" />';
      case 'water': return '<img src="/assets/items/gem_water.svg" class="mini-gem-img" alt="Agua" />';
      case 'earth': return '<img src="/assets/items/gem_earth.svg" class="mini-gem-img" alt="Tierra" />';
      case 'wind': return '<img src="/assets/items/gem_wind.svg" class="mini-gem-img" alt="Viento" />';
      case 'void': return '<img src="/assets/items/gem_void.svg" class="mini-gem-img" alt="Vacío" />';
      default: return '<img src="/assets/items/gem_void.svg" class="mini-gem-img" alt="Gema" />';
    }
  }

  // Render de Criaturas con Sistema de Subida de Nivel y Retratos Ilustrados
  function renderCrittersUI() {
    crittersList.innerHTML = '';
    game.critters.forEach((c, idx) => {
      const card = document.createElement('div');
      const isLocked = !c.unlocked;
      card.className = `critter-card ${c.currentMana >= c.maxMana ? 'ready' : ''} ${isLocked ? 'locked' : ''}`;
      card.id = `critter-card-${idx}`;

      const elemColor =
        c.element === 'fire' ? '#ff3366' :
        c.element === 'water' ? '#00f2fe' :
        c.element === 'earth' ? '#10b981' :
        c.element === 'wind' ? '#fbbf24' :
        c.element === 'void' ? '#a855f7' : '#fef08a';

      const rarity = c.rarity || 'common';
      const cost = game.getCritterUpgradeCost(idx);

      card.innerHTML = `
        <div class="critter-header-row">
          <div class="critter-badge">
            <span class="critter-avatar">
              <img src="${c.avatarIcon}" alt="${c.name}" class="critter-avatar-img" />
            </span>
            <div>
              <div class="critter-name">
                ${c.name}
                <span class="critter-rarity-pill rarity-${rarity}">${rarity}</span>
              </div>
              <div class="critter-level">
                ${isLocked ? '🔒 BLOQUEADA' : `Nivel ${c.level} • DAÑO ${c.damage}`}
              </div>
            </div>
          </div>
          ${!isLocked ? `
            <button class="btn-critter-ability" data-index="${idx}">
              [${idx + 1 <= 4 ? idx + 1 : 'ACT'}]
            </button>
          ` : `
            <span class="critter-altar-badge">ALTAR 🥚</span>
          `}
        </div>
        ${!isLocked ? `
          <div class="mana-bar-track">
            <div class="mana-bar-fill" id="critter-mana-${idx}" style="width: ${(c.currentMana / c.maxMana) * 100}%; background: ${elemColor};"></div>
          </div>
        ` : ''}
        <div class="critter-desc">${c.abilityDescription}</div>
        ${!isLocked ? `
          <div class="critter-actions-row">
            <button class="btn-critter-upgrade ${cost.canAfford ? 'affordable' : ''}" data-index="${idx}" id="btn-upgrade-${idx}">
              ▲ NV.${c.level + 1} (${cost.gold} <img src="/assets/items/cosmic_coin.svg" class="mini-coin-img" alt="Oro" /> ${cost.gems} ${getGemIcon(cost.element)})
            </button>
          </div>
        ` : ''}
      `;

      if (!isLocked) {
        card.querySelector('.btn-critter-ability')?.addEventListener('click', () => {
          game.castCritterAbility(idx);
        });

        card.querySelector(`#btn-upgrade-${idx}`)?.addEventListener('click', () => {
          const ok = game.upgradeCritter(idx);
          if (ok) {
            renderCrittersUI();
          }
        });
      }

      crittersList.appendChild(card);
    });
  }

  // Render inicial de Gemas con Iconos Ilustrados
  function renderGemsUI() {
    const gemMeta = [
      { key: 'fire', icon: '/assets/items/gem_fire.svg', label: 'Fuego' },
      { key: 'water', icon: '/assets/items/gem_water.svg', label: 'Agua' },
      { key: 'earth', icon: '/assets/items/gem_earth.svg', label: 'Tierra' },
      { key: 'wind', icon: '/assets/items/gem_wind.svg', label: 'Viento' },
      { key: 'void', icon: '/assets/items/gem_void.svg', label: 'Vacío' }
    ];

    gemsList.innerHTML = gemMeta.map((g) => `
      <div class="gem-box">
        <img src="${g.icon}" alt="${g.label}" class="gem-icon-img" />
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

  // Modales y Altar de Invocación
  const modalSummon = document.getElementById('modal-summon')!;
  const modalGameover = document.getElementById('modal-gameover')!;
  const btnCloseSummon = document.getElementById('btn-close-summon')!;
  const btnConfirmSummon = document.getElementById('btn-confirm-summon')!;
  const btnCloseGameover = document.getElementById('btn-close-gameover')!;
  const btnGameoverRestart = document.getElementById('btn-gameover-restart')!;
  const btnGameoverShrine = document.getElementById('btn-gameover-shrine')!;
  const btnHatchEgg = document.getElementById('btn-hatch-egg');

  btnHatchEgg?.addEventListener('click', () => {
    const result = game.hatchCosmicEgg();
    if (!result) {
      game.renderer.addScorePopup('⚠️ ¡NECESITAS 500🪙 O 5🔮!', 250, 420, '#f43f5e');
      return;
    }

    const { critter, isNewUnlock, bonusLevels } = result;
    const summonAvatar = document.getElementById('summon-avatar') as HTMLImageElement;
    const summonName = document.getElementById('summon-name')!;
    const summonRarity = document.getElementById('summon-rarity')!;
    const summonMsg = document.getElementById('summon-message')!;
    const summonStats = document.getElementById('summon-stats')!;
    const summonAura = document.getElementById('summon-aura')!;

    if (summonAvatar) summonAvatar.src = critter.avatarIcon;
    summonName.textContent = critter.name;
    const rarity = critter.rarity || 'common';
    summonRarity.className = `summon-rarity-badge rarity-${rarity}`;
    summonRarity.textContent = rarity.toUpperCase();

    summonMsg.textContent = isNewUnlock
      ? `¡Desbloqueaste a ${critter.name}! Se ha unido a tu escuadrón cósmico.`
      : `¡Duplicado de ${critter.name}! +${bonusLevels} Niveles y Atributos aumentados.`;

    summonStats.innerHTML = `
      <span>Nivel: <strong>${critter.level}</strong></span>
      <span>Daño: <strong>${critter.damage}</strong></span>
      <span>Elemento: <strong>${critter.element.toUpperCase()}</strong></span>
    `;

    const elemColor =
      critter.element === 'fire' ? '#ff3366' :
      critter.element === 'water' ? '#00f2fe' :
      critter.element === 'earth' ? '#10b981' :
      critter.element === 'wind' ? '#fbbf24' :
      critter.element === 'void' ? '#a855f7' : '#fef08a';
    summonAura.style.background = `radial-gradient(circle, ${elemColor}99 0%, transparent 70%)`;

    modalSummon.classList.remove('hidden');
    renderCrittersUI();
  });

  btnCloseSummon?.addEventListener('click', () => modalSummon.classList.add('hidden'));
  btnConfirmSummon?.addEventListener('click', () => modalSummon.classList.add('hidden'));

  btnCloseGameover?.addEventListener('click', () => modalGameover.classList.add('hidden'));
  btnGameoverRestart?.addEventListener('click', () => {
    modalGameover.classList.add('hidden');
    game.restartGame();
  });
  btnGameoverShrine?.addEventListener('click', () => {
    modalGameover.classList.add('hidden');
    document.getElementById('panel-critters')?.scrollIntoView({ behavior: 'smooth' });
  });

  game.onGameOver = (stats) => {
    const elScore = document.getElementById('stat-run-score');
    const elHigh = document.getElementById('stat-run-high');
    const elGold = document.getElementById('stat-run-gold');
    const elDmg = document.getElementById('stat-run-damage');

    if (elScore) elScore.textContent = stats.score.toString().padStart(6, '0');
    if (elHigh) elHigh.textContent = stats.highScore.toString().padStart(6, '0');
    if (elGold) elGold.textContent = `+${stats.goldEarned} 🪙`;
    if (elDmg) elDmg.textContent = `${stats.bossDamage} 💥`;

    modalGameover.classList.remove('hidden');
  };

  game.onCritterUpdated = () => {
    renderCrittersUI();
  };

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

    // Barras de Maná y Costes de Criaturas
    game.critters.forEach((c, idx) => {
      const fill = document.getElementById(`critter-mana-${idx}`);
      if (fill) fill.style.width = `${(c.currentMana / c.maxMana) * 100}%`;

      const card = document.getElementById(`critter-card-${idx}`);
      if (card && c.unlocked) {
        card.classList.toggle('ready', c.currentMana >= c.maxMana);
      }

      const btnUp = document.getElementById(`btn-upgrade-${idx}`);
      if (btnUp && c.unlocked) {
        const cost = game.getCritterUpgradeCost(idx);
        btnUp.classList.toggle('affordable', cost.canAfford);
      }
    });
  }, 66);
});
