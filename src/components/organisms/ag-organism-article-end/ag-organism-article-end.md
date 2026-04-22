# ag-organism-article-end

> Bloque final del artículo: rating + artículos relacionados (2-col) + botón back. Re-emite `ag-article-rated` cuando el usuario vota.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| ratingQuestion | String | '' | Pregunta (ej: "¿Te resultó útil?") |
| ratingUpLabel | String | '' | Label del positivo |
| ratingDownLabel | String | '' | Label del negativo |
| ratingUpCount | Number | 0 | Contador positivo |
| ratingDownCount | Number | 0 | Contador negativo |
| ratingPicked | String | '' | Voto actual: `'up' \| 'down' \| ''` |
| ratingThanksText | String | '' | Texto post-voto |
| relatedTitle | String | '' | Label de la sección related |
| relatedArticles | Array | [] | `[{ category, icon, meta, title, href?, slug? }]` |
| backLabel | String | '' | Label del botón back |
| backHref | String | '/laboratorio' | Destino del back |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-article-rated | `{ vote: 'up' \| 'down' }` | Al votar — re-emit del `ag-rate` del molecule de rating |

## Uso

```html
<ag-organism-article-end
  ratingQuestion="¿Te resultó útil?"
  ratingUpLabel="Sí"
  ratingDownLabel="No"
  ratingUpCount="142"
  ratingDownCount="8"
  ratingThanksText="¡Gracias por el feedback!"
  relatedTitle="Artículos relacionados"
  .relatedArticles=${relatedArticles}
  backLabel="← Volver al Laboratorio"
  backHref="/laboratorio"
  @ag-article-rated=${(e) => saveVote(e.detail.vote)}
></ag-organism-article-end>
```

## Notas

- **`ag-atom-eyebrow` como heading de la sección related**: compromiso semántico — la maqueta usa `<h3>` pero el visual (cyan bar + mono uppercase) calza perfecto con el eyebrow. 12px vs los 14px del maqueta. Si hace falta estricto `<h3>`, agregamos variant `label` a `ag-atom-heading` con mono uppercase.
- **Related grid 2-col → 1-col**: colapsa en ≤42.5rem (680px). Los cards mantienen su aspect ratio.
- **Si no hay related, la sección se omite**: ni el eyebrow ni el grid se renderizan. El rating y el back siguen visibles.
- **`ag-rate` → `ag-article-rated` re-emit**: renombramos el evento porque el dominio cambia (`rate` es genérico, `article-rated` es específico). La page persiste el voto; el organism solo UX.
- **`max-width: 45rem`** match con el content del article-reader — el end queda alineado con el cuerpo del artículo.
