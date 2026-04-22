import { LitElement, html } from 'lit';
import { styles } from './ag-organism-stats-strip.styles.js';
import '../../molecules/ag-molecule-stat/ag-molecule-stat.js';

/**
 * <ag-organism-stats-strip> — Barra de stats entre el hero y la sección de
 * proyectos.
 *
 * Bordes superior e inferior tenues (`var(--line)` 1px), padding vertical
 * 2.25rem (36px). Grid de 4 columnas en desktop que colapsa a 2 columnas
 * en ≤51.25rem (820px). El padding lateral del wrapper se reduce en ≤45rem.
 *
 * Los separadores verticales entre stats los dibuja cada `ag-molecule-stat`
 * con su `border-left`, y el primero no lo lleva (`:host(:first-child)`).
 *
 * @property {Array<{id, value, unit, label}>} stats - Entradas del strip.
 *
 * @example
 *   <ag-organism-stats-strip .stats=${[
 *     { id: 'years',     value: '5',  unit: '+',   label: 'Años de exp.' },
 *     { id: 'projects',  value: '20', unit: '+',   label: 'Proyectos entregados' },
 *     { id: 'curiosity', value: '∞',  unit: '',    label: 'Curiosidad' },
 *     { id: 'coffee',    value: '01', unit: '/h',  label: 'Cafés por hora' },
 *   ]}></ag-organism-stats-strip>
 */
class AgOrganismStatsStrip extends LitElement {
  static properties = {
    stats: { type: Array },
  };

  static styles = styles;

  constructor() {
    super();
    this.stats = [];
  }

  render() {
    return html`
      <div class="grid">
        ${this.stats.map(
          (s) => html`
            <ag-molecule-stat value=${s.value} unit=${s.unit}>${s.label}</ag-molecule-stat>
          `
        )}
      </div>
    `;
  }
}

customElements.define('ag-organism-stats-strip', AgOrganismStatsStrip);
