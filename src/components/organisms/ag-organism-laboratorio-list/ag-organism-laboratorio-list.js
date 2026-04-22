import { LitElement, html } from 'lit';
import { styles } from './ag-organism-laboratorio-list.styles.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';
import '../../molecules/ag-molecule-lab-row/ag-molecule-lab-row.js';

/**
 * <ag-organism-laboratorio-list> — Preview del laboratorio en el landing.
 *
 * Header stackeado (eyebrow + title + kicker) seguido de una lista vertical
 * de `ag-molecule-lab-row` con un border-top separador. Para la página
 * completa del laboratorio se usa `ag-organism-articles-board` (grid +
 * filtros), no este organismo.
 *
 * El `id="laboratorio"` lo debe setear el consumer en el host (igual que
 * projects-grid) para que el nav lo observe.
 *
 * @property {string} eyebrowText - Eyebrow (ej: "02 · El Laboratorio").
 * @property {string} titleText - Título de sección.
 * @property {string} kickerText - Kicker descriptivo.
 * @property {Array} articles - `[{ category, categoryLabel, date, title, excerpt, href }]`.
 * @property {string} ctaLabel - Label del botón CTA al laboratorio completo.
 * @property {string} ctaHref - Href del botón CTA.
 *
 * @example
 *   <ag-organism-laboratorio-list
 *     id="laboratorio"
 *     eyebrowText="02 · El Laboratorio"
 *     titleText="Ideas, experimentos y cosas a medio hacer."
 *     kickerText="Notas técnicas, experimentos y tutoriales. Escribo lo que aprendo."
 *     .articles=${articles.slice(0, 4)}
 *   ></ag-organism-laboratorio-list>
 */
class AgOrganismLaboratorioList extends LitElement {
  static properties = {
    eyebrowText: { type: String },
    titleText: { type: String },
    kickerText: { type: String },
    articles: { type: Array },
    ctaLabel: { type: String },
    ctaHref: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.eyebrowText = '';
    this.titleText = '';
    this.kickerText = '';
    this.articles = [];
    this.ctaLabel = '';
    this.ctaHref = '';
  }

  render() {
    return html`
      <div class="wrap">
        <div class="head">
          <ag-atom-eyebrow>${this.eyebrowText}</ag-atom-eyebrow>
          <ag-atom-heading level="2" variant="section">${this.titleText}</ag-atom-heading>
          <ag-atom-text variant="body">${this.kickerText}</ag-atom-text>
        </div>

        <div class="list">
          ${this.articles.map(
            (a) => html`
              <ag-molecule-lab-row
                category=${a.category || ''}
                categoryLabel=${a.categoryLabel || ''}
                date=${a.date || ''}
                title=${a.title || ''}
                excerpt=${a.excerpt || ''}
                href=${a.href || ''}
              ></ag-molecule-lab-row>
            `
          )}
        </div>

        ${this.ctaLabel && this.ctaHref ? html`
          <div class="cta">
            <ag-atom-button variant="ghost" href=${this.ctaHref}>${this.ctaLabel}</ag-atom-button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('ag-organism-laboratorio-list', AgOrganismLaboratorioList);
