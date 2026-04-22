# ag-molecule-featured-card

> Artículo destacado del laboratorio: visual SVG izquierdo + meta/título/excerpt/CTA derecho + badge "destacado" flotando.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| badgeLabel | String | '' | Label del badge arriba-derecha |
| vlabel | String | '' | Label bajo el visual |
| category | String | '' | Variant del tag |
| categoryLabel | String | '' | Label de la categoría |
| date | String | '' | Fecha |
| readTime | String | '' | Read time |
| title | String | '' | Título |
| excerpt | String | '' | Excerpt largo |
| ctaLabel | String | 'Leer artículo →' | CTA |
| href | String | '' | Ruta |

## Slots

| Slot | Descripción |
|------|-------------|
| visual | SVG (o imagen) del lado izquierdo |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click en el CTA lo intercepta el router |

## Uso

```html
<ag-molecule-featured-card
  badgeLabel="● Artículo destacado"
  category="threejs"
  categoryLabel="Three.js"
  date="12 · ABR · 2025"
  readTime="8 min de lectura"
  title="Shaders procedurales..."
  excerpt="..."
  vlabel="// fragment.glsl · fbm · 4 octaves"
  href="/laboratorio/shaders"
>
  <svg slot="visual" viewBox="0 0 600 420">...</svg>
</ag-molecule-featured-card>
```

## Notas

- **Visual por slot**: cada artículo destacado pasa su propio SVG. El átomo `ag-atom-icon` no sirve acá — el visual ocupa el panel izquierdo entero.
- **Collapse en ≤860px**: grid se vuelve 1 columna, el visual se achica a 240px.
- Usa `ag-atom-tag` y `ag-atom-button` (variant `read`).
