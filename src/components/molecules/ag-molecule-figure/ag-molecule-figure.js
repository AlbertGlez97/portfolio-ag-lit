import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-figure.styles.js';

/**
 * <ag-molecule-figure> — Figura del artículo: contenedor SVG + caption.
 *
 * Caja oscura con border y radius para el SVG (pasa por slot). Debajo,
 * caption con número cian ("Fig. 01") y texto descriptivo con border-left.
 *
 * @slot (default) SVG o contenido visual.
 *
 * @property {string} num - Número de figura (ej: "01").
 * @property {string} numLabel - Prefijo. Default `'Fig.'`.
 * @property {string} caption - Texto descriptivo.
 *
 * @example
 *   <ag-molecule-figure num="01" caption="Descomposición visual del fBm en 4 octavas.">
 *     <svg viewBox="0 0 720 320">...</svg>
 *   </ag-molecule-figure>
 */
class AgMoleculeFigure extends LitElement {
  static properties = {
    num: { type: String },
    numLabel: { type: String },
    caption: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.num = '';
    this.numLabel = 'Fig.';
    this.caption = '';
  }

  render() {
    return html`
      <figure>
        <div class="visual">
          <slot></slot>
        </div>
        <figcaption>
          ${this.num ? html`<span class="num">${this.numLabel} ${this.num}</span>` : ''}${this.caption}
        </figcaption>
      </figure>
    `;
  }
}

customElements.define('ag-molecule-figure', AgMoleculeFigure);
