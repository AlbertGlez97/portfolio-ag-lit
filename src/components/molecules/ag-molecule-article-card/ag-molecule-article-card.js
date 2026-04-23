import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-article-card.styles.js';
import '../../atoms/ag-atom-tag/ag-atom-tag.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';

/**
 * <ag-molecule-article-card> — Card del grid del laboratorio.
 *
 * Top: tag de categoría + fecha. Medio: título (card-sm) + excerpt.
 * Foot: read time con dot + flecha "Leer →". Toda la card es link.
 *
 * @property {string} category - Variant del tag (legado, conservado para compatibilidad — ya no se renderiza).
 * @property {string} categoryLabel - Label de la categoría (legado, conservado para compatibilidad — ya no se renderiza).
 * @property {Array<string>} tags - Array de tag IDs a renderizar como chips.
 * @property {Object} tagsLabels - Mapa `id → label` para el texto visible de cada chip. Fallback al id si falta.
 * @property {string} date - Fecha (ej: "28 · MAR · 2025").
 * @property {string} title - Título.
 * @property {string} excerpt - Excerpt.
 * @property {string} readTime - Texto (ej: "6 min de lectura").
 * @property {string} readLabel - Label del CTA. Default `'Leer →'`.
 * @property {string} href - Ruta.
 *
 * @example
 *   <ag-molecule-article-card
 *     .tags=${['javascript', 'litelement']}
 *     .tagsLabels=${{ javascript: 'JavaScript', litelement: 'LitElement' }}
 *     date="28 · MAR · 2025"
 *     title="Embeddings caseros"
 *     excerpt="Un pipeline con all-MiniLM..."
 *     readTime="6 min de lectura"
 *     href="/laboratorio/embeddings-caseros"
 *   ></ag-molecule-article-card>
 */
class AgMoleculeArticleCard extends LitElement {
  static properties = {
    category: { type: String },
    categoryLabel: { type: String },
    tags: { type: Array },
    tagsLabels: { type: Object },
    date: { type: String },
    title: { type: String },
    excerpt: { type: String },
    readTime: { type: String },
    readLabel: { type: String },
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.category = '';
    this.categoryLabel = '';
    this.tags = [];
    this.tagsLabels = {};
    this.date = '';
    this.title = '';
    this.excerpt = '';
    this.readTime = '';
    this.readLabel = 'Leer →';
    this.href = '';
  }

  render() {
    return html`
      <a href=${this.href}>
        <div class="card-top">
          <div class="tags">
            ${this.tags.map(
              (t) => html`<ag-atom-tag variant=${t}>${this.tagsLabels[t] || t}</ag-atom-tag>`
            )}
          </div>
          <span class="date">${this.date}</span>
        </div>
        <ag-atom-heading level="3" variant="card-sm">${this.title}</ag-atom-heading>
        <ag-atom-text variant="body" class="excerpt">${this.excerpt}</ag-atom-text>
        <div class="foot">
          <span class="read-time">${this.readTime}</span>
          <span class="arrow">${this.readLabel}</span>
        </div>
      </a>
    `;
  }
}

customElements.define('ag-molecule-article-card', AgMoleculeArticleCard);
