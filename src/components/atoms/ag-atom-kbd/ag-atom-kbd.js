import { LitElement, html } from 'lit';
import { styles } from './ag-atom-kbd.styles.js';

/**
 * <ag-atom-kbd> — Tecla o atajo de teclado.
 *
 * Caja pequeña con borde y color dim para representar teclas: `⌘K`, `/`,
 * `Esc`, etc. Se usa dentro del botón "Acceder al terminal" del hero y
 * dentro del search box del laboratorio.
 *
 * @slot (default) Tecla o atajo a mostrar.
 *
 * @example
 *   <ag-atom-kbd>⌘K</ag-atom-kbd>
 *   <ag-atom-kbd>/</ag-atom-kbd>
 */
class AgAtomKbd extends LitElement {
  static styles = styles;

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('ag-atom-kbd', AgAtomKbd);
