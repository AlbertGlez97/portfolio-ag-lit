# ag-atom-text

> Texto con 5 variantes tipográficas. Elige la etiqueta semántica correcta por variant.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| variant | String | 'body' | `lede` · `body` · `hero-sub` · `caption` · `meta` · `mono` |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Contenido del texto |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- Lede (primer párrafo del artículo) -->
<ag-atom-text variant="lede">
  Todo empezó con una pregunta aparentemente inocente...
</ag-atom-text>

<!-- Párrafo estándar del cuerpo -->
<ag-atom-text variant="body">
  En este artículo vamos a construir, paso a paso...
</ag-atom-text>

<!-- Caption de una figura -->
<ag-atom-text variant="caption">Descomposición visual del fBm en 4 octavas.</ag-atom-text>

<!-- Meta inline (fechas, read time) -->
<ag-atom-text variant="meta">8 min de lectura</ag-atom-text>

<!-- Código inline dentro de párrafo -->
<ag-atom-text variant="body">
  Fíjate en la línea <ag-atom-text variant="mono">pos.y += h * uAmplitude</ag-atom-text>: ahí está la gracia.
</ag-atom-text>
```

## Notas

- **Tag semántica por variant**: `lede`/`body`/`hero-sub` → `<p>`, `caption`/`meta` → `<span>` (inline), `mono` → `<code>` (inline, semántica de código).
- **`hero-sub` es especial**: el host es `display: flex` con una barra cian de 2.75rem×1px a la izquierda vía `::before`. Font-size 1.375rem (22px), weight 500, fg color. Se usa solo en el subtitle del hero — no es tipografía general.
- **Drop-cap NO vive acá**: el organismo `ag-organism-article-reader` lo aplica al primer `lede` del artículo vía `::first-letter` o un span wrapping. El átomo solo aporta la tipografía Fraunces y el tamaño.
- **`mono` inline**: se usa DENTRO de un párrafo (`variant="body"`), no como bloque. Para bloques de código usar `ag-molecule-code-block`.
- **`max-width: 680px`** en body — mantiene líneas legibles (~70 caracteres). Si necesitás full-width, el consumidor envuelve con un wrapper que lo anule.
- **Custom properties para overrides externos** (sin romper encapsulación):
  - `--ag-text-clamp` — entero para `-webkit-line-clamp` (solo aplica a variantes `lede` y `body`).
  - `--ag-text-size` — sobreescribe el `font-size` del variant.
  - `--ag-text-color` — sobreescribe el color del variant.
  Úsalas con `style="--ag-text-clamp: 1; --ag-text-size: 15px"` desde el consumer o vía `::slotted(ag-atom-text)` en el shadow del padre.
