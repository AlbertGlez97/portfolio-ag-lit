# ag-molecule-article-card

> Card del grid del laboratorio: tag + fecha arriba, título + excerpt (clamp 1 línea), foot con read time y "Leer →". Toda la card es link.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| category | String | '' | Variant del tag |
| categoryLabel | String | '' | Label de la categoría |
| date | String | '' | Fecha ya formateada |
| title | String | '' | Título |
| excerpt | String | '' | Excerpt (se recorta a 1 línea con ellipsis) |
| readTime | String | '' | Texto (ej: "6 min de lectura") |
| readLabel | String | 'Leer →' | CTA del foot |
| href | String | '' | Ruta del artículo |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click lo intercepta el router |

## Uso

```html
<ag-molecule-article-card
  category="ia"
  categoryLabel="IA"
  date="28 · MAR · 2025"
  title="Embeddings caseros"
  excerpt="Un pipeline con all-MiniLM..."
  readTime="6 min de lectura"
  href="/laboratorio/embeddings-caseros"
></ag-molecule-article-card>
```

## Notas

- Excerpt con `-webkit-line-clamp: 1` — si el texto sobrepasa, se recorta con ellipsis.
- Toda la card es un `<a>` — cursor pointer, hover lift completo.
- Mismo patrón de `::before` cyan→purple en hover que la project card.
