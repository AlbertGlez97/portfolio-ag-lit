# ag-molecule-form-field

> Wrapper de campo: label + asterisco required + slot para input/textarea + mensaje de error opcional.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| label | String | '' | Texto del label |
| required | Boolean | false | Muestra asterisco naranja |
| error | Boolean | false | Activa el mensaje de error |
| errorMsg | String | '' | Texto del error |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Input o textarea del campo |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Los eventos los emite el átomo slotted |

## Uso

```html
<ag-molecule-form-field label="Email" required ?error=${err} errorMsg="Ese email no se ve bien.">
  <ag-atom-input type="email" ?error=${err} @ag-input=${this._onEmail}></ag-atom-input>
</ag-molecule-form-field>
```

## Notas

- **No contiene el input** — lo recibe por slot. Esto permite elegir entre `ag-atom-input`, `ag-atom-textarea`, o cualquier átomo futuro (ej: checkbox).
- **Error double binding**: el consumidor debe pasar `?error=${err}` TANTO a la molécula (para mostrar el mensaje) como al átomo slotted (para el borde naranja). Duplicado a propósito — la molécula no puede forzar props al slotted child sin ser invasiva.
- El contador de caracteres queda fuera de la molécula (vive en `.form-foot` del organismo contact-form).
