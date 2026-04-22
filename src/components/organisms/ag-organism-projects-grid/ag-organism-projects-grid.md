# ag-organism-projects-grid

> Sección de proyectos del landing: header flex (eyebrow+title izquierda / kicker+archive derecha) + grid 3/2/1 columnas de `ag-molecule-project-card`.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| eyebrowText | String | '' | Eyebrow izquierdo |
| titleText | String | '' | Título de sección |
| kickerText | String | '' | Kicker derecho |
| archiveLabel | String | '' | Link al archive (opcional; si vacío no se renderiza) |
| archiveHref | String | '' | URL del link al archive |
| projects | Array | [] | `[{ id, order, icon, title, description, tags, year, type, ctaLabel, ctaUrl }]` |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo por props |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Los clicks del archive y de los CTAs los intercepta el router |

## Uso

```html
<ag-organism-projects-grid
  id="proyectos"
  eyebrowText="01 · Proyectos"
  titleText="Cosas que he construido."
  kickerText="Una selección de trabajo reciente en producto, IA aplicada y herramientas internas."
  archiveLabel="→ 20 más en el archivo"
  archiveHref="/proyectos"
  .projects=${projects}
></ag-organism-projects-grid>
```

## Notas

- **El `id="proyectos"` lo setea el CONSUMER** en el host. El organismo no lo fuerza. El nav encuentra el section via `document.getElementById('proyectos')` porque la page está en Light DOM (ver requisito documentado en `ag-organism-nav.md`).
- **`num` del card viene de `order` o del índice**: `String(p.order ?? i + 1).padStart(2, '0')`. Acepta proyectos sin `order` usando la posición en el array.
- **`meta` es combinación de year + type**: `[year, type].filter(Boolean).join(' · ')` — si falta uno, renderiza el otro; si faltan ambos, string vacío.
- **Archive link con `--ag-text-color` override**: usa `ag-atom-text variant="meta"` dentro de un `<a>`, con `style="--ag-text-color: var(--cyan)"` para pintar cyan en lugar del default fg-dim de meta.
- **Responsive**: 3-col desktop → 2-col ≤61.25rem → 1-col ≤43.75rem con el header apilándose vertical y alineándose a la izquierda.
- **`scroll-margin-top: var(--nav-h)`**: deja 4.25rem de respiro cuando el nav scrollea a la sección (el nav fijo no tapa el título).
