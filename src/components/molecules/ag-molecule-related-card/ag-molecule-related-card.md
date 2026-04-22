# ag-molecule-related-card

> Card de artículo relacionado al final del artículo: glyph coloreado por categoría + meta mono + título (clamp 2 líneas).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| category | String | '' | `threejs` · `ia` · `tutor` · `backend` (define el color del glyph) |
| icon | String | '' | Glyph central del visual (ej: "◐", "◇") |
| meta | String | '' | Meta line (ej: "IA · 28·MAR·2025") |
| title | String | '' | Título del artículo |
| href | String | '' | Ruta al artículo |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click lo intercepta el router |

## Uso

```html
<ag-molecule-related-card
  category="ia"
  icon="◐"
  meta="IA · 28·MAR·2025"
  title="Embeddings caseros: cuándo no necesitas OpenAI"
  href="/laboratorio/embeddings-caseros"
></ag-molecule-related-card>
```

## Notas

- **Color del glyph por categoría**: se aplica vía `:host([category="ia"])` etc. Los colores vienen de los tokens globales (purple, orange, blue, cyan).
- Título con clamp a 2 líneas — ellipsis si sobrepasa.
- El glyph NO usa `ag-atom-icon` — es un caracter Unicode centrado, no un SVG. Simpler.
