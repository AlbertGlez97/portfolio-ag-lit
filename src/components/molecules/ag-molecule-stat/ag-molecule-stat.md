# ag-molecule-stat

> Contador de la barra de stats: número grande + unidad cian + label mono. Borde separador automático (excepto el primero).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| value | String | '' | Número o símbolo (`"5"`, `"∞"`, `"01"`) |
| unit | String | '' | Unidad cian (`"+"`, `"/h"`) |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Label del stat |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Molécula sin eventos |

## Uso

```html
<ag-molecule-stat value="5" unit="+">Años de exp.</ag-molecule-stat>
<ag-molecule-stat value="∞">Curiosidad</ag-molecule-stat>
```

## Notas

- El border-left + padding-left lo decide `:host(:first-child)` — no hace falta prop `first`.
- `value` es `String` (no `Number`) porque la maqueta usa `"∞"` y `"01"` (zero-padded).
- En mobile (≤820px) el padding se reduce y `:host(:nth-child(odd))` saca padding-left — grid de 2 columnas sin márgenes extra.
