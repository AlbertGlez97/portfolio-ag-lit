import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-hero-corner.styles.js';

/**
 * <ag-molecule-hero-corner> — Indicador esquinero del hero.
 *
 * Dos líneas: hint de scroll (ej: "scroll ↓") y paginación (ej: "01 / 08").
 * Se oculta en viewports ≤ 720px. El positioning absolute lo aplica el
 * organismo hero; la molécula solo maneja su caja interna.
 *
 * @property {string} hint - Texto superior (ej: "scroll ↓").
 * @property {string} pagination - Texto inferior en letterspacing (ej: "01 / 08").
 *
 * @example
 *   <ag-molecule-hero-corner hint="scroll ↓" pagination="01 / 08"></ag-molecule-hero-corner>
 */
class AgMoleculeHeroCorner extends LitElement {
  static properties = {
    hint: { type: String },
    pagination: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.hint = '';
    this.pagination = '';
  }

  render() {
    return html`
      <div class="hint">${this.hint}</div>
      <div class="page">${this.pagination}</div>
    `;
  }
}

customElements.define('ag-molecule-hero-corner', AgMoleculeHeroCorner);
