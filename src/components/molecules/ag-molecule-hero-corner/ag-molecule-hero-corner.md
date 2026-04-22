# ag-molecule-hero-corner

> Indicador esquinero del hero: hint de scroll + paginación. Se oculta en mobile.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| hint | String | '' | Texto superior (ej: "scroll ↓") |
| pagination | String | '' | Texto inferior (ej: "01 / 08") |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Molécula sin eventos |

## Uso

```html
<ag-molecule-hero-corner hint="scroll ↓" pagination="01 / 08"></ag-molecule-hero-corner>
```

## Notas

- Oculto en ≤720px (`display: none`).
- El `position: absolute; bottom; right;` lo aplica el organismo hero — esta molécula solo define su caja.
