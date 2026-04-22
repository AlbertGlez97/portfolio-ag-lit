import { LitElement, html } from 'lit';
import { styles } from './ag-atom-text.styles.js';

/**
 * <ag-atom-text> — Texto con 5 variantes tipográficas.
 *
 * Elige el elemento semántico correcto según `variant`:
 *   - `lede` / `body` → `<p>` (párrafo de bloque)
 *   - `caption` / `meta` → `<span>` (inline)
 *   - `mono` → `<code>` (inline code dentro de párrafo)
 *
 * El átomo NO aplica drop-cap al lede — eso lo hace el organismo
 * `ag-organism-article-reader` sobre el primer párrafo del artículo
 * porque depende del contexto.
 *
 * @slot (default) Contenido del texto.
 *
 * @property {string} variant - `lede | body | hero-sub | caption | meta | mono`. Default `body`.
 *
 * @example
 *   <ag-atom-text variant="lede">Todo empezó con una pregunta...</ag-atom-text>
 *   <ag-atom-text variant="body">En este artículo vamos a construir...</ag-atom-text>
 *   <ag-atom-text variant="caption">Descomposición visual del fBm.</ag-atom-text>
 *   <ag-atom-text variant="meta">8 min de lectura</ag-atom-text>
 *   <ag-atom-text variant="mono">gl_Position</ag-atom-text>
 */
class AgAtomText extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.variant = 'body';
  }

  render() {
    switch (this.variant) {
      case 'lede':
      case 'body':
      case 'hero-sub':
        return html`<p><slot></slot></p>`;
      case 'mono':
        return html`<code><slot></slot></code>`;
      case 'caption':
      case 'meta':
      default:
        return html`<span><slot></slot></span>`;
    }
  }
}

customElements.define('ag-atom-text', AgAtomText);
