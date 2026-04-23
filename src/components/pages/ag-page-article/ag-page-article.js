import { LitElement, html } from 'lit';
import { contentService } from '../../../services/content.service.js';
import { formatDateDots, formatDateLong } from '../../../utils/format-date.js';
import { CATEGORY_LABELS } from '../../../data/categories.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../organisms/ag-organism-reading-progress/ag-organism-reading-progress.js';
import '../../organisms/ag-organism-nav/ag-organism-nav.js';
import '../../organisms/ag-organism-article-reader/ag-organism-article-reader.js';
import '../../organisms/ag-organism-article-end/ag-organism-article-end.js';
import '../../organisms/ag-organism-footer/ag-organism-footer.js';

const NAV_LINKS_REMOTE = [
  { href: '/#proyectos',  sectionId: 'proyectos',   idx: '01', label: 'Proyectos' },
  { href: '/laboratorio', sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
  { href: '/#terminal',   sectionId: 'terminal',    idx: '03', label: 'Terminal' },
  { href: '/#contacto',   sectionId: 'contacto',    idx: '04', label: 'Contacto', keep: true },
];

/**
 * <ag-page-article> — Page del artículo individual (ruta `/laboratorio/:slug`).
 *
 * El router le pasa `slug` como propiedad. La page busca el artículo en
 * `contentService`, prepara el objeto `article` completo (breadcrumb + byline
 * + toc + body) y lo pasa a `ag-organism-article-reader`. Los artículos
 * relacionados se resuelven desde `article.related_ids`.
 *
 * Deep-linking por URL hash: en `updated()` (tras primera render con datos),
 * lee `location.hash` y scrollea a la section correspondiente dentro del
 * shadow del reader. Esto cierra el pendiente documentado en `article-reader.md`.
 *
 * @property {string} slug - Slug del artículo, seteado por el router.
 */
class AgPageArticle extends LitElement {
  static properties = {
    slug: { type: String },
    _loaded: { state: true },
    _error: { state: true },
  };

  constructor() {
    super();
    this.slug = '';
    this._loaded = false;
    this._error = null;
    this._deepLinked = false;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      await contentService.load();
      this._loaded = true;
    } catch (err) {
      this._error = err?.message || String(err);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  updated() {
    if (this._loaded && location.hash && !this._deepLinked) {
      this._deepLinked = true;
      // Defer para que el article-reader termine de renderizar sus sections
      setTimeout(() => this._applyDeepLink(), 150);
    }
  }

  _applyDeepLink() {
    const id = location.hash.slice(1);
    if (!id) return;
    const reader = this.querySelector('ag-organism-article-reader');
    if (!reader) return;
    // Las sections viven en el shadow del reader — accedemos via shadowRoot
    const target = reader.shadowRoot?.querySelector(`#${CSS.escape(id)}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  _prepareArticle() {
    const raw = contentService.getArticleBySlug(this.slug);
    if (!raw) return null;
    const info = contentService.getPersonalInfo() || {};
    const categoryLabel = CATEGORY_LABELS[raw.category] || raw.category || '';
    const firstName = info.name ? info.name.trim().split(/\s+/)[0] : 'A';

    return {
      breadcrumb: [
        { label: 'AG.dev', href: '/' },
        { label: 'Laboratorio', href: '/laboratorio' },
        { label: categoryLabel },
      ],
      category: raw.category,
      categoryLabel,
      tags: raw.tags || [],
      tagsLabels: CATEGORY_LABELS,
      title: raw.title,
      titleAccent: raw.title_accent || '',
      byline: {
        initial: (firstName.charAt(0) || 'A').toUpperCase(),
        author: info.name || '',
        date: formatDateLong(raw.published_at),
        readTime: raw.read_minutes ? `${raw.read_minutes} min de lectura` : '',
        updated: raw.updated_at ? `actualizado ${formatDateLong(raw.updated_at)}` : '',
      },
      toc: raw.toc || [],
      body: raw.body || [],
    };
  }

  _prepareRelated() {
    const allArticles = contentService.getArticles();
    const current = allArticles.find((a) => a.slug === this.slug);
    if (!current) return [];
    const ids = current.related_ids || [];
    return ids
      .map((id) => allArticles.find((a) => a.id === id))
      .filter(Boolean)
      .map((a) => ({
        category: a.category,
        icon: '◐',
        meta: `${CATEGORY_LABELS[a.category] || a.category} · ${formatDateDots(a.published_at)}`,
        title: a.title,
        slug: a.slug,
      }));
  }

  render() {
    if (this._error) return html`<div class="ag-page-error">${this._error}</div>`;
    if (!this._loaded) return html`<div class="ag-page-loading">Cargando…</div>`;

    const article = this._prepareArticle();

    if (!article) {
      return html`
        <ag-organism-nav .links=${NAV_LINKS_REMOTE}></ag-organism-nav>
        <div class="ag-page-error" style="padding: 10rem 2rem">
          Artículo no encontrado: <strong>${this.slug}</strong>
        </div>
      `;
    }

    const related = this._prepareRelated();

    return html`
      <ag-organism-reading-progress></ag-organism-reading-progress>

      <ag-organism-nav .links=${NAV_LINKS_REMOTE}></ag-organism-nav>

      <ag-organism-article-reader
        .article=${article}
        tocLabel="En este artículo"
      ></ag-organism-article-reader>

      <div class="ag-page-wrap" style="padding-bottom: 5rem">
        <ag-organism-article-end
          ratingQuestion="¿Te resultó útil?"
          ratingUpLabel="Sí"
          ratingDownLabel="No"
          ratingUpCount="0"
          ratingDownCount="0"
          ratingThanksText="¡Gracias por el feedback!"
          relatedTitle="Artículos relacionados"
          .relatedArticles=${related}
          backLabel="← Volver al Laboratorio"
          backHref="/laboratorio"
        ></ag-organism-article-end>
      </div>

      <ag-organism-footer>
        <ag-atom-text slot="left" variant="meta">
          Diseñado y construido por Alberto González — ${new Date().getFullYear()}
        </ag-atom-text>
        <ag-atom-text slot="right" variant="meta">
          Hecho con <span style="color: var(--cyan)">♥</span> y demasiado café
        </ag-atom-text>
      </ag-organism-footer>
    `;
  }
}

customElements.define('ag-page-article', AgPageArticle);
