---
trigger: always_on
description: Protocolo Gravify para el anclaje y persistencia continua del estado del proyecto en EMERGENCY_RECOVERY.md ante caídas del chat.
---

# Regla: Protocolo Gravify

1. **Anclaje de Estado:** Cada vez que se culmine una característica o fase, actualizar [EMERGENCY_RECOVERY.md](file:///c:/Users/Sebastian%20Macias/Documents/0.%20Programacion/Pinball/EMERGENCY_RECOVERY.md) con el estado exacto del proyecto.
2. **Reanudación sin Fricción:** Al iniciar un nuevo chat o tras un corte, verificar primero `EMERGENCY_RECOVERY.md` para recuperar el hilo de trabajo sin requerir que el usuario repita el contexto.
3. **Verificación Pre-Commit:** Confirmar que `npm run build` sea exitoso antes de dar por cerrada cualquier tarea.
