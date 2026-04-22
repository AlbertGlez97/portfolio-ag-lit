import { LitElement, html } from 'lit';
import { styles } from './ag-atom-eyebrow.styles.js';

/**
 * <ag-atom-eyebrow> — Eyebrow de sección.
 *
 * Línea corta en mayúsculas y mono que precede a un título. Se renderiza
 * con una barra cian de 24px a la izquierda. Ejemplos en la maqueta:
 * "01 · Proyectos", "02 · El Laboratorio", "03 · Terminal".
 *
 * @slot (default) Texto del eyebrow.
 *
 * @example
 *   <ag-atom-eyebrow>01 · Proyectos</ag-atom-eyebrow>
 */
class AgAtomEyebrow extends LitElement {
  static styles = styles;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('ag-atom-eyebrow', AgAtomEyebrow);
