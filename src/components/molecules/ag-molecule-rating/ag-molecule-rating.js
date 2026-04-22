import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-rating.styles.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';

/**
 * <ag-molecule-rating> — Rating 👍/👎 con contador y agradecimiento.
 *
 * Pregunta a la izquierda, dos botones rate (pill) con emoji + label +
 * contador. Cuando el user vota, el botón elegido queda `picked` y aparece
 * el texto de agradecimiento a la derecha. Los botones quedan visibles.
 *
 * El estado `picked` se setea internamente al hacer click pero puede ser
 * sobreescrito por el parent (controlled-uncontrolled). Esto permite
 * persistir el voto externamente sin que la molécula deje de funcionar
 * por sí sola.
 *
 * @property {string} question - Pregunta (ej: "¿Te resultó útil?").
 * @property {string} upLabel - Label del positivo (ej: "Sí").
 * @property {string} downLabel - Label del negativo (ej: "No").
 * @property {number} upCount - Contador positivo.
 * @property {number} downCount - Contador negativo.
 * @property {string} picked - `'up' | 'down' | ''`. Voto actual.
 * @property {string} thanksText - Texto post-voto.
 *
 * @fires ag-rate - Al votar. Detail: `{ vote: 'up' | 'down' }`.
 *
 * @example
 *   <ag-molecule-rating
 *     question="¿Te resultó útil?"
 *     upLabel="Sí"
 *     downLabel="No"
 *     upCount="142"
 *     downCount="8"
 *     thanksText="¡Gracias por el feedback!"
 *     @ag-rate=${(e) => this.save(e.detail.vote)}
 *   ></ag-molecule-rating>
 */
class AgMoleculeRating extends LitElement {
  static properties = {
    question: { type: String },
    upLabel: { type: String },
    downLabel: { type: String },
    upCount: { type: Number },
    downCount: { type: Number },
    picked: { type: String, reflect: true },
    thanksText: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.question = '';
    this.upLabel = '';
    this.downLabel = '';
    this.upCount = 0;
    this.downCount = 0;
    this.picked = '';
    this.thanksText = '';
  }

  render() {
    return html`
      <span class="question">${this.question}</span>
      <div class="btns">
        <ag-atom-button
          variant="rate"
          ?picked=${this.picked === 'up'}
          @ag-click=${() => this._vote('up')}
        >
          👍 ${this.upLabel} <span class="count">· ${this.upCount}</span>
        </ag-atom-button>
        <ag-atom-button
          variant="rate"
          ?picked=${this.picked === 'down'}
          @ag-click=${() => this._vote('down')}
        >
          👎 ${this.downLabel} <span class="count">· ${this.downCount}</span>
        </ag-atom-button>
      </div>
      ${this.picked
        ? html`
            <span class="thanks">
              <span class="check" aria-hidden="true">✓</span> ${this.thanksText}
            </span>
          `
        : ''}
    `;
  }

  _vote(vote) {
    this.picked = vote;
    this.dispatchEvent(
      new CustomEvent('ag-rate', {
        detail: { vote },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('ag-molecule-rating', AgMoleculeRating);
