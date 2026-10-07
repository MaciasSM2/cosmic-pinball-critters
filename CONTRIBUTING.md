# Guía de Contribución: Cosmic Pinball

¡Gracias por contribuir a **Cosmic Pinball: Clash of Critters**!

## 🚀 Flujo de Desarrollo

1. **Clonar y Preparar el Entorno:**
   ```bash
   git clone <repo-url>
   cd Pinball
   npm install
   ```

2. **Ejecutar Localmente:**
   ```bash
   npm run dev
   ```
   El juego estará disponible en `http://127.0.0.1:5173/`.

3. **Validación de Código y Compilación:**
   Antes de abrir cualquier Pull Request o realizar un commit, asegúrate de que la compilación de TypeScript pase limpiamente:
   ```bash
   npm run build
   ```

4. **Sincronización con Android:**
   Si modificas interfaces de usuario, assets o la lógica web y deseas probar en Android:
   ```bash
   npm run cap:build
   ```

5. **Directivas de Estilo y Protocolos:**
   - Mantener las importaciones de TypeScript estrictas (`import type { ... }` cuando aplique).
   - Seguir las directivas de resiliencia documentadas en `AGENTS.md`.
   - Registrar cualquier hito o cambio arquitectónico en `EMERGENCY_RECOVERY.md`.

## 📦 Flujo de Pull Requests

1. Crea una rama descriptiva para tu característica o corrección:
   `git checkout -b feature/nueva-mecanica` o `fix/corregir-colisiones`.
2. Completa los campos solicitados en el template de Pull Request.
3. El workflow automatizado de CI (`ci.yml`) validará el build en GitHub Actions antes del merge.
