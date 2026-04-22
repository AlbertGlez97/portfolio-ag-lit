import { LitElement, html } from 'lit';
import { styles } from './ag-atom-chip.styles.js';

/**
 * <ag-atom-chip> — Chip presionable con dos variantes.
 *
 * - `filter` (usado en /laboratorio): chip seleccionable con contador opcional.
 *   El estado `active` lo gestiona el organismo padre — el átomo NO hace toggle
 *   interno. Al hacer click emite `ag-chip-select` con el estado pre-click y el
 *   padre decide qué chip queda seleccionado (mutex, múltiple, etc.).
 *
 * - `command` (usado en el terminal): chip disparador de comando. Al hacer
 *   click emite `ag-chip-command` con el `cmd` configurado. El átomo prepende
 *   un prompt `$` dimmer dentro del shadow — NO lo incluyas en el slot.
 *
 * Accesibilidad: el host es `role="button"` con `tabindex="0"`. Enter y Space
 * disparan el click. En variant filter expone `aria-pressed="true|false"`.
 *
 * @slot (default) Etiqueta del chip (ej: "Three.js", "whoami", "Todos").
 *
 * @property {string} variant - `filter` · `command`.
 * @property {boolean} active - Solo variant filter — chip seleccionado.
 * @property {number} count - Solo variant filter — contador (se muestra zero-pad a 2 dígitos).
 * @property {string} cmd - Solo variant command — nombre del comando a emitir.
 *
 * @fires ag-chip-select - Click en variant filter. Detail: `{ variant, active }` (active es el estado PRE-click).
 * @fires ag-chip-command - Click en variant command. Detail: `{ cmd }`.
 *
 * @example
 *   <ag-atom-chip variant="filter" active count="12">Todos</ag-atom-chip>
 *   <ag-atom-chip variant="filter" count="4">Three.js</ag-atom-chip>
 *   <ag-atom-chip variant="command" cmd="whoami">whoami</ag-atom-chip>
 */
class AgAtomChip extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    active: { type: Boolean, reflect: true },
    count: { type: Number },
    cmd: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.variant = 'filter';
    this.active = false;
    this.count = null;
    this.cmd = '';
    this._onClick = this._onClick.bind(this);
    this._onKey = this._onKey.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKey);
  }

  updated() {
    if (this.variant === 'filter') {
      this.setAttribute('aria-pressed', this.active ? 'true' : 'false');
    } else {
      this.removeAttribute('aria-pressed');
    }
  }

  render() {
    if (this.variant === 'command') {
      return html`<span class="prompt">$</span><slot></slot>`;
    }

    const hasCount = typeof this.count === 'number' && !Number.isNaN(this.count);
    return html`
      <slot></slot>
      ${hasCount
        ? html`<span class="count">${String(this.count).padStart(2, '0')}</span>`
        : ''}
    `;
  }

  _onClick() {
    if (this.variant === 'command') {
      this.dispatchEvent(
        new CustomEvent('ag-chip-command', {
          detail: { cmd: this.cmd },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent('ag-chip-select', {
        detail: { variant: this.variant, active: this.active },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._onClick();
    }
  }
}

customElements.define('ag-atom-chip', AgAtomChip);
