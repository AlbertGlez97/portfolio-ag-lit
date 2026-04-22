# ag-molecule-project-card

> Card de proyecto del landing: número + icon glyph + título + descripción + tags de stack + foot con CTA.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| num | String | '' | Número (ej: "01") |
| icon | String | '' | Glyph (ej: "◐") |
| title | String | '' | Título del proyecto |
| description | String | '' | Descripción |
| tags | Array | [] | Stack técnico (strings) |
| meta | String | '' | Foot left (ej: "2025 · producto") |
| ctaLabel | String | '' | Label del CTA (ej: "live", "code") |
| ctaUrl | String | '' | URL del CTA. Si está vacío, el arrow no es link. |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots (todo por props) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click en el CTA lo intercepta el router |

## Uso

```html
<ag-molecule-project-card
  num="01"
  icon="◐"
  title="Sinapsis AI"
  description="Editor colaborativo con LLMs locales..."
  .tags=${["Next.js", "tRPC", "Postgres"]}
  meta="2025 · producto"
  ctaLabel="live"
  ctaUrl="https://sinapsis.ai"
></ag-molecule-project-card>
```

## Notas

- **El card entero NO es link** — solo el CTA del foot. El hover lift aplica a toda la card pero la navegación la dispara el arrow.
- **Tags en variant neutral** (default de `ag-atom-tag`) — stack técnico, no categoría.
- **Border-top cyan→purple** aparece en hover vía `::before` con `scaleX` — replica el detalle de la maqueta.
