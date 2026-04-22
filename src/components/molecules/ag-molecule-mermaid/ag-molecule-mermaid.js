import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styles } from './ag-molecule-mermaid.styles.js';

/**
 * Singleton loader — mermaid se inicializa una sola vez.
 */
let _mermaid = null;
let _mermaidPromise = null;

function loadMermaid() {
  if (_mermaid) return Promise.resolve(_mermaid);
  if (_mermaidPromise) return _mermaidPromise;

  _mermaidPromise = import('mermaid').then((mod) => {
    _mermaid = mod.default;
    _mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        fontSize: '13px',
        primaryColor: '#161b22',
        primaryTextColor: '#c9d1d9',
        primaryBorderColor: '#30363d',
        lineColor: '#8b949e',
        background: '#0d1117',
        mainBkg: '#161b22',
        nodeBorder: '#30363d',
        clusterBkg: '#161b22',
        titleColor: '#79c0ff',
        edgeLabelBackground: '#0d1117',
      },
      flowchart: { curve: 'basis', nodeSpacing: 30, rankSpacing: 40, padding: 12 },
    });
    return _mermaid;
  });

  return _mermaidPromise;
}

let _idCounter = 0;

/**
 * <ag-molecule-mermaid> — Renderiza un diagrama Mermaid dentro de Shadow DOM.
 *
 * Carga mermaid.js de forma lazy la primera vez que se usa. Usa la API
 * mermaid.render(id, code) que devuelve SVG como string — compatible con
 * Shadow DOM sin acceso directo al document.
 *
 * @property {string} code    - Código Mermaid (ej: "flowchart TD\n  A-->B")
 * @property {string} caption - Leyenda opcional debajo del diagrama.
 * @property {string} num     - Número de figura (ej: "1").
 */
class AgMoleculeMermaid extends LitElement {
  static properties = {
    code:     { type: String },
    caption:  { type: String },
    num:      { type: String },
    _svg:     { state: true },
    _error:   { state: true },
    _loading: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.code     = '';
    this.caption  = '';
    this.num      = '';
    this._svg     = '';
    this._error   = '';
    this._loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.code) this._renderDiagram();
  }

  updated(changed) {
    if (changed.has('code') && this.code) this._renderDiagram();
  }

  async _renderDiagram() {
    this._loading = true;
    this._error   = '';
    this._svg     = '';
    try {
      const mermaid = await loadMermaid();
      const id = `ag-mermaid-${++_idCounter}`;
      const { svg } = await mermaid.render(id, this.code);
      this._svg = svg;
    } catch (e) {
      this._error = e?.message ?? 'Error al renderizar el diagrama';
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <figure>
        <div class="diagram">
          ${this._loading ? html`<div class="loading">Cargando diagrama…</div>` : ''}
          ${this._error   ? html`<div class="error">⚠ ${this._error}</div>`    : ''}
          ${this._svg     ? unsafeHTML(this._svg)                               : ''}
        </div>
        ${this.caption ? html`
          <figcaption>
            ${this.num ? html`<span class="num">Fig. ${this.num} —</span>` : ''}
            ${this.caption}
          </figcaption>
        ` : ''}
      </figure>
    `;
  }
}

customElements.define('ag-molecule-mermaid', AgMoleculeMermaid);
