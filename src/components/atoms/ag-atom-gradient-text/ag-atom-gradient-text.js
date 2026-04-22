import { LitElement, html } from 'lit';
import { styles } from './ag-atom-gradient-text.styles.js';

/**
 * <ag-atom-gradient-text> — Texto con gradient cian→purple aplicado al fill.
 *
 * Se usa para destacar palabras clave: "GONZÁLEZ" del hero, "próximo
 * proyecto" del contacto, "Laboratorio" del header del laboratorio. El
 * gradient proviene del token `--grad`.
 *
 * Se anida dentro de otro componente tipográfico (`ag-atom-heading`,
 * `ag-atom-text`, etc.) — NO lo uses como heading por sí solo, no tiene
 * semántica.
 *
 * @slot (default) Texto a pintar con el gradient.
 *
 * @example
 *   <ag-atom-heading level="1" variant="display">
 *     ALBERTO<br/>
 *     <ag-atom-gradient-text>GONZÁLEZ</ag-atom-gradient-text>
 *   </ag-atom-heading>
 *
 *   <ag-atom-heading level="2" variant="section">
 *     Hablemos de tu <ag-atom-gradient-text>próximo proyecto.</ag-atom-gradient-text>
 *   </ag-atom-heading>
 */
class AgAtomGradientText extends LitElement {
  static styles = styles;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('ag-atom-gradient-text', AgAtomGradientText);
