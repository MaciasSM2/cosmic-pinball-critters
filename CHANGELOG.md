# Changelog

Todas las modificaciones notables de este proyecto están documentadas en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-07

### Añadido
- **Workflows Automatizados de GitHub Actions:**
  - `ci.yml`: Validación continua de compilación con TypeScript y Vite ante pushes y pull requests.
  - `build-apk.yml`: Compilación en la nube de `app-debug.apk` con JDK 17 y Android SDK, con artefacto descargable directo en GitHub Actions.
  - `deploy-pages.yml`: Despliegue automático del juego en GitHub Pages.
- **Plantillas de Comunidad GitHub:**
  - `.github/ISSUE_TEMPLATE/bug_report.md`: Plantilla estructurada para reportes de errores.
  - `.github/ISSUE_TEMPLATE/feature_request.md`: Plantilla para propuestas de nuevas características.
  - `.github/pull_request_template.md`: Protocolo de verificación para solicitudes de extracción.
  - `CONTRIBUTING.md`: Guía de contribución para el repositorio.
- **Metajuego RPG Expandido & Altar de Invocación Astral:**
  - Altar de Invocación con ruleta de eclosión de huevos por oro o gemas de vacío (`hatchCosmicEgg`).
  - 2 Nuevas criaturas míticas añadidas: *Umbra* (Vacío 🔮, Épica) y *Solaris* (Luz Astral ☀️, Legendaria).
  - Sistema de subida de nivel interactivo (`[▲ NV]`) con coste dinámico en oro y gemas del elemento afín.
  - Modales arcade para eclosión de huevo (con aura animada) y resumen de fin de partida (score, récord, oro y daño al jefe).
  - Nuevas síntesis de audio procedural en Web Audio API: fanfarria de nivel, victoria del jefe, eclosión mística y jackpot x10.
  - Persistencia completa en LocalStorage de oro, gemas, escuadrón, jefes derrotados y récord.
- **Licencia:** Licencia permisiva MIT añadida formalmente en `LICENSE`.
- **Sincronización de Versión Nativa Android:** Actualización de `versionCode 2` y `versionName 1.1.0` en `android/app/build.gradle`.

### Modificado
- `package.json`: Incremento a versión `1.1.0`.
- `README.md`: Nueva sección de descargas de APK en GitHub Actions, badges de estado, guía de workflows y arquitectura detallada.
- `EMERGENCY_RECOVERY.md`: Anclaje de hitos 6 y 7 con estado de resiliencia del proyecto.

---

## [1.0.0] - 2026-10-07

### Añadido
- **Fase 1 - Motor de Pinball Clásico de Precisión:**
  - Motor de física Matter.js con sub-stepping a 240Hz (4 pasadas por frame) para prevenir efecto de túnel.
  - Flippers angulares analógicos con tensión dinámica y resorte de retorno.
  - Émbolo (Plunger) con resorte acumulador de fuerza.
  - Sistema de sacudida de mesa (*Nudge/Tilt*) con advertencias triples y bloqueo preventivo de flippers.
  - Pulso magnético (*Skill Steer*) para doblar trayectorias en tiempo real hacia objetivos estratégicos.
  - 3 hoyos sumideros superiores: Invocación, Bóveda del Jefe y Cámara de Multibola.
- **Fase 2 - Metajuego RPG y Fusión Masiva Pachinko:**
  - Ráfaga continua de 15 bolas simultáneas disparadas en cascada con tecla `R` o botón táctil.
  - Matriz de clavos de acero (*pegs*) con colisiones de cliqueteo metálico procedural en Web Audio API.
  - 5 ranuras inferiores de salida (*payout chutes*) con multiplicadores: `x2 GEMA`, `x5 MANÁ`, `★ x10 JACKPOT ★`, `x5 MANÁ`, `x2 ORO`.
  - Escuadrón RPG de 4 criaturas elementales (Ignis, Aquara, Golemix, Zephyra) con habilidades activas desatables mediante teclas `1-4`.
  - Jefe Titán Gorgon con barra de vida en tiempo real y reacciones de daño cinético.
  - Calendario semanal de 7 días (5 variaciones lun-vie + fin de semana completo).
  - Ciclo rotativo de 4 eventos de 3 días con modificadores de gravedad, fricción y recompensas.
- **Fase 3 - Adaptación Móvil y Proyecto Nativo Android:**
  - Inicialización y sincronización de Capacitor Android nativo (`@capacitor/android`).
  - Bloqueo en orientación vertical (*portrait-primary*) y aceleración por hardware en `AndroidManifest.xml`.
  - Soporte PWA WebAPK con manifiesto web (`manifest.json`) y retroalimentación háptica por vibración (`navigator.vibrate`).
