import { LitElement, html } from 'lit';
import { styles } from './ag-atom-divider.styles.js';

/**
 * <ag-atom-divider> — Separador horizontal o vertical, sólido o dashed.
 *
 * Usado como `.divider-line` (horizontal solid bajo el header del artículo),
 * `.card-foot` border-top (dashed bajo project card y article card), y
 * como `.hero-meta .sep` (vertical solid de 14px entre meta items).
 *
 * Aplica `role="separator"` y `aria-orientation` automáticamente.
 *
 * @property {string} orientation - `horizontal | vertical`. Default `'horizontal'`.
 * @property {string} variant - `solid | dashed`. Default `'solid'`.
 *
 * @example
 *   <ag-atom-divider></ag-atom-divider>
 *   <ag-atom-divider variant="dashed"></ag-atom-divider>
 *   <ag-atom-divider orientation="vertical"></ag-atom-divider>
 */
class AgAtomDivider extends LitElement {
  static properties = {
    orientation: { type: String, reflect: true },
    variant: { type: String, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.orientation = 'horizontal';
    this.variant = 'solid';
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'separator');
    if (this.orientation === 'vertical' && !this.hasAttribute('aria-orientation')) {
      this.setAttribute('aria-orientation', 'vertical');
    }
  }

  render() {
    return html``;
  }
}

customElements.define('ag-atom-divider', AgAtomDivider);
