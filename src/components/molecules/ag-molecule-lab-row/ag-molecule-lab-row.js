import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-lab-row.styles.js';
import '../../atoms/ag-atom-tag/ag-atom-tag.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';

/**
 * <ag-molecule-lab-row> — Fila del listado "Laboratorio" en el landing.
 *
 * 4 columnas: tag de categoría (140px) · fecha mono (100px) · título + excerpt
 * (1fr) · flecha (auto). Hover: toda la fila se corre 14px a la derecha, aparece
 * una barra cian de 2px en el borde izquierdo y el título se pone cian.
 *
 * El row entero es un `<a>` — toda la fila es clickeable.
 *
 * @property {string} category - Categoría (`threejs | ia | tutor | backend`).
 * @property {string} categoryLabel - Label de la categoría (ej: "Three.js").
 * @property {string} date - Fecha mono ya formateada (ej: "12·ABR·2025").
 * @property {string} title - Título del artículo.
 * @property {string} excerpt - Excerpt corto.
 * @property {string} href - Ruta al artículo.
 *
 * @example
 *   <ag-molecule-lab-row
 *     category="threejs"
 *     categoryLabel="Three.js"
 *     date="12·ABR·2025"
 *     title="Shaders procedurales para terrenos infinitos"
 *     excerpt="Cómo combinar ruido fractal con LOD dinámico..."
 *     href="/laboratorio/shaders-procedurales"
 *   ></ag-molecule-lab-row>
 */
class AgMoleculeLabRow extends LitElement {
  static properties = {
    category: { type: String },
    categoryLabel: { type: String },
    date: { type: String },
    title: { type: String },
    excerpt: { type: String },
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.category = '';
    this.categoryLabel = '';
    this.date = '';
    this.title = '';
    this.excerpt = '';
    this.href = '';
  }

  render() {
    return html`
      <a href=${this.href}>
        <div class="tag-slot">
          <ag-atom-tag variant=${this.category}>${this.categoryLabel}</ag-atom-tag>
        </div>
        <span class="date">${this.date}</span>
        <div class="main">
          <ag-atom-heading level="3" variant="card-sm">${this.title}</ag-atom-heading>
          <ag-atom-text variant="body">${this.excerpt}</ag-atom-text>
        </div>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    `;
  }
}

customElements.define('ag-molecule-lab-row', AgMoleculeLabRow);
