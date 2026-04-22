import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-contact-link.styles.js';

/**
 * <ag-molecule-contact-link> — Fila del bloque de contacto.
 *
 * Label uppercase a la izquierda, value a la derecha, flecha ↗ al final.
 * En hover toda la fila se corre 14px, el texto se vuelve cian y la flecha
 * se diagonaliza. Toda la fila es `<a>`.
 *
 * @property {string} label - Label uppercase (ej: "Email", "GitHub").
 * @property {string} value - Valor mostrado (ej: "hola@albertogonzalez.dev").
 * @property {string} href - Destino (puede ser mailto:, https://, etc.).
 *
 * @example
 *   <ag-molecule-contact-link
 *     label="Email"
 *     value="hola@albertogonzalez.dev"
 *     href="mailto:hola@albertogonzalez.dev"
 *   ></ag-molecule-contact-link>
 */
class AgMoleculeContactLink extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.href = '';
  }

  render() {
    return html`
      <a href=${this.href}>
        <span class="lbl">${this.label}</span>
        <span class="val">${this.value}</span>
        <span class="arrow" aria-hidden="true">↗</span>
      </a>
    `;
  }
}

customElements.define('ag-molecule-contact-link', AgMoleculeContactLink);
