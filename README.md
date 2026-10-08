# Cosmic Pinball: Clash of Critters

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/package.json)
[![CI Build](https://img.shields.io/badge/CI-GitHub%20Actions-brightgreen.svg)](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/.github/workflows/ci.yml)
[![Android APK](https://img.shields.io/badge/Android%20APK-Cloud%20Build-orange.svg)](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/.github/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/LICENSE)
[![Physics: Matter.js 240Hz](https://img.shields.io/badge/Physics-Matter.js%20240Hz-informational.svg)](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/src/engine/PinballPhysics.ts)

> Videojuego híbrido de alto rendimiento que fusiona el **Pinball Arcade Clásico Occidental**, la mecánica masiva de **Pachinko Asiático (Ráfaga continua de 15 Bolas)** y la progresión estratégica de un **RPG de Batalla de Criaturas** (*Creature Collector*).

---

## 🎮 1. Visión y Pilares de Diseño

El juego combina la precisión cinética de **Space Pinball** (física balística, rebotes en bumpers y flippers de alta sensibilidad) con las mecánicas de retención de **Clash of Critters** (rondas de bolas continuas, colección de criaturas elementales y 5 ranuras inferiores con multiplicadores).

### Mecánicas Principales:
1. **Doble Paradigma Balístico:**
   - **Modo Precisión (1 Bola):** Flipper cradling, émbolo de lanzamiento acumulativo y tiros dirigidos a sumideros superiores.
   - **Modo Pachinko Masivo (Ráfaga de 15 Bolas):** Salva continua de 15 bolas que caen en cascada rebotando en clavos de acero (*pegs*), interactuando dinámicamente con los flippers para mantener el flujo activo en la mesa.
2. **5 Ranuras Inferiores de Salida (*Payout Chutes*):**
   - **Ranura 1 (Extrema Izq):** `x2 GEMA` (+3 Gemas elementales).
   - **Ranura 2 (Medio Izq):** `x5 MANÁ` (Recarga masiva de maná al escuadrón).
   - **Ranura 3 (Centro):** `★ x10 JACKPOT ★` (Ataque Crítico masivo directo al Jefe Titán).
   - **Ranura 4 (Medio Der):** `x5 MANÁ` (Recarga masiva de maná).
   - **Ranura 5 (Extrema Der):** `x2 ORO` (+250 Monedas de oro cósmico).
3. **Manipulación Activa del Tablero:**
   - **Empujón Físico (*Nudge*):** Sacudida de mesa en 3 direcciones con inercia instantánea y medidor estricto de 3 faltas de *Tilt*.
   - **Pulso Magnético (*Skill Steer*):** Campo cuántico controlable que curva la trayectoria hacia hoyos y ranuras deseadas en tiempo real.
4. **Metajuego RPG de Criaturas y Altar de Invocación:**
   - Escuadrón de 6 criaturas con rarezas (*Ignis, Aquara, Golemix, Zephyra, Umbra, Solaris*).
   - Sistema de **Subida de Nivel (Level-Up)** con escalado de daño y salud mediante oro y gemas del elemento afín.
   - **Altar de Invocación Astral (Gacha de Huevos):** Ruleta de eclosión de huevos para desbloquear criaturas míticas o duplicados con mejoras de EXP.
   - Modales interactivos de resumen de botín, fin de partida y eclosión de huevo.
5. **Calendario Semanal (7 Días) y 4 Eventos Cíclicos de 3 Días:**
   - **5 Variaciones Lun-Vie:** Caverna de Magma, Falla Abisal, Bastión de Gaia, Corredor de Zéfiro, Vórtice del Vacío.
   - **Fin de Semana Full Content:** Sábado y Domingo con todos los calabozos y bonus abiertos.
   - **4 Eventos Cíclicos de 3 Días:** Invasión Cósmica, Torneo del Flipper Dorado, Santuario de Crías Míticas, Falla de Gravedad Cero.
6. **Plan de Entorno Visual Final:**
   - Arquitectura gráfica documentada en [FINAL_VISUAL_ENVIRONMENT_PLAN.md](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/FINAL_VISUAL_ENVIRONMENT_PLAN.md) para reemplazar la iconografía plana por cartas coleccionables ilustradas y texturas arcade.

---

## 🕹️ 2. Guía de Controles

| Acción | Control en PC | Control Táctil / Móvil |
| :--- | :--- | :--- |
| **Flippers (Palancas)** | <kbd>A</kbd> / <kbd>D</kbd> o <kbd>←</kbd> / <kbd>→</kbd> | Tocar mitad izquierda / derecha de la pantalla |
| **Lanzar Bola (Plunger)** | Mantener <kbd>S</kbd> o <kbd>↓</kbd> | Mantener botón *"🚀 Lanzar Bola"* |
| **Ráfaga 15 Bolas (Pachinko)** | Tecla <kbd>R</kbd> | Botón dorado *"⚡ RÁFAGA 15 BOLAS [R]"* |
| **Sacudida de Mesa (Nudge)** | <kbd>Q</kbd> (Izq), <kbd>W</kbd> (Arriba), <kbd>E</kbd> (Der) | Botones virtuales *"⬅️ Sacudida"*, *"⬆️ Empujón"* |
| **Pulso Magnético (Skill Steer)** | Mantener <kbd>ESPACIO</kbd> o <kbd>Shift</kbd> | Mantener botón *"🧲 Atractor"* o tocar mesa |
| **Habilidades de Criaturas** | Teclas <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd>, <kbd>4</kbd> | Pulsar botón *"ACT"* en la tarjeta de criatura |

---

## 📱 3. Descarga y Compilación de Android APK

El proyecto cuenta con un proyecto nativo Android configurado con **Capacitor**, bloqueado en orientación vertical, con aceleración por hardware y soporte de vibración háptica.

### Opción A: Descarga Directa desde GitHub Actions (Recomendada)
1. Ve a la pestaña **Actions** en el repositorio de GitHub.
2. Selecciona el workflow **"Build & Release Android APK"**.
3. Haz clic en la última ejecución exitosa.
4. En la sección **Artifacts**, descarga el archivo `CosmicPinball-Debug-APK` para obtener `app-debug.apk` e instalarlo en tu dispositivo Android.

### Opción B: Compilación Local con Android Studio / Capacitor
```bash
# 1. Compilar bundle web y sincronizar con Android
npm run cap:build

# 2. Abrir en Android Studio para depurar en dispositivo físico o emulador
npx cap open android
```

---

## 📂 4. Arquitectura del Repositorio

```
Pinball/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # Verificación de compilación en push/PR
│   │   ├── build-apk.yml        # Generación automática de APK en la nube
│   │   └── deploy-pages.yml     # Despliegue continuo a GitHub Pages
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md        # Plantilla para reporte de errores
│   │   └── feature_request.md   # Plantilla para solicitud de características
│   └── pull_request_template.md # Checklist estándar para Pull Requests
├── android/                     # Proyecto nativo generado por Capacitor Android
│   ├── app/
│   │   ├── src/main/AndroidManifest.xml # Orientación vertical, hardware-accel
│   │   └── build.gradle         # versionCode 2, versionName "1.1.0"
│   └── gradlew                  # Wrapper de compilación Gradle
├── public/
│   ├── assets/
│   │   ├── pinball_playfield_bg.jpg # Textura de fondo del tablero (9:16)
│   │   └── boss_titan_gorgon.jpg    # Retrato de alta resolución del Titán
│   └── manifest.json            # Manifiesto PWA para instalación móvil WebAPK
├── src/
│   ├── types/
│   │   └── table.ts             # Tipado estricto (TableConfig, PegConfig, ChuteConfig)
│   ├── tables/
│   │   ├── spaceCadetTable.ts   # Mesa insignia física Nebula Station Alpha
│   │   └── elementalTables.ts   # 5 Tableros semanales + 4 eventos especiales
│   ├── engine/
│   │   ├── PinballPhysics.ts    # Motor de física (Matter.js 240Hz, 15 bolas, flippers, ranuras)
│   │   ├── PinballRenderer.ts   # Renderizador Canvas2D (luces de neón, reflejos de cristal)
│   │   └── PinballAudio.ts      # Síntesis procedural Web Audio API (cero dependencias externas)
│   ├── game/
│   │   └── GameManager.ts       # Coordinador central de partida, criaturas y combate RPG
│   ├── style.css                # Estética arcade sci-fi, glassmorphism y diseño responsivo
│   └── main.ts                  # Punto de entrada de la aplicación y controladores táctiles
├── scripts/
│   ├── gravify.ps1              # Script de validación de compilación y checkpoint
│   └── caveman.ps1              # Protocolo de compresión y eficiencia
├── FINAL_VISUAL_ENVIRONMENT_PLAN.md # Plan maestro del entorno visual final y activos gráficos
├── CHANGELOG.md                 # Registro histórico de versiones v1.0.0 y v1.1.0
├── CONTRIBUTING.md              # Normas y guías para colaboradores
├── EMERGENCY_RECOVERY.md        # Documento maestro de contingencia ante caídas de sesión
├── AGENTS.md                    # Directivas activas de herramientas Gravify y Caveman
├── LICENSE                      # Licencia permisiva de código abierto MIT
├── package.json                 # v1.1.0, scripts de desarrollo y dependencias
└── README.md                    # Este documento
```

---

## 💻 5. Instalación y Ejecución Local

### Requisitos Previos:
- **Node.js**: v20 o superior
- **NPM**: v10 o superior

### Pasos de Ejecución:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en vivo
npm run dev

# 3. Validar compilación estricta de TypeScript y Vite
npm run build
```

Accede al simulador local abriendo en el navegador: [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/LICENSE) para más detalles.
