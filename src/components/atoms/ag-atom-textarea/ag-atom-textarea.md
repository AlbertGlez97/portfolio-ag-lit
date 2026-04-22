# ag-atom-textarea

> Área de texto multilínea con estado de error. Fuente mono, altura mínima 130px, resize vertical.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| value | String | '' | Valor actual |
| placeholder | String | '' | Texto placeholder |
| name | String | '' | Nombre del campo |
| maxlength | Number | null | Límite de caracteres (atributo nativo) |
| required | Boolean | false | Marca el campo como requerido |
| error | Boolean | false | Activa el borde naranja |
| disabled | Boolean | false | Deshabilita el textarea |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-input | `{ value }` | Al tipear cada carácter |
| ag-change | `{ value }` | Al perder el foco |

## Uso

```html
<ag-atom-textarea
  name="message"
  maxlength="1000"
  placeholder="Cuéntame en qué estás pensando..."
  @ag-input=${(e) => (this.message = e.detail.value)}
></ag-atom-textarea>
```

## Notas

- **Contador de caracteres** lo maneja el componente externo (`ag-molecule-form-field`), no el átomo. El átomo solo respeta `maxlength` nativo.
- **Fuente mono 13.5px** — distinto a `ag-atom-input` (display 15px) porque los mensajes suelen tener código o URLs.
- Resize vertical habilitado; horizontal bloqueado para no romper el layout del form.
