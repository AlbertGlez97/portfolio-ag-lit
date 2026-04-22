import { LitElement, html } from 'lit';
import { styles } from './ag-molecule-code-block.styles.js';

/**
 * <ag-molecule-code-block> — Bloque de código con head (lang + file), gutter
 * de line numbers y pre con el código.
 *
 * El botón "copiar" copia las líneas unidas con `\n` al clipboard y muestra
 * "copiado ✓" durante 1.5s. Emite también un evento.
 *
 * El highlighting de syntax NO se aplica en esta versión — las líneas se
 * renderizan como texto plano. Futuro: wrapper sobre Prism o shiki.
 *
 * @property {string} lang - Label del lenguaje (ej: "GLSL", "JAVASCRIPT").
 * @property {string} file - Nombre de archivo (ej: "vertex.glsl").
 * @property {Array<string>} lines - Array de líneas de código.
 * @property {string} copyLabel - Label del botón copiar. Default `'copiar'`.
 * @property {string} copiedLabel - Label post-copy. Default `'copiado ✓'`.
 *
 * @fires ag-code-copy - Al copiar exitosamente. Detail: `{ lang, file }`.
 *
 * @example
 *   <ag-molecule-code-block
 *     lang="GLSL"
 *     file="vertex.glsl"
 *     .lines=${["uniform float uTime;", "void main() {", "  gl_Position = ...", "}"]}
 *   ></ag-molecule-code-block>
 */
class AgMoleculeCodeBlock extends LitElement {
  static properties = {
    lang: { type: String },
    file: { type: String },
    lines: { type: Array },
    copyLabel: { type: String },
    copiedLabel: { type: String },
    _copied: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.lang = '';
    this.file = '';
    this.lines = [];
    this.copyLabel = 'copiar';
    this.copiedLabel = 'copiado ✓';
    this._copied = false;
  }

  render() {
    return html`
      <div class="head">
        <span>
          ${this.lang ? html`<span class="lang">${this.lang}</span> · ` : ''}${this.file}
        </span>
        <button
          class="copy ${this._copied ? 'copied' : ''}"
          type="button"
          @click=${this._onCopy}
        >
          ${this._copied ? this.copiedLabel : this.copyLabel}
        </button>
      </div>
      <div class="body">
        <div class="gutter" aria-hidden="true">
          ${this.lines.map((_, i) => html`<div>${i + 1}</div>`)}
        </div>
        <pre><code>${this.lines.join('\n')}</code></pre>
      </div>
    `;
  }

  async _onCopy() {
    const text = this.lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      this._copied = true;
      this.dispatchEvent(
        new CustomEvent('ag-code-copy', {
          detail: { lang: this.lang, file: this.file },
          bubbles: true,
          composed: true,
        })
      );
      setTimeout(() => {
        this._copied = false;
      }, 1500);
    } catch (_err) {
      // clipboard puede estar bloqueado (http, permisos, etc.)
    }
  }
}

customElements.define('ag-molecule-code-block', AgMoleculeCodeBlock);
