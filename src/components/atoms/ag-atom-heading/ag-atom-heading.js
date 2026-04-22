import { LitElement, html, nothing } from 'lit';
import { styles } from './ag-atom-heading.styles.js';

/**
 * <ag-atom-heading> — Heading semántico con variante visual.
 *
 * Renderiza la etiqueta `<h1>`–`<h6>` correcta según `level` (semántica
 * para SEO y lectores de pantalla), y aplica el preset visual de `variant`
 * (display / section / card / article). El texto viaja por slot — queda
 * proyectado desde el light DOM y es indexable.
 *
 * Para `variant="article"`, la prop `num` se refleja como `data-n` en el
 * `<h>` interno, y se pinta como prefijo cian en mono ("01", "02") a la
 * izquierda del título.
 *
 * @slot (default) Texto del heading.
 *
 * @property {number} level - 1 | 2 | 3 | 4 | 5 | 6. Default 2.
 * @property {string} variant - `display | section | card | article`. Default `section`.
 * @property {string} num - Solo variant `article` — prefijo numérico (ej: "01").
 *
 * @example
 *   <ag-atom-heading level="1" variant="display">ALBERTO</ag-atom-heading>
 *   <ag-atom-heading level="2" variant="section">Lo que he construido</ag-atom-heading>
 *   <ag-atom-heading level="3" variant="card">Sinapsis AI</ag-atom-heading>
 *   <ag-atom-heading level="2" variant="article" num="01">Introducción</ag-atom-heading>
 */
class AgAtomHeading extends LitElement {
  static properties = {
    level: { type: Number, reflect: true },
    variant: { type: String, reflect: true },
    num: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.level = 2;
    this.variant = 'section';
    this.num = '';
  }

  render() {
    const dataN = this.num || nothing;
    const slot = html`<slot></slot>`;
    switch (this.level) {
      case 1: return html`<h1 data-n=${dataN}>${slot}</h1>`;
      case 2: return html`<h2 data-n=${dataN}>${slot}</h2>`;
      case 3: return html`<h3 data-n=${dataN}>${slot}</h3>`;
      case 4: return html`<h4 data-n=${dataN}>${slot}</h4>`;
      case 5: return html`<h5 data-n=${dataN}>${slot}</h5>`;
      case 6: return html`<h6 data-n=${dataN}>${slot}</h6>`;
      default: return html`<h2 data-n=${dataN}>${slot}</h2>`;
    }
  }
}

customElements.define('ag-atom-heading', AgAtomHeading);
