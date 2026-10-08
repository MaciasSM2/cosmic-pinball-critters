# Plan Maestro del Entorno Visual Final y Arte Gráfico
**Proyecto:** Cosmic Pinball: Clash of Critters  
**Objetivo:** Sustituir la interfaz basada en texto plano y emojis por un entorno visual arcade y RPG premium de estándar comercial (estilo *Space Pinball* + *Clash of Critters*).

---

## 🎨 1. Dirección Artística y Visión Gráfica

El juego fusiona la ingeniería electromecánica retro-futurista de una **Cabina Pinball Sci-Fi** con la fantasía vibrante de un **Juego de Colección y Batalla de Criaturas (Gacha RPG)**.

### Pilares Visuales:
1. **Materiales & Superficies:**
   - Acrílico transparente multicapa con reflejos de vidrio angular.
   - Metales cromados y titanio oscuro para rieles, bumpers y flippers.
   - Iluminación emissive (neón cian, dorado solar, violeta del vacío, rojo plasma).
2. **Estilo de Criaturas (TCG / Creature Collector):**
   - Ilustraciones de alta fidelidad estilo arte digital cinematográfico/anime sci-fi.
   - Marcos de cartas coleccionables con gemas de rareza incrustadas (Común, Rara, Épica, Legendaria).
3. **Eliminación Total de Placeholders y Emojis:**
   - Sustituir todos los glifos de texto (`🔥`, `💧`, `🌿`, `⚡`, `🔮`, `🪙`, `🥚`) por iconos rasterizados/vectoriales ilustrados de alta resolución con efectos de resplandor.

---

## 🖼️ 2. Catálogo de Activos Gráficos a Generar e Integrar

```
public/assets/
├── critters/
│   ├── critter_ignis.png       # Dragón ígneo de magma cósmico (Fuego)
│   ├── critter_aquara.png      # Espíritu serpentino bioluminiscente (Agua)
│   ├── critter_golemix.png     # Coloso tectónico con runas vivas (Tierra)
│   ├── critter_zephyra.png     # Fénix celestial de plasma eléctrico (Viento)
│   ├── critter_umbra.png       # Bestia etérea de sombra y vacío (Vacío - Épica)
│   └── critter_solaris.png     # Guardián solar con fotones dorados (Luz - Legendaria)
├── items/
│   ├── cosmic_egg.png          # Huevo astral con filigranas de oro y nebulosa
│   ├── cosmic_coin.png         # Moneda holográfica de oro arcade
│   ├── gem_fire.png            # Cristal de rubí elemental
│   ├── gem_water.png           # Cristal de zafiro líquido
│   ├── gem_earth.png           # Cristal de esmeralda tectónica
│   ├── gem_wind.png            # Cristal de topacio aerodinámico
│   └── gem_void.png            # Cristal de amatista del vacío
├── table/
│   ├── flipper_left.png        # Pala mecánica de pinball (titanio y goma roja)
│   ├── flipper_right.png       # Pala mecánica de pinball derecha
│   ├── bumper_cap.png          # Cúpula luminosa con núcleo de neón
│   ├── peg_metal.png           # Clavo de pachinko en cromo reflectante
│   └── chute_gate.png          # Compuerta de ranura de salida con luz neón
└── ui/
    ├── frame_card_common.png   # Marco de carta coleccionable
    ├── frame_card_rare.png
    ├── frame_card_epic.png
    ├── frame_card_legendary.png
    └── summon_portal_bg.png    # Círculo arcano de transmutación para gacha
```

---

## 📐 3. Planteamiento de Integración Mecánica y Visual

### 3.1 Cartas de Criaturas (Panel Izquierdo)
- **Estructura Visual:**
  - Marco metálico con gradiente cónico según elemento.
  - Ilustración del personaje con efecto de paralaje suave y fondo de su bioma.
  - Barra de maná de vidrio tallado con líquido bioluminiscente que sube progresivamente.
  - Botón de habilidad con borde iluminado animado cuando está al 100%.
  - Botón de nivel decorado con iconos reales de moneda y gema.

### 3.2 Altar de Invocación Astral
- **Estructura Visual:**
  - Ilustración de Huevo Astral 3D con partículas flotantes en CSS.
  - Al hacer clic, animación de fractura del cascarón con destello cegador de luz blanca que revela la nueva criatura sobre el glifo de invocación.

### 3.3 Bóveda de Recompensas y HUD
- Filas de recursos con iconos 3D renderizados de gemas cortadas y monedas grabadas.
- Contadores de números en tipografía digital arcade `Orbitron` con relieve metálico.

### 3.4 Mesa de Pinball y Pachinko (Canvas2D)
- Renderizado de bumpers con texturas concéntricas y flashes de halo dinámico.
- Flippers representados con texturas de palanca industrial en lugar de polígonos planos.
- 5 Ranuras inferiores con divisores cromados y rótulos luminiscentes que parpadean al entrar una bola.

---

## 🚀 4. Fases de Ejecución Gráfica
1. **Fase A - Ilustración de Criaturas:** Generación e integración de los 6 retratos de criaturas en `public/assets/critters/`.
2. **Fase B - Iconografía de Recompensas y Altar:** Generación de huevo astral, monedas y gemas en `public/assets/items/`.
3. **Fase C - Estilización CSS de Cartas e Interfaces:** Reemplazo de emojis en `index.html` y creación de clases CSS con acabados metálicos y cristal arcade.
4. **Fase D - Renderizador Canvas de Pinball:** Dibujado de texturas de sprites en `PinballRenderer.ts` para flippers, bumpers y ranuras.
