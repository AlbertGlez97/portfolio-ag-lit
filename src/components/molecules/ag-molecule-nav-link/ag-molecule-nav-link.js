import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-nav-link.styles.js';

/**
 * <ag-molecule-nav-link> — Link del nav principal.
 *
 * Formato "01 Proyectos": número (`idx`) en fg-dimmer + label (slot) en
 * fg-dim. En hover el label pasa a fg y aparece un fondo blanco translúcido.
 * En estado `active` (controlado por el organismo nav) tanto el idx como el
 * label pasan a cian.
 *
 * Responsive: en viewports ≤ 720px, los links SIN `keep` se ocultan. Tip
 * práctico: solo el CTA "Contacto" suele llevar `keep`.
 *
 * El click lo intercepta el router global — la molécula NO emite eventos.
 * El `active` lo setea el organismo nav según la ruta o el scroll.
 *
 * @slot (default) Label del link (ej: "Proyectos", "Laboratorio").
 *
 * @property {string} href - Destino del link.
 * @property {string} idx - Número o prefijo ("01", "02", ...).
 * @property {boolean} active - Estado seleccionado; controlado por el padre.
 * @property {boolean} keep - Si true, mantiene visible en mobile (≤720px).
 *
 * @example
 *   <ag-molecule-nav-link href="/laboratorio" idx="02" ?active=${onLab}>
 *     Laboratorio
 *   </ag-molecule-nav-link>
 *
 *   <ag-molecule-nav-link href="/#contacto" idx="04" keep>
 *     Contacto
 *   </ag-molecule-nav-link>
 */
class AgMoleculeNavLink extends LitElement {
  static properties = {
    href: { type: String },
    idx: { type: String },
    active: { type: Boolean, reflect: true },
    keep: { type: Boolean, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.href = '';
    this.idx = '';
    this.active = false;
    this.keep = false;
  }

  render() {
    return html`
      <a
        href=${this.href}
        aria-current=${this.active ? 'page' : 'false'}
      >
        <span class="idx">${this.idx}</span><slot></slot>
      </a>
    `;
  }
}

customElements.define('ag-molecule-nav-link', AgMoleculeNavLink);
