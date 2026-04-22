# ag-page-article

> Page del artículo individual (`/laboratorio/:slug`). Reading progress + nav + reader + end + footer.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| slug | String | '' | Slug del artículo. Lo setea el router desde el pattern `/laboratorio/:slug` |

## Notas

- **Deep-linking por URL hash**: si la URL llega con `#intro` o similar, en `updated()` se dispara un `_applyDeepLink()` con delay de 150ms (para que el reader termine de renderizar sus sections). Encuentra la section en `reader.shadowRoot.querySelector` y hace `scrollIntoView` suave. Cierra el pendiente documentado en `article-reader.md`.
- **Flag `_deepLinked`**: asegura que el scroll se ejecute una sola vez. Si el usuario navega internamente después del hash inicial, no re-scrollea por segunda vez.
- **Article not found**: si `getArticleBySlug` devuelve null, renderiza un error simple con el slug. Evita crash.
- **Related articles**: se resuelven desde `article.related_ids` (precomputado en content.json). Si algún id no matchea, se omite silenciosamente.
- **Icon de related card**: hardcoded a `◐` por ahora. Si se quiere un icon por categoría o por artículo, ampliar el schema.
- **Rating sin persistencia**: los contadores llegan como `0` y el voto solo vive en memoria del molecule. Cuando haya backend, escuchar `ag-article-rated` y persistir.
