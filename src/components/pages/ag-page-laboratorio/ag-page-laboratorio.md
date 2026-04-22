# ag-page-laboratorio

> Page del laboratorio standalone (ruta `/laboratorio`). Page hero + articles-board + footer.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Page sin props — todo desde contentService |

## Notas

- **Light DOM** (`createRenderRoot() { return this; }`).
- **NAV_LINKS_REMOTE**: los anchors van a `/#proyectos` etc. porque las sections viven en la landing. El router intercepta `/#...` y navega a `/` + scrollea al hash.
- **Page hero**: estructurado con clase `.ag-page-lab-hero` definida en `pages.css`. Grid overlay + mask radial. El display heading usa `--ag-heading-size: clamp(4rem, 10vw, 9rem)` para matchear la maqueta (64-144px).
- **Articles transformed**: se mapean los raw articles al shape que espera `ag-organism-articles-board` (category, categoryLabel, date formateado, href, etc.).
- **Counters dinámicos**: el board los calcula solo desde `articles` — no pasamos conteo precalculado.
- **Al llegar a `/laboratorio` ningún section existe**: `#proyectos`, `#terminal`, `#contacto` no están en esta page. El nav observer no encuentra nada y ningún link queda activo. Comportamiento esperado (documentado en nav).
