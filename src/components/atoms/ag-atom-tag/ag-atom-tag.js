import { LitElement, html } from 'lit';
import { styles } from './ag-atom-tag.styles.js';

/**
 * <ag-atom-tag> — Etiqueta de categoría o metadato.
 *
 * Átomo visual sin lógica. Se usa para marcar la categoría de un artículo
 * (threejs / ia / tutor / backend) y para mostrar el stack técnico de
 * proyectos y tarjetas (neutral). El texto viaja por slot — el átomo
 * solo aporta el styling del chip.
 *
 * El mapeo `category → variant` vive en `content.json` (campo
 * `article.category`). Los consumidores pasan ese valor directo a `variant`.
 *
 * @slot (default) Contenido textual del tag (ej: `Three.js`, `IA`, `Next.js`).
 *
 * @property {string} variant - Paleta de color. Valores: `neutral | threejs | ia | tutor | backend`.
 * @property {string} size - Tamaño del padding. Valores: `sm | md`. `md` se usa en el header del artículo.
 *
 * @example
 *   <ag-atom-tag variant="threejs">Three.js</ag-atom-tag>
 *   <ag-atom-tag variant="ia">IA</ag-atom-tag>
 *   <ag-atom-tag>Next.js</ag-atom-tag>
 *   <ag-atom-tag variant="threejs" size="md">Three.js</ag-atom-tag>
 */
class AgAtomTag extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.variant = 'neutral';
    this.size = 'sm';
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('ag-atom-tag', AgAtomTag);
