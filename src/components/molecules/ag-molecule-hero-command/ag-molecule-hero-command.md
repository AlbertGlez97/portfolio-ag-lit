# ag-molecule-hero-command

> Caja mono del hero: prompt cian + `$` + texto tipeado + caret parpadeante. Presentacional — el typing loop vive en el organismo.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| prompt | String | '' | Prompt izquierdo (ej: `"~/alberto"`) |
| typed | String | '' | Texto actualmente visible |

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
<ag-molecule-hero-command
  prompt="~/alberto"
  typed=${this.currentPhrase}
></ag-molecule-hero-command>
```

## Notas

- **Typing loop lives in the organism**: el hero rota entre `hero_phrases` y actualiza `typed` a cada frame. La molécula solo renderiza el frame actual.
- Usa `ag-atom-caret` (default, no variant hero).
- `backdrop-filter: blur(8px)` da el efecto glass — requiere que haya algo pintado detrás.
