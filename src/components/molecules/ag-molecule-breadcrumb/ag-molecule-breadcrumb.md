# ag-molecule-breadcrumb

> Migas de pan separadas por `/`. El último crumb se pinta en blue como "estás acá".

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| items | Array | [] | `[{ label, href? }]` — lista de crumbs en orden raíz→actual |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click de los links lo intercepta el router |

## Uso

```html
<ag-molecule-breadcrumb
  .items=${[
    { label: 'AG.dev', href: '/' },
    { label: 'Laboratorio', href: '/laboratorio' },
    { label: 'Three.js' },
  ]}
></ag-molecule-breadcrumb>
```

## Notas

- El último item es el actual (color blue, sin link) aunque tenga `href`. La molécula lo fuerza.
- `aria-label="Breadcrumb"` automático. `aria-current="page"` en el último.
- Separador `/` es `aria-hidden` — los lectores de pantalla solo leen los items.
