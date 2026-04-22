# ag-molecule-code-block

> Bloque de código con head (lang + file), gutter numerado y botón copiar con feedback.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| lang | String | '' | Label del lenguaje (ej: "GLSL") |
| file | String | '' | Nombre del archivo (ej: "vertex.glsl") |
| lines | Array | [] | Array de strings (una línea por item) |
| copyLabel | String | 'copiar' | Label del botón |
| copiedLabel | String | 'copiado ✓' | Label post-copy |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-code-copy | `{ lang, file }` | Copia exitosa al clipboard |

## Uso

```html
<ag-molecule-code-block
  lang="JAVASCRIPT"
  file="terrain.js"
  .lines=${[
    "import { PlaneGeometry, Mesh } from 'three';",
    "",
    "export function buildLODChunks(camera) {",
    "  const chunks = [];",
    "  ...",
    "}"
  ]}
></ag-molecule-code-block>
```

## Notas

- **Sin syntax highlighting**: las líneas se renderizan como texto plano. El highlight (spans `.k .s .c .n` etc. de la maqueta) queda para una versión futura con Prism o shiki. El bloque se ve bien en monocromo mientras tanto.
- **Copy feedback por 1.5s**: el botón muestra `copiado ✓` en cian y vuelve solo. No requiere gestión por el parent.
- **Clipboard puede fallar**: en contextos inseguros (http sin TLS) `navigator.clipboard` tira error — lo absorbemos sin romper.
