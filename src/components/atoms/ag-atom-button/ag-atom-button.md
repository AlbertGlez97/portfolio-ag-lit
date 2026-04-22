# ag-atom-button

> Botón con 6 variantes visuales: CTAs del hero (primary/ghost), submit del form (send), volver (back), leer artículo (read) y rating pill (rate).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| variant | String | 'primary' | `primary` · `ghost` · `send` · `back` · `read` · `rate` |
| disabled | Boolean | false | Deshabilita el botón (opacity 0.5, pointer-events none) |
| href | String | '' | Si se setea, se renderiza como `<a>`. El router intercepta el click. |
| type | String | 'button' | Tipo del `<button>` cuando NO hay href (`button` · `submit` · `reset`) |
| picked | Boolean | false | Solo `variant="rate"` — estado seleccionado del rating |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Contenido del botón (texto + flechas/íconos opcionales) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-click | `{ variant }` | Click en el botón si no está disabled |

## Uso

```html
<!-- CTA del hero como link (router intercepta) -->
<ag-atom-button variant="primary" href="/laboratorio">Ver artículos</ag-atom-button>

<!-- Submit del contact form (el organismo captura ag-click y llama requestSubmit) -->
<ag-atom-button variant="send" type="submit">Enviar mensaje</ag-atom-button>

<!-- Rating pill con toggle -->
<ag-atom-button variant="rate" ?picked=${this.up}>👍 Sí</ag-atom-button>

<!-- Volver al laboratorio desde artículo -->
<ag-atom-button variant="back" href="/laboratorio">← Volver</ag-atom-button>
```

## Notas

- **Submit en shadow DOM**: `type="submit"` dentro de shadow no dispara el submit del `<form>` externo automáticamente. El organismo del contact form debe capturar `ag-click` y llamar `form.requestSubmit()` manualmente.
- **href vs type**: son mutuamente excluyentes. Con `href` se renderiza `<a>`; sin él, `<button>`. El `type` solo aplica al `<button>`.
- **Rate es pill**: único variant con `border-radius: 999px`. Padding y tamaño también son específicos (10×18, 13px).
- **disabled en anchors**: cuando hay `href` y `disabled`, el átomo cae al render del `<button disabled>` para que el estilo sea consistente. No existen anchors nativos con disabled.
