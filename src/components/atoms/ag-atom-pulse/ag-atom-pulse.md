# ag-atom-pulse

> Punto cian de 8×8 con halo pulsante en loop de 2s. Indica estado activo / disponibilidad.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Átomo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- Hero meta -->
<ag-atom-pulse></ag-atom-pulse> Disponible para proyectos · Q3 2025

<!-- Form head status -->
<ag-atom-pulse></ag-atom-pulse> conexión segura
```

## Notas

- Animación cyclic pura CSS, sin JS. Respeta `prefers-reduced-motion` si el navegador lo aplica globalmente (nota: actualmente no se detiene, es un keyframe liviano).
- Color fijo cian — si a futuro aparece un pulse naranja / púrpura, se agrega prop `variant`.
