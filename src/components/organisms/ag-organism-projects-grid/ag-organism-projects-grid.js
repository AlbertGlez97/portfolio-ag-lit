import { LitElement, html } from 'lit';
import { styles } from './ag-organism-projects-grid.styles.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../molecules/ag-molecule-project-card/ag-molecule-project-card.js';

/**
 * <ag-organism-projects-grid> — Sección de proyectos del landing.
 *
 * Header con eyebrow + title a la izquierda y kicker + archive link a la
 * derecha. Grid de 3 columnas con `ag-molecule-project-card`, colapsa a
 * 2 columnas en ≤61.25rem (980px) y 1 columna en ≤43.75rem (700px) junto
 * con el header que pasa a stack vertical.
 *
 * El `id="proyectos"` lo debe setear el consumer en el host — el organismo
 * NO lo fuerza. Así el nav lo observa vía `document.getElementById` sin
 * acoplamiento.
 *
 * @property {string} eyebrowText - Eyebrow izquierdo.
 * @property {string} titleText - Título de sección.
 * @property {string} kickerText - Kicker derecho.
 * @property {string} archiveLabel - Texto del link al archive (opcional).
 * @property {string} archiveHref - URL del link al archive.
 * @property {Array} projects - `[{ id, order, icon, title, description, tags, year, type, ctaLabel, ctaUrl }]`.
 *
 * @example
 *   <ag-organism-projects-grid
 *     id="proyectos"
 *     eyebrowText="01 · Proyectos"
 *     titleText="Cosas que he construido."
 *     kickerText="Una selección de trabajo reciente en producto, IA aplicada y herramientas internas."
 *     archiveLabel="→ 20 más en el archivo"
 *     archiveHref="/proyectos"
 *     .projects=${projects}
 *   ></ag-organism-projects-grid>
 */
class AgOrganismProjectsGrid extends LitElement {
  static properties = {
    eyebrowText: { type: String },
    titleText: { type: String },
    kickerText: { type: String },
    archiveLabel: { type: String },
    archiveHref: { type: String },
    projects: { type: Array },
  };

  static styles = styles;

  constructor() {
    super();
    this.eyebrowText = '';
    this.titleText = '';
    this.kickerText = '';
    this.archiveLabel = '';
    this.archiveHref = '';
    this.projects = [];
  }

  render() {
    return html`
      <div class="wrap">
        <div class="head">
          <div class="head-left">
            <ag-atom-eyebrow>${this.eyebrowText}</ag-atom-eyebrow>
            <ag-atom-heading level="2" variant="section">${this.titleText}</ag-atom-heading>
          </div>
          <div class="head-right">
            <ag-atom-text variant="body">${this.kickerText}</ag-atom-text>
            ${this.archiveLabel
              ? html`
                  <a class="archive" href=${this.archiveHref}>
                    <ag-atom-text variant="meta" style="--ag-text-color: var(--cyan)">${this.archiveLabel}</ag-atom-text>
                  </a>
                `
              : ''}
          </div>
        </div>

        <div class="grid">
          ${this.projects.map(
            (p, i) => html`
              <ag-molecule-project-card
                num=${String(p.order ?? i + 1).padStart(2, '0')}
                icon=${p.icon || ''}
                title=${p.title || ''}
                description=${p.description || ''}
                .tags=${p.tags || []}
                meta=${[p.year, p.type].filter(Boolean).join(' · ')}
                ctaLabel=${p.ctaLabel || p.cta_label || ''}
                ctaUrl=${p.ctaUrl || p.cta_url || ''}
              ></ag-molecule-project-card>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('ag-organism-projects-grid', AgOrganismProjectsGrid);
