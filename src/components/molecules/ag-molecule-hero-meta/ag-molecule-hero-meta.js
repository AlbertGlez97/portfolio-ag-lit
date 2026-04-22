import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-hero-meta.styles.js';
import '../../atoms/ag-atom-pulse/ag-atom-pulse.js';
import '../../atoms/ag-atom-divider/ag-atom-divider.js';

/**
 * <ag-molecule-hero-meta> — Línea superior del hero.
 *
 * Punto pulsante cian + texto de disponibilidad + divisor vertical + coords
 * en mayúsculas. El pulse y el divisor vienen de átomos.
 *
 * @property {string} availability - Texto de disponibilidad.
 * @property {string} coordinates - Coordenadas en formato libre.
 *
 * @example
 *   <ag-molecule-hero-meta
 *     availability="Disponible para proyectos · Q3 2025"
 *     coordinates="40.4168° N · 3.7038° W"
 *   ></ag-molecule-hero-meta>
 */
class AgMoleculeHeroMeta extends LitElement {
  static properties = {
    availability: { type: String },
    coordinates: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.availability = '';
    this.coordinates = '';
  }

  render() {
    return html`
      <ag-atom-pulse></ag-atom-pulse>
      <span>${this.availability}</span>
      <ag-atom-divider orientation="vertical"></ag-atom-divider>
      <span class="coord">${this.coordinates}</span>
    `;
  }
}

customElements.define('ag-molecule-hero-meta', AgMoleculeHeroMeta);
