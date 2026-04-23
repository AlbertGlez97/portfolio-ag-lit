# ag-molecule-article-card

> Card del grid del laboratorio: tags + fecha arriba, título + excerpt (clamp 1 línea), foot con read time y "Leer →". Toda la card es link.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| tags | Array\<string\> | `[]` | Array de tag IDs a renderizar como chips |
| tagsLabels | Object | `{}` | Mapa `id → label` para el texto visible de cada chip. Fallback al id si falta |
| category | String | '' | _Legado — conservado para compatibilidad, ya no se renderiza_ |
| categoryLabel | String | '' | _Legado — conservado para compatibilidad, ya no se renderiza_ |
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
  .tags=${['javascript', 'litelement']}
  .tagsLabels=${{ javascript: 'JavaScript', litelement: 'LitElement' }}
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
