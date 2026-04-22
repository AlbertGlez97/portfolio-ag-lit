# ag-atom-select

> Dropdown nativo con estilos del sistema. Usado en el sort del laboratorio.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| options | Array | [] | `[{ value, label }]` — opciones del select |
| value | String | '' | Valor actualmente seleccionado |
| name | String | '' | Nombre del campo |
| disabled | Boolean | false | Deshabilita el select |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots (las opciones se pasan por prop) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-change | `{ value }` | Al cambiar la selección |

## Uso

```html
<ag-atom-select
  .options=${[
    { value: 'recent', label: 'Más recientes' },
    { value: 'popular', label: 'Más leídos' },
    { value: 'alpha', label: 'Alfabético' },
  ]}
  .value=${this.sort}
  @ag-change=${(e) => (this.sort = e.detail.value)}
></ag-atom-select>
```

## Notas

- **Estilos limitados por el browser**: el `<option>` solo acepta `background` y `color` custom — no se puede cambiar padding, font, ni hover del dropdown expandido. Es un tradeoff a favor de accesibilidad nativa (keyboard, pantallas táctiles, scrolling).
- **`.options` con dot prefix** — se pasa como propiedad JS, no como atributo (los atributos solo aceptan strings).
- El `selected` se marca explícitamente en cada `<option>` porque `<select .value>` en Lit a veces no se sincroniza antes del primer render.
