# ag-molecule-contact-link

> Fila del bloque de contacto: label uppercase + value + flecha ↗. Hover shift izquierdo y tinte cian.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| label | String | '' | Label uppercase (ej: "Email") |
| value | String | '' | Valor (ej: "hola@...") |
| href | String | '' | Destino (mailto:, tel:, https://) |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click lo maneja el browser según el scheme |

## Uso

```html
<ag-molecule-contact-link
  label="Email"
  value="hola@albertogonzalez.dev"
  href="mailto:hola@albertogonzalez.dev"
></ag-molecule-contact-link>
```

## Notas

- **Sin átomos**: el styling es contextual y muy específico (hover shift-in). No vale usar `ag-atom-link` porque su estética (underline cian) no encaja.
- **`mailto:` y `tel:`** no los intercepta el router; caen al browser.
