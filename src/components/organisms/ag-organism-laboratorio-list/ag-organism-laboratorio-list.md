# ag-organism-laboratorio-list

> Preview del laboratorio dentro del landing: header stackeado + lista vertical de `ag-molecule-lab-row` con border-top.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| eyebrowText | String | '' | Eyebrow (ej: "02 · El Laboratorio") |
| titleText | String | '' | Título de sección |
| kickerText | String | '' | Kicker descriptivo |
| articles | Array | [] | `[{ category, categoryLabel, date, title, excerpt, href }]` |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo por props |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click de cada row lo intercepta el router |

## Uso

```html
<ag-organism-laboratorio-list
  id="laboratorio"
  eyebrowText="02 · El Laboratorio"
  titleText="Ideas, experimentos y cosas a medio hacer."
  kickerText="Notas técnicas, experimentos y tutoriales. Escribo lo que aprendo."
  .articles=${articles.slice(0, 4)}
></ag-organism-laboratorio-list>
```

## Notas

- **NO es el laboratorio completo**: este organismo es el preview del landing. Para la página `/laboratorio` standalone (con filtros, search, grid), se usa `ag-organism-articles-board` (otro organismo, aún no construido).
- **El `id="laboratorio"` lo setea el consumer** en el host para que el nav lo observe desde el landing. En `/laboratorio` standalone no se usa este organismo.
- **Page prepara los articles**: la page filtra/ordena y pasa los top N (típicamente 4). El organismo no filtra.
- **`href` debe venir construido**: típicamente `/laboratorio/${slug}`. La page construye la URL; el organismo solo la pasa al row.
- **Border-top del `.list`**: visualmente cierra el header con una línea tenue antes del primer row. El último row cierra con su propio border-bottom.
