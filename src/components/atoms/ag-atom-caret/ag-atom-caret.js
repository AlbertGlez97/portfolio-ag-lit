import { LitElement, html } from 'lit';
import { styles } from './ag-atom-caret.styles.js';

/**
 * <ag-atom-caret> — Cursor parpadeante cian.
 *
 * Dos variantes:
 *   - default (sin variant) — tamaño fijo 8×14px, para inputs mono y el hero command.
 *   - `hero` — tamaño relativo a la fuente (0.09em × 0.82em) para el `<h1>` del hero.
 *
 * Animación: `blink 1s steps(2) infinite` (parpadeo cuadrado, no suave).
 *
 * @property {string} variant - `hero` o vacío (default).
 *
 * @example
 *   <!-- En línea mono (hero command, terminal input) -->
 *   <ag-atom-caret></ag-atom-caret>
 *
 *   <!-- Dentro de un heading grande -->
 *   <h1>GONZÁLEZ<ag-atom-caret variant="hero"></ag-atom-caret></h1>
 */
class AgAtomCaret extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.variant = '';
  }

  render() {
    return html``;
  }
}

customElements.define('ag-atom-caret', AgAtomCaret);
