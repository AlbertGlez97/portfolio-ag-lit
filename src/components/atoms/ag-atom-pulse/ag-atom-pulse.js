import { LitElement, html } from 'lit';
import { styles } from './ag-atom-pulse.styles.js';

/**
 * <ag-atom-pulse> — Punto cian pulsante.
 *
 * Círculo 8×8 cian con un halo que se expande hasta 10px y se desvanece en
 * loop de 2s. Se usa en el hero-meta junto al texto "Disponible para proyectos".
 * Señal visual de estado activo / disponibilidad.
 *
 * @example
 *   <ag-atom-pulse></ag-atom-pulse> Disponible para proyectos
 */
class AgAtomPulse extends LitElement {
  static styles = styles;

  render() {
    return html``;
  }
}

customElements.define('ag-atom-pulse', AgAtomPulse);
