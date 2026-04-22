import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-stat.styles.js';

/**
 * <ag-molecule-stat> — Contador de la barra de stats del landing.
 *
 * Muestra un número grande (`value`) con una unidad cian (`unit`) y un
 * label en mono mayúsculas debajo. El borde izquierdo se dibuja como
 * separador entre stats consecutivos — el primero no lo lleva (usa
 * `:host(:first-child)`).
 *
 * @slot (default) Label del stat (ej: "Años de exp.").
 *
 * @property {string} value - Número o símbolo a mostrar (`"5"`, `"∞"`, `"01"`).
 * @property {string} unit - Unidad cian (`"+"`, `"/h"`, `""`).
 *
 * @example
 *   <ag-molecule-stat value="5" unit="+">Años de exp.</ag-molecule-stat>
 *   <ag-molecule-stat value="∞">Curiosidad</ag-molecule-stat>
 */
class AgMoleculeStat extends LitElement {
  static properties = {
    value: { type: String },
    unit: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.value = '';
    this.unit = '';
  }

  render() {
    return html`
      <div class="num">${this.value}<span class="unit">${this.unit}</span></div>
      <div class="lbl"><slot></slot></div>
    `;
  }
}

customElements.define('ag-molecule-stat', AgMoleculeStat);
