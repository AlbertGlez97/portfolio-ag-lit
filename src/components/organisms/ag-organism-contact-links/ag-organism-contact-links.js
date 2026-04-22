import { LitElement, html } from 'lit';
import { styles } from './ag-organism-contact-links.styles.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../molecules/ag-molecule-contact-link/ag-molecule-contact-link.js';

/**
 * <ag-organism-contact-links> — Columna izquierda de la sección de contacto.
 *
 * Título de sección (con línea 2 en gradient), párrafo intro, y lista
 * vertical de `ag-molecule-contact-link`. El eyebrow "04 · Contacto" y el
 * layout en grid de 2 columnas (este organismo + `ag-organism-contact-form`)
 * los compone la page.
 *
 * @property {string} titleLine1 - Primera línea del título (plain fg).
 * @property {string} titleAccent - Segunda línea del título (gradient cyan→purple).
 * @property {string} intro - Párrafo intro debajo del título.
 * @property {Array<{id, label, value, href}>} links - Entradas de contacto.
 *
 * @example
 *   <ag-organism-contact-links
 *     titleLine1="Hablemos de tu"
 *     titleAccent="próximo proyecto."
 *     intro="Consultoría, contratos fijos o sólo para decir hola..."
 *     .links=${[
 *       { id: 'email',    label: 'Email',    value: 'hola@...', href: 'mailto:...' },
 *       { id: 'github',   label: 'GitHub',   value: '@...',     href: 'https://github.com/...' },
 *       { id: 'linkedin', label: 'LinkedIn', value: 'in/...',   href: 'https://linkedin.com/...' },
 *     ]}
 *   ></ag-organism-contact-links>
 */
class AgOrganismContactLinks extends LitElement {
  static properties = {
    titleLine1: { type: String },
    titleAccent: { type: String },
    intro: { type: String },
    links: { type: Array },
  };

  static styles = styles;

  constructor() {
    super();
    this.titleLine1 = '';
    this.titleAccent = '';
    this.intro = '';
    this.links = [];
  }

  render() {
    return html`
      <ag-atom-heading level="2" variant="section">
        <div>${this.titleLine1}</div>
        <div><ag-atom-gradient-text>${this.titleAccent}</ag-atom-gradient-text></div>
      </ag-atom-heading>

      <ag-atom-text variant="body">${this.intro}</ag-atom-text>

      <div class="links">
        ${this.links.map(
          (link) => html`
            <ag-molecule-contact-link
              label=${link.label || ''}
              value=${link.value || ''}
              href=${link.href || ''}
            ></ag-molecule-contact-link>
          `
        )}
      </div>
    `;
  }
}

customElements.define('ag-organism-contact-links', AgOrganismContactLinks);
