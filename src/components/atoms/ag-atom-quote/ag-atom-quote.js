import { LitElement, html } from 'lit';
import { styles } from './ag-atom-quote.styles.js';

/**
 * <ag-atom-quote> — Blockquote con borde cian izquierdo.
 *
 * Texto en display italic 20px. El slot `cite` es opcional — si se pasa,
 * se renderiza debajo en mono uppercase como fuente. Si no se pasa, no
 * hay rastro visual (el slot no proyecta nada).
 *
 * @slot (default) Texto de la cita.
 * @slot cite - Fuente/autor de la cita (opcional).
 *
 * @example
 *   <ag-atom-quote>
 *     Menos dashboards, más herramientas.
 *     <span slot="cite">Alberto González</span>
 *   </ag-atom-quote>
 *
 *   <!-- Sin cita -->
 *   <ag-atom-quote>La simplicidad se construye; no se encuentra.</ag-atom-quote>
 */
class AgAtomQuote extends LitElement {
  static styles = styles;

  render() {
    return html`
      <blockquote>
        <slot></slot>
        <slot name="cite"></slot>
      </blockquote>
    `;
  }
}

customElements.define('ag-atom-quote', AgAtomQuote);
