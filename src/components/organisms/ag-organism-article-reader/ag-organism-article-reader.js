import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styles } from './ag-organism-article-reader.styles.js';
import '../../atoms/ag-atom-tag/ag-atom-tag.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../atoms/ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../../atoms/ag-atom-quote/ag-atom-quote.js';
import '../../molecules/ag-molecule-breadcrumb/ag-molecule-breadcrumb.js';
import '../../molecules/ag-molecule-byline/ag-molecule-byline.js';
import '../../molecules/ag-molecule-code-block/ag-molecule-code-block.js';
import '../../molecules/ag-molecule-figure/ag-molecule-figure.js';
import '../../molecules/ag-molecule-callout/ag-molecule-callout.js';
import '../../molecules/ag-molecule-mermaid/ag-molecule-mermaid.js';
import '../ag-organism-terminal-quest/ag-organism-terminal-quest.js';

/**
 * <ag-organism-article-reader> — Lector de artículo individual.
 *
 * Dos partes principales:
 *   1. Header: breadcrumb + tags + título (con gradient accent opcional)
 *      + byline + divider. Con grid overlay de fondo y mask radial.
 *   2. Layout TOC sticky + content. El content es un array de bloques
 *      tipados que se renderizan cada uno con su átomo/molécula.
 *
 * Tipos de bloque soportados en `article.body`:
 *   - `p`      → `ag-atom-text variant="body"` (texto puede ser HTML trusted)
 *   - `lede`   → `ag-atom-text variant="lede"` con drop-cap Fraunces en la inicial
 *   - `h2`     → `ag-atom-heading variant="article"` (dentro de `<section id>`)
 *   - `code`   → `ag-molecule-code-block`
 *   - `figure` → `ag-molecule-figure` con SVG vía unsafeHTML
 *   - `callout`→ `ag-molecule-callout` con texto via `ag-atom-text`
 *   - `quote`  → `ag-atom-quote`
 *   - `mermaid` → `ag-molecule-mermaid` (diagrama mermaid renderizado como SVG)
 *   - `terminal-quest` → `ag-organism-terminal-quest` (terminal interactiva embebida)
 *
 * El TOC se construye desde `article.toc` (ya precomputado en content.json).
 * El active item se detecta con IntersectionObserver sobre las `<section>`
 * del content (cada h2 abre una section nueva agrupando sus blocks). Click
 * en un TOC item hace scroll suave al section correspondiente.
 *
 * Texto de bloques `p`, `lede`, `callout`: se renderiza con `unsafeHTML`.
 * El contenido viene de content.json (trusted); puede incluir `<strong>`,
 * `<em>`, `<code>`, `<a>` inline.
 *
 * @property {object} article - Datos completos del artículo.
 * @property {string} tocLabel - Título del TOC. Default `'En este artículo'`.
 *
 * @example
 *   <ag-organism-article-reader
 *     .article=${{
 *       breadcrumb: [
 *         { label: 'AG.dev', href: '/' },
 *         { label: 'Laboratorio', href: '/laboratorio' },
 *         { label: 'Three.js' }
 *       ],
 *       tags: ['threejs', 'shaders'],
 *       tagsLabels: { threejs: 'Three.js', shaders: 'Shaders' },
 *       title: 'Shaders procedurales para terrenos infinitos que no colapsan la',
 *       titleAccent: 'GPU',
 *       byline: {
 *         initial: 'A', author: 'Alberto González',
 *         date: '12 Abr 2025', readTime: '8 min de lectura',
 *         updated: 'actualizado hace 3 días',
 *       },
 *       toc: [
 *         { id: 'intro', label: 'Introducción' },
 *         { id: 'fbm',   label: 'El algoritmo fBm' },
 *       ],
 *       body: [
 *         { type: 'h2', id: 'intro', n: '01', text: 'Introducción' },
 *         { type: 'lede', text: 'Todo empezó con...' },
 *         { type: 'p', text: 'En este artículo...' },
 *         { type: 'code', lang: 'GLSL', file: 'vertex.glsl', lines: [...] },
 *       ],
 *     }}
 *   ></ag-organism-article-reader>
 */
class AgOrganismArticleReader extends LitElement {
  static properties = {
    article: { type: Object },
    tocLabel: { type: String },
    _activeTocId: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.article = null;
    this.tocLabel = 'En este artículo';
    this._activeTocId = '';
    this._tocObserver = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tocObserver?.disconnect();
    this._tocObserver = null;
  }

  updated(changed) {
    if (changed.has('article') && this.article) {
      this._setupTocObserver();
    }
  }

