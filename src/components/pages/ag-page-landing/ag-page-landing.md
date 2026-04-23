# ag-page-landing

> Page del landing (ruta `/`). Orquesta los 9 organismos del landing en Light DOM.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Page sin props públicas — todo desde contentService |

## Notas

- **Light DOM (`createRenderRoot() { return this; }`)**: requisito documentado en `ag-organism-nav.md`. Los ids de section viven en el DOM global para que el IntersectionObserver del nav los encuentre.
- **Loading y error states**: mientras `contentService.load()` está en vuelo, renderiza `.ag-page-loading` (spinner textual). Si falla, `.ag-page-error` con el mensaje. Clases definidas en `src/styles/pages.css`.
- **Constantes page-level**: `NAV_LINKS` y `TERMINAL_CHIPS` viven en este archivo. `CATEGORY_LABELS` es importado desde `src/data/categories.js` (fuente única de verdad, compartida con laboratorio y article).
- **Section ids**:
  - `#proyectos` → sobre el host de `ag-organism-projects-grid`
  - `#laboratorio` → sobre el host de `ag-organism-laboratorio-list`
  - `#terminal` → sobre `<section>` wrapper (terminal no tiene `padding` propio)
  - `#contacto` → sobre `<section>` wrapper (agrupa eyebrow + grid de links/form)
- **Top padding del hero**: viene del organism (`padding-top: var(--nav-h)`). El nav fijo no tapa el contenido.
- **Contact form sin `submitFn`**: usa el `_defaultSubmit` del organismo (placeholder con setTimeout 800ms). TODO marcado en ambos lados para conectar al backend.
- **Prompt del hero**: se construye como `~/${firstName.toLowerCase()}` — si `info.name` es "Alberto González", el prompt es `~/alberto`.
