# Antigravity Workspace Directives: Gravify & Caveman Protocols

Este archivo define las herramientas y reglas activas del espacio de trabajo para el proyecto **Cosmic Pinball: Clash of Critters**.

---

## 🛠️ Herramienta 1: Protocolo CAVEMAN (Anti-Congelamiento y Eficiencia de Tokens)

- **Objetivo:** Prevenir que el chat se congele, se cuelgue o corte respuestas a medias por saturación de contexto o sobrecarga de tokens.
- **Reglas de Ejecución:**
  1. **Alta Densidad de Información:** Respuestas concisas y directas al grano. Sin relleno conversacional, sin preámbulos obvios ni repetición de contexto innecesario.
  2. **Código y Rutas Exactas:** Los bloques de código, comandos terminales y enlaces a archivos (`file:///...`) deben ser siempre 100% precisos, completos y sin truncar.
  3. **Preservación de Memoria:** Mantener las explicaciones breves para conservar el espacio de contexto del modelo despejado para tareas complejas.

---

## 🛠️ Herramienta 2: Protocolo GRAVIFY (Anclaje de Estado y Resiliencia Continua)

- **Objetivo:** Garantizar que todo progreso realizado se guarde permanentemente y pueda ser recuperado de inmediato si la sesión del chat se reinicia o falla.
- **Reglas de Ejecución:**
  1. **Anclaje de Checkpoints:** Al completar cualquier hito, modificación física o integración de arte, actualizar el registro en [EMERGENCY_RECOVERY.md](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/EMERGENCY_RECOVERY.md).
  2. **Fast-Resume Ready:** Si el usuario indica un reinicio de sesión o invoca `Continuar desde EMERGENCY_RECOVERY.md`, el agente debe leer el archivo inmediatamente y retomar la ejecución sin pedir que el usuario repita requerimientos previos.
  3. **Verificación de Integridad:** Ejecutar validación de compilación (`npm run build`) para asegurar que no se dejan errores sintácticos o de tipado pendientes.

---

## 📋 Resumen Rápido del Proyecto
- **Tecnología:** TypeScript + Matter.js (240Hz sub-stepping) + Canvas2D + Web Audio API + Vite.
- **Servidor Local:** `http://127.0.0.1:5173/`
- **Mecánicas:** Pinball de palancas + Pachinko de 15 bolas continuas + 5 ranuras inferiores de salida + Escuadrón RPG (Ignis, Aquara, Golemix, Zephyra) + Calendario 7 días + 4 eventos cíclicos de 3 días.
