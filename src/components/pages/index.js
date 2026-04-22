/**
 * src/components/pages/index.js — Barril de páginas.
 *
 * Re-exporta cada page. `export *` dispara el registro del custom element
 * al cargar este barril. Mismo uso que el `main.js` actual — permite
 * migrar a `import 'src/components/pages'` sin listar una por una.
 *
 * Pages incluidas (3):
 *   ag-page-article, ag-page-laboratorio, ag-page-landing
 */

export * from './ag-page-article/ag-page-article.js';
export * from './ag-page-laboratorio/ag-page-laboratorio.js';
export * from './ag-page-landing/ag-page-landing.js';
