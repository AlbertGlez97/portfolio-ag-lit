import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-callout.styles.js';

/**
 * <ag-molecule-callout> — Callout destacado del artículo.
 *
 * Borde cyan a la izquierda, fondo cyan suave, icono redondo `!` a la
 * izquierda, título uppercase pequeño + contenido por slot. El consumidor
 * debe pasar el cuerpo envuelto en `ag-atom-text variant="body"` (no en
 * `<p>` raw) para respetar la regla de tipografía del sistema.
 *
 * @slot (default) Cuerpo del callout — típicamente un `<ag-atom-text variant="body">`.
 *
 * @property {string} title - Título del callout (ej: "Nota importante").
 * @property {string} icon - Glyph del icon. Default `'!'`.
 *
 * @example
 *   <ag-molecule-callout title="Nota importante">
 *     <ag-atom-text variant="body">
 *       Esto solo funciona bien en <strong>WebGL 2.0</strong>...
 *     </ag-atom-text>
 *   </ag-molecule-callout>
 */
class AgMoleculeCallout extends LitElement {
  static properties = {
    title: { type: String },
    icon: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.title = '';
    this.icon = '!';
  }

  render() {
    return html`
      <div class="icon" aria-hidden="true">${this.icon}</div>
      <div class="body">
        ${this.title ? html`<span class="title">${this.title}</span>` : ''}
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('ag-molecule-callout', AgMoleculeCallout);
