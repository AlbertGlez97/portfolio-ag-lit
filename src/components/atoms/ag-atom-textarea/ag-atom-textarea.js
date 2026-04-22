import { LitElement, html } from 'lit';
import { styles } from './ag-atom-textarea.styles.js';

/**
 * <ag-atom-textarea> — Área de texto multilínea con estado de error.
 *
 * Misma estética que `ag-atom-input` pero con fuente mono y altura mínima
 * 130px. Resize vertical habilitado. Usado en el campo "mensaje" del
 * contact form.
 *
 * El contador de caracteres NO lo maneja el átomo — la molécula padre
 * (`ag-molecule-form-field`) lee `maxlength` y pinta el contador externo.
 *
 * @property {string} value - Valor actual.
 * @property {string} placeholder - Texto placeholder.
 * @property {string} name - Nombre del campo.
 * @property {number} maxlength - Límite de caracteres (attr nativo).
 * @property {boolean} required - Marca el campo como requerido.
 * @property {boolean} error - Activa el borde naranja.
 * @property {boolean} disabled - Deshabilita el textarea.
 *
 * @fires ag-input - Al tipear. Detail: `{ value }`.
 * @fires ag-change - Al blur. Detail: `{ value }`.
 *
 * @example
 *   <ag-atom-textarea
 *     name="message"
 *     maxlength="1000"
 *     placeholder="Cuéntame..."
 *     @ag-input=${(e) => this.message = e.detail.value}
 *   ></ag-atom-textarea>
 */
class AgAtomTextarea extends LitElement {
  static properties = {
    value: { type: String },
    placeholder: { type: String },
    name: { type: String },
    maxlength: { type: Number },
    required: { type: Boolean, reflect: true },
    error: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.value = '';
    this.placeholder = '';
    this.name = '';
    this.maxlength = null;
    this.required = false;
    this.error = false;
    this.disabled = false;
  }

  render() {
    return html`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        name=${this.name}
        maxlength=${this.maxlength ?? ''}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this._onInput}
        @change=${this._onChange}
      ></textarea>
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

  _onChange(e) {
    this.value = e.target.value;
    this.dispatchEvent(
      new CustomEvent('ag-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('ag-atom-textarea', AgAtomTextarea);
