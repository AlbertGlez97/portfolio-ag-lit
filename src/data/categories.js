/**
 * src/data/categories.js — Catálogo de labels visibles por categoría de artículo.
 *
 * Fuente única de verdad para el mapeo id→label. Consumido por las pages del
 * landing, laboratorio y artículo individual. Si se suma una categoría nueva,
 * este es el único lugar donde cambiarla.
 */

export const CATEGORY_LABELS = {
  litelement: 'LitElement',
  javascript: 'JavaScript',
  algoritmos: 'Algoritmos',
  linux: 'Linux',
};
