# PROTOCOLO DE RECUPERACIÓN Y REGISTRO HISTORIAL DE EMERGENCIA
**Proyecto:** Cosmic Pinball: Clash of Critters  
**Última Actualización:** 2026-10-07 (Estado 100% Funcional y Verificado)  
**Propósito:** Si el chat de la IA o el entorno se congela, se corta o sufre desconexión, este documento permite reanudar el trabajo de forma inmediata sin repetir instrucciones ni comandos.

---

## 🚨 TEXTO RÁPIDO DE REANUDACIÓN (Copiar y pegar en caso de congelamiento)

Si abres una nueva sesión de chat o si la sesión actual se reinicia, simplemente copia y envía el siguiente mensaje:

```text
Continuar proyecto de Pinball desde EMERGENCY_RECOVERY.md.
El entorno ya está configurado con TypeScript, Vite, Matter.js y Web Audio API.
Fase 1 (física y controles), Fase 2 (RPG, 7 días, 4 eventos de 3 días) y la Fusión de Pachinko (15 bolas continuas + 5 ranuras inferiores estilo Clash of Critters) ya están 100% completadas y funcionando en http://127.0.0.1:5173/.
Consulta EMERGENCY_RECOVERY.md y procede con el siguiente paso solicitado.
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

---

## 🛠️ Estado Técnico del Entorno

| Parámetro | Estado |
| :--- | :--- |
| **Directorio del Proyecto** | `c:\Users\Sebastian Macias\Documents\0. Programacion\Pinball` |
| **Servidor Local Activo** | `http://127.0.0.1:5173/` (Vite) |
| **Estado de Compilación** | `npm run build` -> Exit code 0 (Cero errores de TypeScript) |
| **Dependencias Clave** | `matter-js`, `canvas-confetti`, `lucide`, `@types/matter-js`, `typescript`, `vite` |

---

## ⚡ Comandos de Restauración y Diagnóstico Rápido

Si el proceso o servidor se cierra inesperadamente:

1. **Reanudar servidor de desarrollo:**
   ```powershell
   cd "c:\Users\Sebastian Macias\Documents\0. Programacion\Pinball"
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
2. **Validar integridad de código:**
   ```powershell
   npm run build
   ```
3. **Estado de Git / Archivos modificados:**
   ```powershell
   git status
   ```
