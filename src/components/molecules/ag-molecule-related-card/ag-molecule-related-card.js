import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-related-card.styles.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';

/**
 * <ag-molecule-related-card> — Card de artículo relacionado al final del
 * artículo individual.
 *
 * Layout horizontal: glyph coloreado por categoría (64×64) + meta + título
 * (card-sm). Toda la card es link.
 *
 * @property {string} category - Categoría del artículo (threejs | ia | tutor | backend).
 * @property {string} icon - Glyph del visual (ej: "◐", "◇").
 * @property {string} meta - Meta line (ej: "IA · 28·MAR·2025").
 * @property {string} title - Título del artículo.
 * @property {string} href - Ruta al artículo.
 *
 * @example
 *   <ag-molecule-related-card
 *     category="ia"
 *     icon="◐"
 *     meta="IA · 28·MAR·2025"
 *     title="Embeddings caseros..."
 *     href="/laboratorio/embeddings-caseros"
 *   ></ag-molecule-related-card>
 */
class AgMoleculeRelatedCard extends LitElement {
  static properties = {
    category: { type: String, reflect: true },
    icon: { type: String },
    meta: { type: String },
    title: { type: String },
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.category = '';
    this.icon = '';
    this.meta = '';
    this.title = '';
    this.href = '';
  }

  render() {
    return html`
      <a href=${this.href}>
        <div class="vis" aria-hidden="true">${this.icon}</div>
        <div class="body">
          <div class="meta">${this.meta}</div>
          <ag-atom-heading level="3" variant="card-sm">${this.title}</ag-atom-heading>
        </div>
      </a>
    `;
  }
}

customElements.define('ag-molecule-related-card', AgMoleculeRelatedCard);
