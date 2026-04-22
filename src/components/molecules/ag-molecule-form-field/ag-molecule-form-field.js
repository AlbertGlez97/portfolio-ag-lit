import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-form-field.styles.js';

/**
 * <ag-molecule-form-field> — Wrapper de campo de formulario.
 *
 * Renderiza label (con asterisco opcional de required) + slot para el input
 * (típicamente `ag-atom-input` o `ag-atom-textarea`) + mensaje de error
 * condicional. La molécula NO contiene el input — lo recibe por slot, así
 * el consumidor puede elegir el átomo que corresponda.
 *
 * @slot (default) El input/textarea del campo.
 *
 * @property {string} label - Texto del label.
 * @property {boolean} required - Muestra asterisco naranja junto al label.
 * @property {boolean} error - Muestra el mensaje de error.
 * @property {string} errorMsg - Mensaje de error.
 *
 * @example
 *   <ag-molecule-form-field label="Email" required ?error=${err} errorMsg="Ese email no se ve bien.">
 *     <ag-atom-input type="email" ?error=${err} @ag-input=${this._onEmail}></ag-atom-input>
 *   </ag-molecule-form-field>
 */
class AgMoleculeFormField extends LitElement {
  static properties = {
    label: { type: String },
    required: { type: Boolean, reflect: true },
    error: { type: Boolean, reflect: true },
    errorMsg: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.label = '';
    this.required = false;
    this.error = false;
    this.errorMsg = '';
  }

  render() {
    return html`
      <label>
        <span>${this.label} ${this.required ? html`<span class="req">*</span>` : ''}</span>
      </label>
      <slot></slot>
      ${this.error && this.errorMsg ? html`<span class="err">${this.errorMsg}</span>` : ''}
    `;
  }
}

customElements.define('ag-molecule-form-field', AgMoleculeFormField);
