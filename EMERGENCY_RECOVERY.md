# PROTOCOLO DE RECUPERACIÓN Y REGISTRO HISTORIAL DE EMERGENCIA
**Proyecto:** Cosmic Pinball: Clash of Critters  
**Versión:** 1.1.0  
**Última Actualización:** 2026-10-07 (Estado 100% Funcional y Verificado)  
**Propósito:** Si el chat de la IA o el entorno se congela, se corta o sufre desconexión, este documento permite reanudar el trabajo de forma inmediata sin repetir instrucciones ni comandos.

---

## 🚨 TEXTO RÁPIDO DE REANUDACIÓN (Copiar y pegar en caso de desconexión)

Si abres una nueva sesión de chat o si la sesión actual se reinicia, simplemente copia y envía el siguiente mensaje:

```text
Continuar proyecto de Pinball desde EMERGENCY_RECOVERY.md (v1.1.0).
El entorno está configurado con TypeScript, Vite, Matter.js, Web Audio API y Capacitor Android.
Fase 1 (física y controles), Fase 2 (RPG, 7 días, 4 eventos de 3 días), Fusión Pachinko (15 bolas continuas + 5 ranuras inferiores estilo Clash of Critters), Fase 3 (Proyecto Android Nativo) y la suite de GitHub Actions CI/CD con compilación de APK en la nube están 100% completadas y operativas.
Consulta EMERGENCY_RECOVERY.md y procede con el siguiente requerimiento solicitado.
```

---

## 📋 Registro Historial Cronológico de Hitos Completados

### Hito 1: Plan Maestro y Arquitectura (Aprobado)
- Definición de las 3 Fases Maestras en `master_plan_pinball_rpg.md`.
- Elección del stack tecnológico: TypeScript + Matter.js + Canvas2D + Capacitor (para exportar a Android APK).

### Hito 2: Motor Físico y Manipulación Activa (Fase 1)
- **Sub-stepping a 240Hz:** 4 iteraciones por frame para eliminar el *tunneling* de la bola.
- **Flippers de precisión:** Cinemática angular y resorte de retorno.
- **Empujón (Nudge/Tilt):** Sacudida en 3 direcciones con medidor de 3 faltas y alarma sonora.
- **Pulso Magnético (Skill Steer):** Fuerza de atracción cuántica hacia el cursor o hoyos deseados (<kbd>ESPACIO</kbd> / touch).
- **3 Hoyos Estratégicos:** Hoyo de Invocación, Bóveda del Jefe y Cámara de Multibola.

### Hito 3: Metajuego RPG y Calendarios Cíclicos (Fase 2)
- **Escuadrón de 4 Criaturas:** Ignis (Fuego), Aquara (Agua), Golemix (Tierra), Zephyra (Viento) con maná y habilidades activas (`1`, `2`, `3`, `4`).
- **Combate de Jefe:** Boss Titán Gorgon con barra de vida en tiempo real que reacciona a los impactos del pinball.
- **Calendario Semanal 7 Días (5+2):** 5 mesas elementales rotativas de Lunes a Viernes + Fin de Semana *Full Content* con todo abierto.
- **Ciclo Mensual de 4 Eventos de 3 Días:** Invasión Cósmica, Torneo del Flipper Dorado, Santuario de Crías Míticas, Falla de Gravedad Cero.

### Hito 4: Montaje y Planeación del Entorno Visual
- Documento maestro de arte: `visual_environment_plan.md`.
- Activos montados:
  - Textura del tablero 9:16: `public/assets/pinball_playfield_bg.jpg`.
  - Retrato del Boss: `public/assets/boss_titan_gorgon.jpg`.
- Shaders de renderizado: Tinte elemental dinámico, sombras volumétricas de bolas y capa de cristal protector con reflejo.

### Hito 5: Fusión Híbrida Pinball + Pachinko Masivo de 15 Bolas (Clash of Critters)
- **Ráfaga de 15 Bolas Continuas:** Disparo en ráfaga con cañón automático (<kbd>R</kbd> o botón dorado).
- **Matriz de Clavos de Acero (Pegs):** Rebotes de pachinko con efectos de sonido de cliqueteo metálico.
- **Interacción Activa de Flippers:** Las 15 bolas pueden ser voleadas continuamente con las palancas.
- **5 Ranuras Inferiores de Salida (Payout Chutes):**
  - Ranura 0: `x2 GEMA` (+3 gemas elementales).
  - Ranura 1: `x5 MANÁ` (recarga masiva al escuadrón).
  - Ranura 2: `★ x10 JACKPOT ★` (ataque crítico masivo al Jefe).
  - Ranura 3: `x5 MANÁ` (recarga de maná).
  - Ranura 4: `x2 ORO` (+250 monedas de oro cósmico).

