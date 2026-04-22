import { LitElement, html } from 'lit';
import { styles } from './ag-atom-button.styles.js';

/**
 * <ag-atom-button> — Botón con 6 variantes visuales.
 *
 * Variantes:
 *   - `primary` — CTA cian con borde translúcido (hero, laboratorio).
 *   - `ghost` — secundario, borde tenue, color dim (hero).
 *   - `send` — sólido cian para submit (contact form).
 *   - `back` — volver, con leve translateX inverso al hover (fin de artículo).
 *   - `read` — leer artículo, cian suave (featured del laboratorio).
 *   - `rate` — pill 999px con toggle `picked` (rating del artículo).
 *
 * Si `href` está presente y no está disabled, el átomo renderiza un `<a>`
 * (el router intercepta el click para navegar sin recargar). Si no, renderiza
 * un `<button>` con el `type` dado (default `button`).
 *
 * @slot (default) Contenido del botón (texto + íconos opcionales).
 *
 * @property {string} variant - `primary | ghost | send | back | read | rate`.
 * @property {boolean} disabled - Deshabilita el botón.
 * @property {string} href - Si se setea, renderiza como `<a>`.
 * @property {string} type - Tipo del button cuando NO hay href. Default `'button'`.
 * @property {boolean} picked - Solo variant rate — estado seleccionado del rating.
 *
 * @fires ag-click - Click en el botón (si no está disabled). Detail: `{ variant }`.
 *
 * @example
 *   <ag-atom-button variant="primary" href="/laboratorio">Ver artículos</ag-atom-button>
 *   <ag-atom-button variant="send" type="submit">Enviar mensaje</ag-atom-button>
 *   <ag-atom-button variant="rate" ?picked=${this.up}>Sí</ag-atom-button>
 */
class AgAtomButton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    href: { type: String },
    type: { type: String },
    picked: { type: Boolean, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.variant = 'primary';
    this.disabled = false;
    this.href = '';
    this.type = 'button';
    this.picked = false;
  }

  render() {
    if (this.href && !this.disabled) {
      return html`<a href=${this.href} @click=${this._onClick}><slot></slot></a>`;
    }
    return html`
      <button type=${this.type} ?disabled=${this.disabled} @click=${this._onClick}>
        <slot></slot>
      </button>
    `;
  }

  _onClick(e) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this.dispatchEvent(
      new CustomEvent('ag-click', {
        detail: { variant: this.variant },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('ag-atom-button', AgAtomButton);
