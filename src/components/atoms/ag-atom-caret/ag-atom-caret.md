# ag-atom-caret

> Cursor cian parpadeante. Tres variantes: fijo 8×14 (default), `hero` (em-relativo al `<h1>`) y `terminal` (em-relativo para el mirror del input del terminal).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| variant | String | '' | Vacío (default, 8×14px fijo) · `hero` (em-relativo, grande) · `terminal` (em-relativo, 0.5em × 1.1em, para el mirror del input) |

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
<!-- Cursor del comando del hero ("$ npx create-portfolio...") -->
<span class="typed">npx create-portfolio</span><ag-atom-caret></ag-atom-caret>

<!-- Cursor del input del terminal -->
<input ... /><ag-atom-caret></ag-atom-caret>

<!-- Cursor del heading del hero (escala con el tamaño del h1) -->
<h1>GONZÁLEZ<ag-atom-caret variant="hero"></ag-atom-caret></h1>
```

## Notas

- **`steps(2)`** en el blink: alterna binario entre opacidad 1 y 0 (sin interpolación). Se siente como un caret real, no como un fade.
- **Variante `hero` es em-relativa**: escala automáticamente con el `font-size` del contenedor. Por eso en el hero (con `font-size: clamp(68px, 13vw, 196px)`) el caret se ve proporcionalmente correcto sin cálculos.
- El átomo no se puede pausar/reanudar desde afuera. Si a futuro hace falta, se expone una prop `paused` que frena la animation.