### Hito 6: Adaptación Móvil y Proyecto Nativo Android (Fase 3)
- Inicialización de **Capacitor** (`@capacitor/android`, `@capacitor/core`, `@capacitor/cli`).
- Proyecto nativo generado en `android/` con package `com.pinball.critters`.
- Configuración en `AndroidManifest.xml`: Orientación bloqueada verticalmente (*sensorPortrait*), aceleración por hardware forzada y permisos de vibración háptica (`VIBRATE`).
- PWA WebAPK integrada con `public/manifest.json`.

### Hito 7: Suite de GitHub, CI/CD, Workflows Cloud y Release v1.1.0
- **GitHub Actions Workflows:**
  - `.github/workflows/ci.yml`: Verificación automática de compilación TypeScript y Vite en pushes y PRs.
  - `.github/workflows/build-apk.yml`: Compilación en la nube con Java JDK 17 y Android SDK que genera y almacena el archivo `app-debug.apk` como artefacto descargable.
  - `.github/workflows/deploy-pages.yml`: Despliegue automatizado en GitHub Pages.
- **Comunidad y Documentación GitHub:**
  - Licencia formal MIT en `LICENSE`.
  - Plantillas de Issue: `.github/ISSUE_TEMPLATE/bug_report.md` y `feature_request.md`.
  - Plantilla de Pull Request: `.github/pull_request_template.md`.
  - Guía de contribución: `CONTRIBUTING.md`.
  - Historial de cambios: `CHANGELOG.md` (v1.0.0 y v1.1.0).
  - Documentación unificada con badges en `README.md`.

### Hito 8: Metajuego RPG Expandido, Invocación Astral y Modales de Botín
- **Altar de Invocación Cósmica (Gacha de Huevos):**
  - Sistema de eclosión de huevos (`hatchCosmicEgg`) por 500 oro o 5 gemas de vacío.
  - Expansión de catálogo a 6 criaturas con rarezas (Común, Rara, Épica, Legendaria):
    - *Umbra* (Vacío 🔮, Épica): Habilidad *Vórtice Gravitacional*.
    - *Solaris* (Luz Astral ☀️, Legendaria): Habilidad *Supernova Radiante*.
- **Sistema de Nivel y Atributos (Level-Up):**
  - Botón interactivo de subida de nivel `[▲ NV]` con coste de oro y gemas elementales.
  - Escalado dinámico de Daño, Vida Máxima y Maná.
- **Audio Procedural Web Audio API:**
  - Fanfarrias añadidas para subida de nivel (`playLevelUp`), derrota del jefe (`playBossDefeated`), eclosión de huevo (`playEggHatch`) y jackpot x10 (`playJackpotFanfare`).
- **Modales Arcade de Inmersión:**
  - Modal de Eclosión Astral con aura elemental y animaciones.
  - Modal de Fin de Partida / Victoria con desglose de daño infligido al jefe, botín y récords.
- **Persistencia Total en LocalStorage:**
  - Guardado y recuperación automática de oro cósmico, gemas elementales, escuadrón y récords.

---

## 🛠️ Estado Técnico del Entorno

| Parámetro | Estado |
| :--- | :--- |
| **Versión del Proyecto** | `1.1.0` |
| **Directorio del Proyecto** | `c:\Users\Sebastian Macias\Documents\0. Programacion\Pinball` |
| **Servidor Local Activo** | `http://127.0.0.1:5173/` (Vite) |
| **Estado de Compilación** | `npm run build` -> Exit code 0 (Cero errores de TypeScript) |
| **Sincronización Android** | `android/app/src/main/assets/public` sincronizado vía `npx cap sync android` |
| **Dependencias Clave** | `matter-js`, `canvas-confetti`, `lucide`, `@capacitor/android`, `@capacitor/core`, `typescript`, `vite` |

---

## ⚡ Comandos de Restauración y Diagnóstico Rápido

1. **Reanudar servidor de desarrollo:**
   ```powershell
   cd "c:\Users\Sebastian Macias\Documents\0. Programacion\Pinball"
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
2. **Validar integridad de código:**
   ```powershell
   npm run build
   ```
3. **Sincronizar cambios a Android:**
   ```powershell
   npm run cap:build
   ```
4. **Anclar estado del proyecto (Gravify):**
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\gravify.ps1
   ```
