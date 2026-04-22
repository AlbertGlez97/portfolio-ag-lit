# ag-molecule-lab-row

> Fila del listado "Laboratorio" del landing: tag + fecha + título/excerpt + flecha. Toda la fila es link.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| category | String | '' | Variant del tag (`threejs \| ia \| tutor \| backend`) |
| categoryLabel | String | '' | Label de la categoría |
| date | String | '' | Fecha mono (ej: "12·ABR·2025") |
| title | String | '' | Título del artículo |
| excerpt | String | '' | Excerpt corto |
| href | String | '' | Ruta al artículo |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click en la fila lo intercepta el router |

## Uso

```html
<ag-molecule-lab-row
  category="threejs"
  categoryLabel="Three.js"
  date="12·ABR·2025"
  title="Shaders procedurales para terrenos infinitos"
  excerpt="Cómo combinar ruido fractal con LOD dinámico..."
  href="/laboratorio/shaders-procedurales"
></ag-molecule-lab-row>
```

## Notas

- **Grid 4 columnas**: `140px 100px 1fr auto`. En mobile (≤820px) se reorganiza en 2 columnas con grid-template-areas.
- **Row entera es `<a>`**: toda la fila navega. La barra cian del borde izquierdo aparece en hover vía `::after`.
- Usa `ag-atom-tag` con `variant=${category}`.
