import { LitElement, html } from 'lit';
import { styles } from './ag-atom-link.styles.js';

/**
 * <ag-atom-link> — Ancla inline del cuerpo del artículo.
 *
 * Color cian con border-bottom translúcido; en hover el borde se vuelve
 * sólido y el fondo cian suave. Se usa dentro de `ag-atom-p` / bloques de
 * texto del artículo. Para links externos, el consumidor puede pasar
 * `target="_blank"` — el router solo intercepta hrefs internos.
 *
 * @slot (default) Texto del link.
 *
 * @property {string} href - Destino del link.
 * @property {string} target - Target del anchor (opcional).
 *
 * @example
 *   <ag-atom-link href="/laboratorio/embeddings">embeddings caseros</ag-atom-link>
 *   <ag-atom-link href="https://github.com/..." target="_blank">GitHub</ag-atom-link>
 */
class AgAtomLink extends LitElement {
  static properties = {
    href: { type: String },
    target: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.href = '';
    this.target = '';
  }

  render() {
    return html`
      <a href=${this.href} target=${this.target || '_self'}>
        <slot></slot>
      </a>
    `;
  }
}

customElements.define('ag-atom-link', AgAtomLink);
