import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-featured-card.styles.js';
import '../../atoms/ag-atom-tag/ag-atom-tag.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';

/**
 * <ag-molecule-featured-card> — Artículo destacado del laboratorio.
 *
 * Layout 2 columnas: visual izquierdo (SVG por slot) + contenido derecho
 * (meta + título `card-lg` + excerpt + CTA). Badge "destacado" flotando
 * arriba a la derecha. Border cyan→purple aparece en hover.
 *
 * @slot visual - Elemento SVG (o imagen) del lado izquierdo.
 *
 * @property {string} badgeLabel - Label del badge (ej: "● Artículo destacado").
 * @property {string} vlabel - Label bajo el visual (ej: "// fragment.glsl · fbm · 4 octaves").
 * @property {string} category - Variant del tag.
 * @property {string} categoryLabel - Label de la categoría.
 * @property {string} date - Fecha ya formateada.
 * @property {string} readTime - Texto (ej: "8 min de lectura").
 * @property {string} title - Título del artículo.
 * @property {string} excerpt - Excerpt largo.
 * @property {string} ctaLabel - Label del CTA. Default `'Leer artículo →'`.
 * @property {string} href - Ruta del artículo.
 *
 * @example
 *   <ag-molecule-featured-card
 *     badgeLabel="● Artículo destacado"
 *     category="threejs"
 *     categoryLabel="Three.js"
 *     date="12 · ABR · 2025"
 *     readTime="8 min de lectura"
 *     title="Shaders procedurales..."
 *     excerpt="..."
 *     href="/laboratorio/shaders"
 *   >
 *     <svg slot="visual" viewBox="0 0 600 420">...</svg>
 *   </ag-molecule-featured-card>
 */
class AgMoleculeFeaturedCard extends LitElement {
  static properties = {
    badgeLabel: { type: String },
    vlabel: { type: String },
    category: { type: String },
    categoryLabel: { type: String },
    date: { type: String },
    readTime: { type: String },
    title: { type: String },
    excerpt: { type: String },
    ctaLabel: { type: String },
    href: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.badgeLabel = '';
    this.vlabel = '';
    this.category = '';
    this.categoryLabel = '';
    this.date = '';
    this.readTime = '';
    this.title = '';
    this.excerpt = '';
    this.ctaLabel = 'Leer artículo →';
    this.href = '';
  }

  render() {
    return html`
      ${this.badgeLabel ? html`<div class="badge">${this.badgeLabel}</div>` : ''}
      <div class="wrap">
        <div class="visual">
          <slot name="visual"></slot>
          ${this.vlabel ? html`<div class="vlabel">${this.vlabel}</div>` : ''}
        </div>
        <div class="body">
          <div class="meta">
            <ag-atom-tag variant=${this.category}>${this.categoryLabel}</ag-atom-tag>
            <span class="date">${this.date}</span>
            <span class="read">${this.readTime}</span>
          </div>
          <ag-atom-heading level="2" variant="card-lg">${this.title}</ag-atom-heading>
          <ag-atom-text variant="body" class="excerpt">${this.excerpt}</ag-atom-text>
          <ag-atom-button variant="read" href=${this.href}>${this.ctaLabel}</ag-atom-button>
        </div>
      </div>
    `;
  }
}

customElements.define('ag-molecule-featured-card', AgMoleculeFeaturedCard);
