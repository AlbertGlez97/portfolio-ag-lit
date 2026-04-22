# ag-atom-gradient-text

> Span inline con el gradient cian→purple aplicado al fill del texto. Se anida dentro de otro átomo tipográfico.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Átomo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto a pintar con el gradient |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- En hero -->
<ag-atom-heading level="1" variant="display">
  ALBERTO<br/>
  <ag-atom-gradient-text>GONZÁLEZ</ag-atom-gradient-text>
</ag-atom-heading>

<!-- En contacto -->
<ag-atom-heading level="2" variant="section">
  Hablemos de tu <ag-atom-gradient-text>próximo proyecto.</ag-atom-gradient-text>
</ag-atom-heading>

<!-- En page-title del laboratorio -->
<ag-atom-heading level="1" variant="display">
  El <ag-atom-gradient-text>Laboratorio</ag-atom-gradient-text>
</ag-atom-heading>
```

## Notas

- **Sin semántica propia**: es un `<span>` de decoración inline. SIEMPRE va adentro de un heading o texto con semántica.
- **`-webkit-background-clip: text` + `color: transparent`**: el texto se recorta del fondo gradiente. El color del slotted content hereda `transparent` y el gradient pinta a través.
- **Gradient centralizado**: usa el token `--grad`. Si cambia la paleta (tweaks futuros), el gradient sigue.
- No expone props — si a futuro aparece un gradient alternativo (magenta/blue, por ejemplo), se agrega `variant`.
