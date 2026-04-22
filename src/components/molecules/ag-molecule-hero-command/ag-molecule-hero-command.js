import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-hero-command.styles.js';
import '../../atoms/ag-atom-caret/ag-atom-caret.js';

/**
 * <ag-molecule-hero-command> — Caja mono del hero con typing loop.
 *
 * Renderiza un prompt cian (`~/alberto`), un `$`, el texto tipeado actual
 * y un caret. La molécula es presentacional — el loop de typing vive en
 * `ag-organism-hero` y actualiza la prop `typed` en cada frame.
 *
 * @property {string} prompt - Prompt izquierdo (ej: `"~/alberto"`).
 * @property {string} typed - Texto actualmente "tipeado".
 *
 * @example
 *   <ag-molecule-hero-command
 *     prompt="~/alberto"
 *     typed="npx create-portfolio@next --flavor=ai"
 *   ></ag-molecule-hero-command>
 */
class AgMoleculeHeroCommand extends LitElement {
  static properties = {
    prompt: { type: String },
    typed: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.prompt = '';
    this.typed = '';
  }

  render() {
    return html`
      <span class="prompt">${this.prompt}</span>
      <span class="dollar">$</span>
      <span class="typed">${this.typed}</span>
      <ag-atom-caret></ag-atom-caret>
    `;
  }
}

customElements.define('ag-molecule-hero-command', AgMoleculeHeroCommand);
