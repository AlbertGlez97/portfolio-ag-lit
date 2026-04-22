# ag-atom-link

> Ancla inline del cuerpo del artículo. Color cian, border-bottom translúcido; en hover se solidifica y aparece un fondo cian suave.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| href | String | '' | Destino del link |
| target | String | '' | Target del anchor (`_blank` para externos) |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto del link |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click lo maneja el router (hrefs internos) o el browser (externos) |

## Uso

```html
<!-- Link interno (router intercepta) -->
<ag-atom-link href="/laboratorio/embeddings-caseros">embeddings caseros</ag-atom-link>

<!-- Link externo -->
<ag-atom-link href="https://github.com/..." target="_blank">repo en GitHub</ag-atom-link>
```

## Notas

- **Solo inline**: este átomo está pensado para links dentro de párrafos del artículo. Para navegar desde el nav usar `ag-molecule-nav-link`. Para links del contacto, `ag-molecule-contact-link`.
- **Router fallback** — el router global intercepta anchors con href relativo. Si `target="_blank"` no se intercepta.
- **Underline en transición** — el `border-bottom` va de translúcido a sólido en el hover (efecto de "se pinta el subrayado"), más elegante que `text-decoration: underline` estándar.
