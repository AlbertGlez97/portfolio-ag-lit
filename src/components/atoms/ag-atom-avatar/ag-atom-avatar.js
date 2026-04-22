import { LitElement, html } from 'lit';
import { styles } from './ag-atom-avatar.styles.js';

/**
 * <ag-atom-avatar> — Avatar circular con gradient y letra central.
 *
 * Círculo 36×36 con fondo gradient cian→purple (ángulo 135°) y una letra
 * en display bold centrada en color fondo-base. Doble box-shadow que simula
 * un ring offset contra el fondo del sitio. Usado en el byline del artículo.
 *
 * @property {string} initial - Letra a mostrar. Default: `'A'`.
 *
 * @example
 *   <ag-atom-avatar initial="A"></ag-atom-avatar>
 */
class AgAtomAvatar extends LitElement {
  static properties = {
    initial: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.initial = 'A';
  }

  render() {
    return html`${this.initial}`;
  }
}

customElements.define('ag-atom-avatar', AgAtomAvatar);
