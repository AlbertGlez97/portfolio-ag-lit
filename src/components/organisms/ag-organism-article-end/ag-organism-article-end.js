import { LitElement, html } from 'lit';
import { styles } from './ag-organism-article-end.styles.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';
import '../../molecules/ag-molecule-rating/ag-molecule-rating.js';
import '../../molecules/ag-molecule-related-card/ag-molecule-related-card.js';

/**
 * <ag-organism-article-end> — Bloque final del artículo.
 *
 * Orquesta 3 secciones debajo del contenido:
 *   1. Rating — `ag-molecule-rating`. Captura `ag-rate` y re-emite como
 *      `ag-article-rated` para que la page persista el voto.
 *   2. Artículos relacionados — grid 2-col de `ag-molecule-related-card`.
 *   3. Botón back al laboratorio — `ag-atom-button variant="back"`.
 *
 * Si `relatedArticles` está vacío, la sección de related no se renderiza.
 *
 * @property {string} ratingQuestion - Pregunta del rating (ej: "¿Te resultó útil?").
 * @property {string} ratingUpLabel - Label del botón positivo.
 * @property {string} ratingDownLabel - Label del botón negativo.
 * @property {number} ratingUpCount - Contador positivo.
 * @property {number} ratingDownCount - Contador negativo.
 * @property {string} ratingPicked - Voto actual: `'up' | 'down' | ''`.
 * @property {string} ratingThanksText - Texto post-voto.
 * @property {string} relatedTitle - Label de la sección related (ej: "Artículos relacionados").
 * @property {Array} relatedArticles - `[{ category, icon, meta, title, href, slug? }]`.
 * @property {string} backLabel - Label del botón back.
 * @property {string} backHref - Destino del back. Default `/laboratorio`.
 *
 * @fires ag-article-rated - Re-emit del rate. Detail: `{ vote: 'up' | 'down' }`.
 *
 * @example
 *   <ag-organism-article-end
 *     ratingQuestion="¿Te resultó útil?"
 *     ratingUpLabel="Sí"
 *     ratingDownLabel="No"
 *     ratingUpCount="142"
 *     ratingDownCount="8"
 *     ratingThanksText="¡Gracias por el feedback!"
 *     relatedTitle="Artículos relacionados"
 *     .relatedArticles=${relatedArticles}
 *     backLabel="← Volver al Laboratorio"
 *     backHref="/laboratorio"
 *     @ag-article-rated=${this.saveVote}
 *   ></ag-organism-article-end>
 */
class AgOrganismArticleEnd extends LitElement {
  static properties = {
    ratingQuestion: { type: String },
    ratingUpLabel: { type: String },
    ratingDownLabel: { type: String },
    ratingUpCount: { type: Number },
    ratingDownCount: { type: Number },
    ratingPicked: { type: String },
    ratingThanksText: { type: String },
    relatedTitle: { type: String },
    relatedArticles: { type: Array },
    backLabel: { type: String },
    backHref: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.ratingQuestion = '';
    this.ratingUpLabel = '';
    this.ratingDownLabel = '';
    this.ratingUpCount = 0;
    this.ratingDownCount = 0;
    this.ratingPicked = '';
    this.ratingThanksText = '';
    this.relatedTitle = '';
    this.relatedArticles = [];
    this.backLabel = '';
    this.backHref = '/laboratorio';
  }

  _onRate(e) {
    this.dispatchEvent(
      new CustomEvent('ag-article-rated', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <ag-molecule-rating
        question=${this.ratingQuestion}
        upLabel=${this.ratingUpLabel}
        downLabel=${this.ratingDownLabel}
        upCount=${this.ratingUpCount}
        downCount=${this.ratingDownCount}
        picked=${this.ratingPicked}
        thanksText=${this.ratingThanksText}
        @ag-rate=${this._onRate}
      ></ag-molecule-rating>

      ${this.relatedArticles.length > 0
        ? html`
            <ag-atom-eyebrow>${this.relatedTitle}</ag-atom-eyebrow>
            <div class="related-grid">
              ${this.relatedArticles.map(
                (a) => html`
                  <ag-molecule-related-card
                    category=${a.category || ''}
                    icon=${a.icon || ''}
                    meta=${a.meta || ''}
                    title=${a.title || ''}
                    href=${a.href || (a.slug ? `/laboratorio/${a.slug}` : '')}
                  ></ag-molecule-related-card>
                `
              )}
            </div>
          `
        : ''}

      <ag-atom-button variant="back" href=${this.backHref}>${this.backLabel}</ag-atom-button>
    `;
  }
}

customElements.define('ag-organism-article-end', AgOrganismArticleEnd);
