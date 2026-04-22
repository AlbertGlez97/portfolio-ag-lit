import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-breadcrumb.styles.js';

/**
 * <ag-molecule-breadcrumb> — Migas de pan.
 *
 * Renderiza una secuencia de crumbs separadas por `/`. Cada crumb puede
 * tener `href` (link navegable) o no (texto plano). El último crumb se
 * pinta siempre en blue como "estás acá" aunque tenga href — usá el estado
 * `current` con intención.
 *
 * @property {Array<{label: string, href?: string}>} items - Crumbs.
 *
 * @example
 *   <ag-molecule-breadcrumb .items=${[
 *     { label: 'AG.dev', href: '/' },
 *     { label: 'Laboratorio', href: '/laboratorio' },
 *     { label: 'Three.js' }
 *   ]}></ag-molecule-breadcrumb>
 */
class AgMoleculeBreadcrumb extends LitElement {
  static properties = {
    items: { type: Array },
  };

  static styles = styles;

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Breadcrumb');
  }

  render() {
    return html`
      ${this.items.map((item, i) => {
        const isLast = i === this.items.length - 1;
        const sep = i > 0 ? html`<span class="sep" aria-hidden="true">/</span>` : '';
        if (isLast) {
          return html`${sep}<span class="current" aria-current="page">${item.label}</span>`;
        }
        if (item.href) {
          return html`${sep}<a href=${item.href}>${item.label}</a>`;
        }
        return html`${sep}<span>${item.label}</span>`;
      })}
    `;
  }
}

customElements.define('ag-molecule-breadcrumb', AgMoleculeBreadcrumb);
