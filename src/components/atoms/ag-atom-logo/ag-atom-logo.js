import { LitElement, html } from 'lit';
import { styles } from './ag-atom-logo.styles.js';

/**
 * <ag-atom-logo> — Logo "AG.dev" del nav.
 *
 * Cuadrado gradient cian→purple con glow cian, seguido del texto "AG.dev"
 * en mono. El punto es cian, el sufijo ".dev" es fg-dim. Todo dentro de un
 * `<a>` — el router intercepta el click para navegar sin recargar.
 *
 * @property {string} href - Destino del logo. Default: `'/'`.
 *
 * @example
 *   <ag-atom-logo></ag-atom-logo>
 */
class AgAtomLogo extends LitElement {
  static properties = {
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.href = '/';
  }

  render() {
    return html`
      <a href=${this.href} aria-label="AG.dev — ir al inicio">
        <span class="mark" aria-hidden="true"></span>AG<span class="dot">.</span><span class="ext">dev</span>
      </a>
    `;
  }
}

customElements.define('ag-atom-logo', AgAtomLogo);
