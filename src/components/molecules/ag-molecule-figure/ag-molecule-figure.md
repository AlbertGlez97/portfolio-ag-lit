# ag-molecule-figure

> Figura del artículo: visual SVG + caption mono con número cian.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| num | String | '' | Número de figura (ej: "01") |
| numLabel | String | 'Fig.' | Prefijo del número |
| caption | String | '' | Texto descriptivo |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | SVG o contenido visual |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Molécula sin eventos |

## Uso

```html
<ag-molecule-figure num="01" caption="Descomposición visual del fBm en 4 octavas.">
  <svg viewBox="0 0 720 320">...</svg>
</ag-molecule-figure>
```

## Notas

- **SVG por slot**: el contenido visual es arbitrario (SVG, `<img>`, `<canvas>`).
- `numLabel` permite localizar ("Fig." en es, "Fig." también en en — en otros idiomas podría cambiar).
