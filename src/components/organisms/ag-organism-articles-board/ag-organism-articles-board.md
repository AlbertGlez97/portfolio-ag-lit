# ag-organism-articles-board

> Board del laboratorio standalone: filters (chips mutex + search + sort), featured opcional, grid 2-col y empty state. Atajo `/` enfoca el search.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| articles | Array | [] | Artículos completos (cada uno con category, title, excerpt, featured, etc.) |
| filters | Array | [] | `[{ id, label }]` — incluido `{ id: 'all', label: 'Todos' }` al principio |
| sortOptions | Array | [] | `[{ value, label }]` — si está vacío no se renderiza el select |
| searchPlaceholder | String | 'Buscar artículo...' | |
| sortLabel | String | 'Ordenar:' | Label antes del select |
| gridHeadTitle | String | 'Todos los artículos' | |
| featuredBadgeLabel | String | '● Artículo destacado' | |
| emptyTitle | String | 'Sin resultados' | |
| emptyMessage | String | 'No hay artículos que coincidan con esa búsqueda o filtro.' | |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo por props |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Estado interno; clicks navegan via router |

## Uso

```html
<ag-organism-articles-board
  .articles=${articles}
  .filters=${[
    { id: 'all',     label: 'Todos' },
    { id: 'threejs', label: 'Three.js' },
    { id: 'ia',      label: 'IA' },
    { id: 'tutor',   label: 'Tutorial' },
    { id: 'backend', label: 'Backend' },
  ]}
  .sortOptions=${[
    { value: 'recent', label: 'Más recientes' },
    { value: 'alpha',  label: 'Alfabético' },
  ]}
></ag-organism-articles-board>
```

## Datos esperados en `articles[]`

Cada entrada debe tener al menos:
- `category` — id de la categoría (matches uno de los filters)
- `categoryLabel` — label para el tag
- `title`, `excerpt`, `date`, `readTime` — strings mostrables
- `slug` — para construir el href si no viene explícito
- `featured: boolean` — si true, va al slot del featured card
- `published_at` — ISO-8601 para el sort "recent"
- `featuredSvg` — HTML del SVG visual (solo si featured es true). Opcional.
- `vlabel` — label bajo el visual del featured. Opcional.
- `href` — URL construida. Si falta, se compone como `/laboratorio/${slug}`.

## Notas

- **Counters dinámicos por chip**: cada chip muestra el count TOTAL de su categoría (sin aplicar el search). "Todos" es `articles.length`. No cambia al tipear — el search filtra pero no actualiza los counters (contrato con la maqueta).
- **Featured respeta filtro + search**: si el featured article no matchea el filter activo o la query, desaparece. Mismo comportamiento que maqueta.
- **Empty state cuando `filtered.length === 0`**: ni featured ni grid. Borde dashed + heading + texto centrado.
- **Atajo `/` global**: listener en `window`. Chequea via `composedPath()` si el foco está en un input/textarea; si sí, no intercepta (permite tipear "/" en la propia búsqueda).
- **Featured visual vía unsafeHTML**: el `featuredSvg` del article llega como string HTML (probablemente desde content.json). Se inyecta dentro de un `<div slot="visual" style="width:100%;height:100%">`. Si el SVG del content no tiene `width/height` apropiados, completar con preserveAspectRatio.
- **Sort opciones**: `recent` ordena por `published_at` desc, `alpha` por title asc. Si la app a futuro tiene métrica de "más leídos", se agrega el handler; por ahora solo esas dos.
- **Select de sort opcional**: si `sortOptions` está vacío, el select y su label no se renderizan.
- **Counts con `pad2`**: el "04 de 11" se renderiza zero-padded como en la maqueta. 1-9 → "01"-"09"; ≥10 → tal cual.
