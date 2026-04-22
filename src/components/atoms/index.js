/**
 * src/components/atoms/index.js — Barril de átomos.
 *
 * Re-exporta cada átomo para que los consumidores (moléculas, organismos,
 * pages) puedan importar desde un único path en vez de apuntar al archivo
 * individual. El `export *` ejecuta el módulo — efecto secundario que
 * registra el custom element via `customElements.define()`.
 *
 * Átomos incluidos (19):
 *   ag-atom-avatar, ag-atom-button, ag-atom-caret, ag-atom-chip,
 *   ag-atom-divider, ag-atom-eyebrow, ag-atom-gradient-text,
 *   ag-atom-heading, ag-atom-icon, ag-atom-input, ag-atom-kbd,
 *   ag-atom-link, ag-atom-logo, ag-atom-pulse, ag-atom-quote,
 *   ag-atom-select, ag-atom-tag, ag-atom-text, ag-atom-textarea
 */

export * from './ag-atom-avatar/ag-atom-avatar.js';
export * from './ag-atom-button/ag-atom-button.js';
export * from './ag-atom-caret/ag-atom-caret.js';
export * from './ag-atom-chip/ag-atom-chip.js';
export * from './ag-atom-divider/ag-atom-divider.js';
export * from './ag-atom-eyebrow/ag-atom-eyebrow.js';
export * from './ag-atom-gradient-text/ag-atom-gradient-text.js';
export * from './ag-atom-heading/ag-atom-heading.js';
export * from './ag-atom-icon/ag-atom-icon.js';
export * from './ag-atom-input/ag-atom-input.js';
export * from './ag-atom-kbd/ag-atom-kbd.js';
export * from './ag-atom-link/ag-atom-link.js';
export * from './ag-atom-logo/ag-atom-logo.js';
export * from './ag-atom-pulse/ag-atom-pulse.js';
export * from './ag-atom-quote/ag-atom-quote.js';
export * from './ag-atom-select/ag-atom-select.js';
export * from './ag-atom-tag/ag-atom-tag.js';
export * from './ag-atom-text/ag-atom-text.js';
export * from './ag-atom-textarea/ag-atom-textarea.js';
