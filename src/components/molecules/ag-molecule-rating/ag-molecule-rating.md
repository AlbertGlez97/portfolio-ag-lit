# ag-molecule-rating

> Rating 👍/👎 del final del artículo. Pregunta + dos botones pill con contador + texto de agradecimiento post-voto.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| question | String | '' | Pregunta (ej: "¿Te resultó útil?") |
| upLabel | String | '' | Label del positivo (ej: "Sí") |
| downLabel | String | '' | Label del negativo (ej: "No") |
| upCount | Number | 0 | Contador positivo |
| downCount | Number | 0 | Contador negativo |
| picked | String | '' | `'up' \| 'down' \| ''` — voto actual |
| thanksText | String | '' | Texto que aparece post-voto |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-rate | `{ vote: 'up' \| 'down' }` | Al hacer click en un botón |

## Uso

```html
<ag-molecule-rating
  question="¿Te resultó útil?"
  upLabel="Sí"
  downLabel="No"
  upCount="142"
  downCount="8"
  thanksText="¡Gracias por el feedback!"
  @ag-rate=${(e) => this.save(e.detail.vote)}
></ag-molecule-rating>
```

## Notas

- **Controlled-uncontrolled híbrido**: al hacer click, la molécula setea `picked` sola (UX inmediata). Pero si el parent pasa `picked` explícito (ej: tras leer desde storage), sobrescribe. Ideal para persistir sin romper el default standalone.
- Usa `ag-atom-button variant="rate"` — el pill style y el toggle `picked` ya viven ahí.
- **Emojis** 👍👎 son parte del diseño de la maqueta, hardcoded.
- Los botones no se ocultan tras votar — el agradecimiento aparece al costado.
