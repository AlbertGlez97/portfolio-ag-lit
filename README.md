# portfolio-ag

Portafolio personal de **Alberto González** — Full Stack × IA.

SPA construida con **Lit 3** y **Vite 5** siguiendo **Atomic Design** estricto (átomos → moléculas → organismos → páginas). Contenido multilenguaje (`es` / `en`) cargado de forma asíncrona desde JSON como si fuera un endpoint REST, router propio sobre History API, y una terminal interactiva tipo quest como pieza distintiva del landing.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework UI | [Lit 3](https://lit.dev/) — Web Components nativos, sin decoradores |
| Bundler / Dev server | [Vite 5](https://vitejs.dev/) |
| Diagramas | [Mermaid 11](https://mermaid.js.org/) |
| Estilos | CSS puro por componente + design tokens globales en `:root` |
| Arquitectura | Atomic Design + separación JS / styles / manual por componente |
| Router | History API minimalista (sin dependencias) |
| Contenido | JSON versionado en `src/data/`, consumido vía `content.service.js` |
| i18n | Servicio propio `i18n.service.js` (es / en) |
| Deploy | Vercel (`vercel.json`) y Netlify (`public/_redirects`) con fallback SPA |

## Estructura del proyecto

```
portfolio-ag/
├── index.html                      punto de entrada HTML
├── vite.config.js                  configuración del bundler
├── vercel.json                     rewrite SPA para Vercel
├── package.json
├── public/
│   ├── _redirects                  fallback SPA para Netlify
│   └── favicon.svg
└── src/
    ├── main.js                     bootstrap de la app
    ├── app.js                      <ag-app> shell principal
    ├── styles/
    │   ├── design-tokens.css       tokens globales (colores, tipografías, espaciados)
    │   ├── fonts.css
    │   ├── reset.css
    │   └── pages.css
    ├── data/
    │   ├── meta.json               metadata del sitio
    │   ├── personal.json           información personal
    │   ├── projects.json           proyectos destacados
    │   ├── skills.json             stack y skills
    │   ├── terminal.json           comandos y respuestas del terminal
    │   ├── articles/               artículos del laboratorio
    │   └── schema.md               shape del JSON
    ├── router/
    │   └── ag-router.js            router History API
    ├── services/
    │   ├── content.service.js      carga async de contenido
    │   ├── i18n.service.js         gestión de idiomas
    │   └── terminal-commands.js    lógica del organismo terminal
    ├── utils/
    │   ├── escape-html.js
    │   └── format-date.js
    └── components/                 Atomic Design
        ├── atoms/                  piezas mínimas (button, input, icon, ...)
        ├── molecules/              composición de átomos (cards, nav-link, ...)
        ├── organisms/              secciones completas (hero, terminal, footer, ...)
        └── pages/                  vistas ruteables (landing, laboratorio, article)
```

## Convención de componentes

Cada componente vive en su propia carpeta con **tres archivos**:

```
ag-atom-button/
├── ag-atom-button.js          clase Lit (static properties + JSDoc)
├── ag-atom-button.styles.js   export const styles = css`…`
└── ag-atom-button.md          manual de uso
```

Naming: `ag-[nivel]-[nombre]` → `ag-atom-*`, `ag-molecule-*`, `ag-organism-*`, `ag-page-*`.

## Quick start

```bash
npm install
npm run dev       # arranca Vite en http://localhost:5173
npm run build     # build de producción a /dist
npm run preview   # preview del build
```

## Contenido e i18n

Todo el contenido vive en `src/data/` como JSON. Los `translations.<locale>` anidados mantienen la estructura lista para conectar una API real: cuando eso pase, solo cambia la URL en `content.service.js`. El shape completo está documentado en `src/data/schema.md`.

## Deploy

- **Vercel** — `vercel.json` configura el rewrite SPA
- **Netlify** — `public/_redirects` configura el fallback

---

Para el detalle del progreso de componentes, convenciones de idioma y filosofía del proyecto, ver el [README raíz](../README.md).
