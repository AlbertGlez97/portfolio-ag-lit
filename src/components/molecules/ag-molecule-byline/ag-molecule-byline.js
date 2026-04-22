import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-byline.styles.js';
import '../../atoms/ag-atom-avatar/ag-atom-avatar.js';

/**
 * <ag-molecule-byline> — Firma del artículo.
 *
 * Avatar gradient + nombre del autor + metadata del artículo (fecha,
 * tiempo de lectura, último update). Los textos llegan ya localizados —
 * la molécula no formatea fechas ni tiempos.
 *
 * @property {string} initial - Inicial del avatar. Default `'A'`.
 * @property {string} author - Nombre del autor.
 * @property {string} date - Fecha ya formateada (ej: "12 Abr 2025").
 * @property {string} readTime - Texto completo (ej: "8 min de lectura").
 * @property {string} updated - Update info opcional (ej: "actualizado hace 3 días").
 *
 * @example
 *   <ag-molecule-byline
 *     author="Alberto González"
 *     date="12 Abr 2025"
 *     readTime="8 min de lectura"
 *     updated="actualizado hace 3 días"
 *   ></ag-molecule-byline>
 */
class AgMoleculeByline extends LitElement {
  static properties = {
    initial: { type: String },
    author: { type: String },
    date: { type: String },
    readTime: { type: String },
    updated: { type: String },
  };

  static styles = styles;

  constructor() {
    super();
    this.initial = 'A';
    this.author = '';
    this.date = '';
    this.readTime = '';
    this.updated = '';
  }

  render() {
    return html`
      <ag-atom-avatar initial=${this.initial}></ag-atom-avatar>
      <span class="author">${this.author}</span>
      <span class="bullet" aria-hidden="true">●</span>
      <span>${this.date}</span>
      <span class="bullet" aria-hidden="true">●</span>
      <span>${this.readTime}</span>
      ${this.updated
        ? html`
            <span class="bullet" aria-hidden="true">●</span>
            <span class="updated">${this.updated}</span>
          `
        : ''}
    `;
  }
}

customElements.define('ag-molecule-byline', AgMoleculeByline);
