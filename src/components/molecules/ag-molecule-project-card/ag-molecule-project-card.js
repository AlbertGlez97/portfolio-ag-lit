import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-project-card.styles.js';
import '../../atoms/ag-atom-tag/ag-atom-tag.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';

/**
 * <ag-molecule-project-card> — Card de proyecto del landing.
 *
 * Número arriba-derecha, glyph icon, título, descripción, tags del stack
 * y foot con meta + CTA. El card entero hace hover lift; solo el CTA es
 * clickeable (es un `<a>` con href).
 *
 * @property {string} num - Número mostrado "// 01".
 * @property {string} icon - Glyph del proyecto (ej: "◐", "◇", "⎔").
 * @property {string} title - Título del proyecto.
 * @property {string} description - Descripción.
 * @property {Array<string>} tags - Stack técnico (ej: ["Next.js", "tRPC"]).
 * @property {string} meta - Texto del foot (ej: "2025 · producto").
 * @property {string} ctaLabel - Label del CTA (ej: "live", "code", "case").
 * @property {string} ctaUrl - URL del CTA.
 *
 * @example
 *   <ag-molecule-project-card
 *     num="01"
 *     icon="◐"
 *     title="Sinapsis AI"
 *     description="Editor colaborativo con LLMs locales..."
 *     .tags=${["Next.js", "tRPC", "Postgres"]}
 *     meta="2025 · producto"
 *     ctaLabel="live"
 *     ctaUrl="https://sinapsis.ai"
 *   ></ag-molecule-project-card>
 */
class AgMoleculeProjectCard extends LitElement {
  static properties = {
    num: { type: String },
    icon: { type: String },
    title: { type: String },
    description: { type: String },
    tags: { type: Array },
    meta: { type: String },
    ctaLabel: { type: String },
    ctaUrl: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.num = '';
    this.icon = '';
    this.title = '';
    this.description = '';
    this.tags = [];
    this.meta = '';
    this.ctaLabel = '';
    this.ctaUrl = '';
  }

  render() {
    return html`
      <div class="num">// ${this.num}</div>
      <div class="icon" aria-hidden="true">${this.icon}</div>
      <ag-atom-heading level="3" variant="card">${this.title}</ag-atom-heading>
      <ag-atom-text variant="body" class="description">${this.description}</ag-atom-text>
      <div class="tags">
        ${this.tags.map((t) => html`<ag-atom-tag>${t}</ag-atom-tag>`)}
      </div>
      <div class="card-foot">
        <span>${this.meta}</span>
        ${this.ctaUrl
          ? html`<a class="arrow" href=${this.ctaUrl}>${this.ctaLabel} →</a>`
          : html`<span class="arrow">${this.ctaLabel} →</span>`}
      </div>
    `;
  }
}

customElements.define('ag-molecule-project-card', AgMoleculeProjectCard);
