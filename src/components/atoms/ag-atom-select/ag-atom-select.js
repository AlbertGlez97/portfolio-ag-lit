import { LitElement, html } from 'lit';
import { styles } from './ag-atom-select.styles.js';

/**
 * <ag-atom-select> — Dropdown nativo con estilos del sistema.
 *
 * Usa `<select>` nativo con `<option>`s internos generados desde `options`.
 * El styling de las opciones está limitado por el browser — se colorean el
 * background y el color pero la tipografía y padding siguen siendo nativos.
 *
 * Se usa en el sort del laboratorio ("Más recientes", "Más leídos", "Alfabético").
 *
 * @property {Array<{value: string, label: string}>} options - Opciones del select.
 * @property {string} value - Valor actualmente seleccionado.
 * @property {string} name - Nombre del campo.
 * @property {boolean} disabled - Deshabilita el select.
 *
 * @fires ag-change - Al cambiar la selección. Detail: `{ value }`.
 *
 * @example
 *   <ag-atom-select
 *     .options=${[
 *       { value: 'recent', label: 'Más recientes' },
 *       { value: 'popular', label: 'Más leídos' },
 *       { value: 'alpha', label: 'Alfabético' },
 *     ]}
 *     .value=${this.sort}
 *     @ag-change=${(e) => (this.sort = e.detail.value)}
 *   ></ag-atom-select>
 */
class AgAtomSelect extends LitElement {
  static properties = {
    options: { type: Array },
    value: { type: String },
    name: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.options = [];
    this.value = '';
    this.name = '';
    this.disabled = false;
  }

  render() {
    return html`
      <select
        name=${this.name}
        .value=${this.value}
        ?disabled=${this.disabled}
        @change=${this._onChange}
      >
        ${this.options.map(
          (o) => html`<option value=${o.value} ?selected=${o.value === this.value}>${o.label}</option>`
        )}
      </select>
    `;
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

customElements.define('ag-atom-select', AgAtomSelect);
