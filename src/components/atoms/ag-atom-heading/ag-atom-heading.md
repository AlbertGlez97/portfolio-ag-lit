# ag-atom-heading

> Heading semántico (h1–h6) con preset visual. El `level` es para SEO/a11y; `variant` controla el look.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| level | Number | 2 | Nivel semántico `1`–`6` (renderiza `<h1>`…`<h6>`) |
| variant | String | 'section' | `display` · `section` · `card-sm` · `card` · `card-lg` · `article` |
| num | String | '' | Solo `variant="article"` — prefijo numérico cian (ej: "01") |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto del heading |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- Hero del landing -->
<ag-atom-heading level="1" variant="display">ALBERTO</ag-atom-heading>

<!-- Título de sección (ej: "Cosas que he construido") -->
<ag-atom-heading level="2" variant="section">Cosas que he construido.</ag-atom-heading>

<!-- Título dentro de card -->
<ag-atom-heading level="3" variant="card">Sinapsis AI</ag-atom-heading>

<!-- H2 del artículo con número cian prefijo -->
<ag-atom-heading level="2" variant="article" num="01">Introducción</ag-atom-heading>
```

## Notas

- **`level` y `variant` son ortogonales**: `level` es semántica (qué tag genera, crítico para SEO y tree de headings). `variant` es estética (cómo se ve). Un `<h3>` puede usar variant `display` si quisieras una visual grande manteniendo jerarquía semántica baja.
- **`num` solo aplica a `variant="article"`**: en otros variants la prop se acepta pero no se pinta (no hay `::before` con `attr(data-n)`).
- **Tres variantes de `card`**:
  - `card-sm` (18px) — article-card, lab-row, related-card (grids densos).
  - `card` (24px) — project-card (sección principal).
  - `card-lg` (36px) — featured-card (destacado del laboratorio).
- **`color: inherit` en los `<h*>` internos**: el color lo setea el host vía `:host { color: var(--fg) }`. Los consumidores pueden sobreescribir el color desde fuera (ej: `a:hover ag-atom-heading { color: var(--cyan) }`) y el cambio propaga al tag interno.
- **Light DOM del texto**: el slot mantiene el texto en el light DOM; indexable por buscadores aunque el `<h>` viva en shadow.
- **Custom properties para overrides externos** (sin romper encapsulación):
  - `--ag-heading-clamp` — entero para `-webkit-line-clamp` (default: sin clamp).
  - `--ag-heading-size` — sobreescribe el `font-size` del variant.
  - `--ag-heading-color` — sobreescribe el color del variant.
  Úsalas desde el consumer con `style="--ag-heading-clamp: 2"` o en CSS externo.
- **`card-lg` es responsive built-in**: `clamp(28px, 5vw, 36px)` — escala solo entre breakpoints sin necesidad de media queries externas.
- **Drop-cap del lede** NO vive acá — lo agrega el organismo `ag-organism-article-reader` porque depende del contexto (primer párrafo).
