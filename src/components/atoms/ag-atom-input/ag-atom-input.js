import { LitElement, html } from 'lit';
import { styles } from './ag-atom-input.styles.js';

/**
 * <ag-atom-input> — Input de texto o email con estado de error.
 *
 * Variante de formulario: fondo oscuro translúcido, borde, radius,
 * focus cian con glow. NO se usa para el search box del laboratorio —
 * ese va en `ag-molecule-search-box` con estilos diferentes (bg transparente,
 * sin padding propio, porque el input vive dentro del contenedor).
 *
 * @property {string} type - `text | email`. Default `'text'`.
 * @property {string} value - Valor actual.
 * @property {string} placeholder - Texto placeholder.
 * @property {string} name - Nombre del campo (para formularios).
 * @property {boolean} required - Marca el input como requerido.
 * @property {boolean} error - Activa el estado de error (borde naranja).
 * @property {boolean} disabled - Deshabilita el input.
 *
 * @fires ag-input - Al tipear (evento `input`). Detail: `{ value }`.
 * @fires ag-change - Al blur o submit (evento `change`). Detail: `{ value }`.
 *
 * @example
 *   <ag-atom-input
 *     type="email"
 *     name="email"
 *     placeholder="tu@correo.com"
 *     ?error=${this.emailError}
 *     @ag-input=${(e) => this.email = e.detail.value}
 *   ></ag-atom-input>
 */
class AgAtomInput extends LitElement {
  static properties = {
    type: { type: String },
    value: { type: String },
    placeholder: { type: String },
    name: { type: String },
    required: { type: Boolean, reflect: true },
    error: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.type = 'text';
    this.value = '';
    this.placeholder = '';
    this.name = '';
    this.required = false;
    this.error = false;
    this.disabled = false;
  }

  render() {
    return html`
      <input
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder}
        name=${this.name}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this._onInput}
        @change=${this._onChange}
      />
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

customElements.define('ag-atom-input', AgAtomInput);
