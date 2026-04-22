import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-search-box.styles.js';
import '../../atoms/ag-atom-icon/ag-atom-icon.js';
import '../../atoms/ag-atom-kbd/ag-atom-kbd.js';

/**
 * <ag-molecule-search-box> — Caja de búsqueda del laboratorio.
 *
 * Lupa cian a la izquierda, input flex transparente en el medio, kbd hint
 * a la derecha. NO usa `ag-atom-input` — el input de esta caja no tiene
 * bg/borde propio (viven en el contenedor). Expone `focus()` público para
 * que el organismo lo dispare con la tecla `/`.
 *
 * @property {string} value - Valor actual del input.
 * @property {string} placeholder - Texto placeholder.
 * @property {string} kbdHint - Tecla mostrada a la derecha. Default `'/'`.
 *
 * @fires ag-input - Al tipear. Detail: `{ value }`.
 *
 * @example
 *   <ag-molecule-search-box
 *     placeholder="Buscar artículo..."
 *     @ag-input=${(e) => this.query = e.detail.value}
 *   ></ag-molecule-search-box>
 */
class AgMoleculeSearchBox extends LitElement {
  static properties = {
    value: { type: String },
    placeholder: { type: String },
    kbdHint: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.kbdHint = '/';
  }

  focus() {
    this.renderRoot.querySelector('input')?.focus();
  }

  render() {
    return html`
      <ag-atom-icon size="15" style="color: var(--cyan)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="m20 20-3.5-3.5"/>
        </svg>
      </ag-atom-icon>
      <input
        type="text"
        .value=${this.value}
        placeholder=${this.placeholder}
        autocomplete="off"
        spellcheck="false"
        @input=${this._onInput}
      />
      ${this.kbdHint ? html`<ag-atom-kbd>${this.kbdHint}</ag-atom-kbd>` : ''}
    `;
  }

  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('ag-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('ag-molecule-search-box', AgMoleculeSearchBox);
