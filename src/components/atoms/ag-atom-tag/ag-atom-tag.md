# ag-atom-tag

> Etiqueta de color para marcar categorías (threejs / ia / tutor / backend) y stack técnico (neutral). Átomo visual puro, sin eventos.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| variant   | String | 'neutral' | Paleta de color: `neutral` · `threejs` · `ia` · `tutor` · `backend` |
| size      | String | 'sm' | Padding: `sm` (4×10) · `md` (5×11, header del artículo) |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Contenido textual del tag (ej: `Three.js`, `IA`, `Next.js`) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Este átomo no dispara eventos |

## Uso

```html
<!-- Categorías del laboratorio (featured, grid cards, article header) -->
<ag-atom-tag variant="threejs">Three.js</ag-atom-tag>
<ag-atom-tag variant="ia">IA</ag-atom-tag>
<ag-atom-tag variant="tutor">Tutorial</ag-atom-tag>
<ag-atom-tag variant="backend">Backend</ag-atom-tag>

<!-- Stack técnico de una project card (neutral — default) -->
<ag-atom-tag>Next.js</ag-atom-tag>
<ag-atom-tag>PostgreSQL</ag-atom-tag>

<!-- Padding mediano (usado en el header del artículo individual) -->
<ag-atom-tag variant="threejs" size="md">Three.js</ag-atom-tag>
```

## Notas

- El contenido viaja por `<slot>`: el texto llega tal cual se escribe (sin uppercase, sin transformación).
- Los colores salen de los tokens globales (`--blue`, `--purple`, `--cyan`, `--orange`). Si la paleta cambia, el tag sigue automáticamente.
- La variante `neutral` NO es una categoría — es el tag gris translúcido que se usa en project cards para listar el stack.
- `size="md"` es un ajuste de padding de 1px hacia cada lado; solo se usa en el header del artículo individual para dar más presencia al tag principal. En el resto del sitio va siempre `sm`.
- Para renderizar dinámicamente el color, pasá directo `article.category` a `variant` — el mapeo ya está definido en el JSON.
