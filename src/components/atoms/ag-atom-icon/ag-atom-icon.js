import { LitElement, html } from 'lit';
import { styles } from './ag-atom-icon.styles.js';

/**
 * <ag-atom-icon> — Contenedor normalizado para SVG inline.
 *
 * El átomo solo establece dimensiones y hereda `color` vía `currentColor`.
 * El SVG lo provee el consumidor vía slot (se recomienda `stroke="currentColor"`
 * en el `<path>` del SVG para que siga el color del padre).
 *
 * @slot (default) El elemento `<svg>` inline.
 *
 * @property {number} size - Tamaño en píxeles (alto y ancho). Default: `16`.
 *
 * @example
 *   <ag-atom-icon size="15" style="color: var(--cyan);">
 *     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
 *       <circle cx="11" cy="11" r="7"/>
 *       <path d="m20 20-3.5-3.5"/>
 *     </svg>
 *   </ag-atom-icon>
 */
class AgAtomIcon extends LitElement {
  static properties = {
    size: { type: Number },
  };

  static styles = styles;

  constructor() {
    super();
    this.size = 16;
  }

  updated() {
    this.style.setProperty('--_ag-icon-size', `${this.size / 16}rem`);
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('ag-atom-icon', AgAtomIcon);
