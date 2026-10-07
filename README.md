# Cosmic Pinball: Clash of Critters
> Videojuego híbrido que fusiona el **Pinball Arcade Clásico Occidental**, la mecánica masiva de **Pachinko Asiático (Ráfaga de 15 Bolas)** y la progresión estratégica de un **RPG de Batalla de Criaturas** (*Creature Collector*).

---

## 1. Visión y Pilares del Juego

Inspirado directamente en las mecánicas de **Space Pinball** (física de precisión, rebotes en bumpers y control de flippers) y **Clash of Critters** (rondas de bolas continuas, colección de monstruos y ranuras inferiores con multiplicadores).

### Características Principales:
1. **Fusión de Paradigmas de Pinball:**
   - **Modo Precisión (1 Bola):** Flipper cradling, plunger analógico y tiros dirigidos a hoyos superiores.
   - **Modo Masivo Pachinko (Ráfaga de 15 Bolas):** Salva continua de 15 bolas que caen en cascada rebotando en clavos de acero (*pegs*), interactuando activamente con los flippers para mantener la lluvia viva.
2. **5 Ranuras Inferiores de Salida (*Payout Chutes*):**
   - **Ranura 1 (Izq):** `x2 GEMA` (+3 Gemas elementales).
   - **Ranura 2 (Medio Izq):** `x5 MANÁ` (Recarga masiva de maná al escuadrón).
   - **Ranura 3 (Centro):** `★ x10 JACKPOT ★` (Ataque Crítico masivo directo al Jefe).
   - **Ranura 4 (Medio Der):** `x5 MANÁ` (Maná elemental).
   - **Ranura 5 (Der):** `x2 ORO` (+250 Monedas de oro cósmico).
3. **Manipulación Activa de la Bola (Sin juego pasivo):**
   - **Empujón Físico (*Nudge*):** Sacudida de mesa en 3 direcciones con inercia instantánea y medidor de 3 faltas de *Tilt*.
   - **Pulso Magnético (*Skill Steer*):** Campo magnético cuántico controlable que curva la trayectoria hacia los hoyos y ranuras deseadas.
4. **Metajuego RPG de Criaturas:**
   - Escuadrón de 4 criaturas (**Ignis, Aquara, Golemix, Zephyra**) cuyas barras de maná se cargan con los impactos de mesa para desatar meteoros, escudos salvavidas de drenaje, terremotos y bolas extra.
5. **Calendario Semanal (7 Días) y Eventos de 3 Días:**
   - **5 Variaciones Lun-Vie:** Caverna de Magma, Falla Abisal, Bastión de Gaia, Corredor de Zéfiro, Vórtice del Vacío.
   - **Fin de Semana Full Content:** Sábado y Domingo con todos los calabozos y bonus abiertos.
   - **4 Eventos de 3 Días en Ciclo Continuo:** Invasión Cósmica, Torneo del Flipper Dorado, Santuario de Crías Míticas, Falla de Gravedad Cero.

---

## 2. Arquitectura del Código Fuente

```
Pinball/
├── index.html                   # Estructura semántica de cabina arcade responsiva
├── public/
│   └── assets/
│       ├── pinball_playfield_bg.jpg # Textura de alta resolución de la mesa (9:16)
│       └── boss_titan_gorgon.jpg    # Retrato de alta resolución del Titán Gorgon
├── src/
│   ├── types/
│   │   └── table.ts             # Interfaces modulares (TableConfig, PegConfig, BottomSlotConfig)
│   ├── tables/
│   │   ├── spaceCadetTable.ts   # Definición física de la mesa insignia Nebula Station Alpha
│   │   └── elementalTables.ts   # 5 Variaciones semanales y 4 eventos de 3 días
│   ├── engine/
│   │   ├── PinballPhysics.ts    # Motor de física (Matter.js 240Hz, 15 bolas, flippers, slots)
│   │   ├── PinballRenderer.ts   # Renderizador Canvas (iluminación neón, sombras, cristal arcade)
│   │   └── PinballAudio.ts      # Sintetizador procedural en Web Audio API (cero dependencias)
│   ├── game/
│   │   └── GameManager.ts       # Coordinador del juego, escuadrón RPG, combate de Boss y loops
│   ├── style.css                # Estética arcade sci-fi, glassmorphism y diseño responsivo
│   └── main.ts                  # Punto de entrada, listeners de teclado y controles táctiles
├── EMERGENCY_RECOVERY.md        # Registro de contingencia para reanudación ante caídas de chat
├── AGENTS.md                    # Reglas activas de workspace con herramientas Gravify y Caveman
└── README.md                    # Documentación general del proyecto
```

---

## 3. Guía de Controles

| Acción | Control en PC | Control en Móvil / Táctil |
| :--- | :--- | :--- |
| **Flippers (Palancas)** | <kbd>A</kbd> / <kbd>D</kbd> o <kbd>←</kbd> / <kbd>→</kbd> | Tocar mitad izquierda / derecha de la pantalla |
| **Lanzar Bola (Plunger)** | Mantener <kbd>S</kbd> o <kbd>↓</kbd> | Mantener botón *"🚀 Lanzar Bola"* |
| **Ráfaga 15 Bolas (Pachinko)** | Tecla <kbd>R</kbd> | Botón dorado *"⚡ RÁFAGA 15 BOLAS [R]"* |
| **Sacudida de Mesa (Nudge)** | <kbd>Q</kbd> (Izq), <kbd>W</kbd> (Arriba), <kbd>E</kbd> (Der) | Botones en pantalla *"⬅️ Sacudida"*, *"⬆️ Empujón"* |
| **Pulso Magnético** | Mantener <kbd>ESPACIO</kbd> o <kbd>Shift</kbd> | Mantener botón *"🧲 Atractor"* o tocar la mesa |
| **Habilidades de Criaturas** | Teclas <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, <kbd>4</kbd> | Pulsar botón *"ACT"* en la tarjeta de criatura |

---

## 4. Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en vivo
npm run dev

# 3. Compilar para producción (validación de tipos TypeScript)
npm run build
```

---

## 5. Hoja de Ruta para Fase 3 (Exportación a APK Android)

- Integración de **Capacitor**:
  ```bash
  npm install @capacitor/core @capacitor/cli @capacitor/android
  npx cap init "Cosmic Pinball" "com.pinball.critters"
  npx cap add android
  npx cap sync
  ```
- Compilación de `.apk` para pruebas en dispositivo móvil usando el Android CLI plugin.
