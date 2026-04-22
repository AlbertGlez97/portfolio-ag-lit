import { LitElement, html } from 'lit';
import { styles } from './ag-organism-footer.styles.js';

/**
 * <ag-organism-footer> — Footer del sitio.
 *
 * Barra inferior con borde-top tenue, padding vertical, y dos slots
 * (`left` / `right`) que el consumer compone típicamente con
 * `ag-atom-text variant="meta"`. El layout es flex con space-between,
 * colapsa a wrap en mobile.
 *
 * Aplica `role="contentinfo"` automáticamente en el host para cumplir
 * semántica de landmark footer.
 *
 * @slot left - Contenido izquierdo (típicamente el copyright).
 * @slot right - Contenido derecho (típicamente el tagline con acento cian).
 *
 * @example
 *   <ag-organism-footer>
 *     <ag-atom-text slot="left" variant="meta">
 *       Diseñado y construido por Alberto González — 2025
 *     </ag-atom-text>
 *     <ag-atom-text slot="right" variant="meta">
 *       Hecho con <span style="color: var(--cyan)">♥</span> y demasiado café
 *     </ag-atom-text>
 *   </ag-organism-footer>
 */
class AgOrganismFooter extends LitElement {
  static styles = styles;

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'contentinfo');
  }

  render() {
    return html`
      <div class="row">
        <slot name="left"></slot>
        <slot name="right"></slot>
      </div>
    `;
  }
}

customElements.define('ag-organism-footer', AgOrganismFooter);