  _setupTocObserver() {
    this._tocObserver?.disconnect();
    this._tocObserver = null;

    const sections = this.renderRoot?.querySelectorAll('.content > section');
    if (!sections || sections.length === 0) return;

    this._tocObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          this._activeTocId = visible[0].target.id;
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => this._tocObserver.observe(s));
  }

  _onTocClick(e, id) {
    e.preventDefault();
    const target = this.renderRoot?.querySelector(`#${CSS.escape(id)}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    if (!this.article) return html``;

    return html`
      ${this._renderHeader()}
      <main class="wrap layout">
        ${this._renderToc()}
        <article class="content">
          ${this._renderBody()}
        </article>
      </main>
    `;
  }

  _renderHeader() {
    const a = this.article;
    return html`
      <header class="wrap header">
        <div class="header-inner">
          ${a.breadcrumb?.length
            ? html`<ag-molecule-breadcrumb .items=${a.breadcrumb}></ag-molecule-breadcrumb>`
            : ''}
          ${a.tags?.length
            ? html`
                <div class="tags">
                  ${a.tags.map(
                    (t) => html`<ag-atom-tag variant=${t} size="md">${a.tagsLabels?.[t] || t}</ag-atom-tag>`
                  )}
                </div>
              `
            : ''}
          <ag-atom-heading
            level="1"
            variant="display"
            style="--ag-heading-size: clamp(2rem, 4vw, 3.25rem)"
          >
            ${a.title || ''}${a.titleAccent
              ? html` <ag-atom-gradient-text>${a.titleAccent}</ag-atom-gradient-text>`
              : ''}
          </ag-atom-heading>
          ${a.byline
            ? html`
                <ag-molecule-byline
                  initial=${a.byline.initial || 'A'}
                  author=${a.byline.author || ''}
                  date=${a.byline.date || ''}
                  readTime=${a.byline.readTime || ''}
                  updated=${a.byline.updated || ''}
                ></ag-molecule-byline>
              `
            : ''}
          <div class="divider" aria-hidden="true"></div>
        </div>
      </header>
    `;
  }

  _renderToc() {
    const items = this.article.toc || [];
    if (items.length === 0) return html`<div></div>`;
    return html`
      <aside class="toc" aria-label=${this.tocLabel}>
        <div class="toc-title">${this.tocLabel}</div>
        <ul class="toc-list">
          ${items.map(
            (item) => html`
              <li>
                <a
                  href="#${item.id}"
                  class=${this._activeTocId === item.id ? 'active' : ''}
                  @click=${(e) => this._onTocClick(e, item.id)}
                >${item.label}</a>
              </li>
            `
          )}
        </ul>
      </aside>
    `;
  }

  _renderBody() {
    const body = this.article.body || [];
    const sections = this._groupBySections(body);
    return sections.map(
      (s) => html`
        <section id=${s.id || ''}>
          ${s.blocks.map((b) => this._renderBlock(b))}
        </section>
      `
    );
  }

  /** Agrupa bloques en secciones: cada `h2` abre una sección nueva. */
  _groupBySections(body) {
    const out = [];
    let current = { id: '', blocks: [] };
    for (const block of body) {
      if (block.type === 'h2') {
        if (current.blocks.length) out.push(current);
        current = { id: block.id || '', blocks: [block] };
      } else {
        current.blocks.push(block);
      }
    }
    if (current.blocks.length) out.push(current);
    return out;
  }

  _renderBlock(block) {
    switch (block.type) {
      case 'h2':
        return html`
          <ag-atom-heading level="2" variant="article" num=${block.n || ''} id=${`h-${block.id || ''}`}>
            ${block.text || ''}
          </ag-atom-heading>
        `;
      case 'lede': {
        const text = block.text || '';
        const first = text.charAt(0);
        const rest = text.slice(1);
        return html`
          <ag-atom-text variant="lede">
            <span class="drop-cap">${first}</span>${unsafeHTML(rest)}
          </ag-atom-text>
        `;
      }
      case 'p':
        return html`<ag-atom-text variant="body">${unsafeHTML(block.text || '')}</ag-atom-text>`;
      case 'code':
        return html`
          <ag-molecule-code-block
            lang=${block.lang || ''}
            file=${block.file || ''}
            .lines=${block.lines || []}
          ></ag-molecule-code-block>
        `;
      case 'figure':
        return html`
          <ag-molecule-figure num=${block.num || ''} caption=${block.caption || ''}>
            ${block.svg ? unsafeHTML(block.svg) : ''}
          </ag-molecule-figure>
        `;
      case 'callout':
        return html`
          <ag-molecule-callout title=${block.title || ''}>
            <ag-atom-text variant="body">${unsafeHTML(block.text || '')}</ag-atom-text>
          </ag-molecule-callout>
        `;
      case 'quote':
        return html`
          <ag-atom-quote>
            ${unsafeHTML(block.text || '')}
            ${block.cite ? html`<span slot="cite">${block.cite}</span>` : ''}
          </ag-atom-quote>
        `;
      case 'mermaid':
        return html`
          <ag-molecule-mermaid
            code=${block.code || ''}
            caption=${block.caption || ''}
            num=${block.num || ''}
          ></ag-molecule-mermaid>
        `;
      case 'terminal-quest':
        return html`<ag-organism-terminal-quest></ag-organism-terminal-quest>`;
      default:
        return html``;
    }
  }
}

customElements.define('ag-organism-article-reader', AgOrganismArticleReader);
