# ag-organism-reading-progress

> Barra fina fija en top que se llena con el progreso de scroll. `scaleX` + `requestAnimationFrame` — sin re-renders de Lit.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Organismo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Organismo sin eventos |

## Uso

```html
<!-- Típicamente al inicio del body en la page del artículo -->
<ag-organism-reading-progress></ag-organism-reading-progress>
```

## Notas

- **No re-renderiza Lit por scroll**: el handler escribe directo `bar.style.transform = scaleX(...)` sin pasar por props reactivas. Scroll es high-frequency — cada re-render de Lit sería un costo innecesario.
- **`requestAnimationFrame` throttle**: `_onScroll` pide un RAF; si ya hay uno pendiente, se ignora. Garantiza un update por frame como máximo.
- **`transform: scaleX()`**: más performante que `width` — scaleX es GPU-acelerada y no triggerea layout. `transform-origin: left` hace que el escalado arranque del borde izquierdo.
- **Fixed z-index 60**: por encima del nav (50) — si el nav y la progress bar se superponen, la progress gana.
- **`resize` también re-calcula**: si el viewport cambia (rotación mobile, DevTools open/close), el total del scroll cambia y la barra debe refrescar.
- **Gradient cian→purple**: usa `var(--grad)` para consistencia con el branding. Si en review visual se ve muy fuerte, cambiar a `var(--cyan)` plano + glow.
- **`documentElement.scrollHeight`**: más robusto que `body.scrollHeight` en algunos browsers. `documentElement` (el `<html>`) siempre incluye el body + overflow.
