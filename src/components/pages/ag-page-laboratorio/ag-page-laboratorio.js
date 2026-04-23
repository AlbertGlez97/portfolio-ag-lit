import { LitElement, html } from 'lit';
import { contentService } from '../../../services/content.service.js';
import { formatDateDots } from '../../../utils/format-date.js';
import { CATEGORY_LABELS } from '../../../data/categories.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../atoms/ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../../molecules/ag-molecule-breadcrumb/ag-molecule-breadcrumb.js';
import '../../organisms/ag-organism-nav/ag-organism-nav.js';
import '../../organisms/ag-organism-articles-board/ag-organism-articles-board.js';
import '../../organisms/ag-organism-footer/ag-organism-footer.js';

const NAV_LINKS_REMOTE = [
  { href: '/#proyectos',  sectionId: 'proyectos',   idx: '01', label: 'Proyectos' },
  { href: '/laboratorio', sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
  { href: '/#terminal',   sectionId: 'terminal',    idx: '03', label: 'Terminal' },
  { href: '/#contacto',   sectionId: 'contacto',    idx: '04', label: 'Contacto', keep: true },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'alpha',  label: 'Alfabético' },
];

/**
 * <ag-page-laboratorio> — Page del laboratorio standalone (ruta `/laboratorio`).
 *
 * Page hero con breadcrumb + title + meta, y el board de artículos con
 * filtros/search/sort debajo. Usa NAV_LINKS_REMOTE porque los anchors de
 * las sections viven en la landing `/`.
 */
class AgPageLaboratorio extends LitElement {
  static properties = {
    _loaded: { state: true },
    _error: { state: true },
  };

  constructor() {
    super();
    this._loaded = false;
    this._error = null;
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

  render() {
    if (this._error) return html`<div class="ag-page-error">${this._error}</div>`;
    if (!this._loaded) return html`<div class="ag-page-loading">Cargando…</div>`;

    const articles = contentService.getArticles().map((a) => ({
      id: a.id,
      slug: a.slug,
      category: a.category,
      categoryLabel: CATEGORY_LABELS[a.category] || a.category,
      date: formatDateDots(a.published_at),
      published_at: a.published_at,
      title: a.title,
      excerpt: a.excerpt,
      readTime: a.read_minutes ? `${a.read_minutes} min de lectura` : '',
      featured: !!a.featured,
      featuredSvg: a.featured_svg || '',
      vlabel: a.vlabel || '',
      href: a.slug ? `/laboratorio/${a.slug}` : '',
    }));

    const breadcrumb = [
      { label: 'AG.dev', href: '/' },
      { label: 'Laboratorio' },
    ];
    const total = articles.length;

    const uniqueCategories = [...new Set(articles.map((a) => a.category))];
    const categoryChips = uniqueCategories
      .map((id) => ({ id, label: CATEGORY_LABELS[id] || id }))
      .sort((a, b) => a.label.localeCompare(b.label));
    const filters = [{ id: 'all', label: 'Todos' }, ...categoryChips];
    const categoryLabels = categoryChips.map((c) => c.label);

    return html`
      <ag-organism-nav .links=${NAV_LINKS_REMOTE}></ag-organism-nav>

      <header class="ag-page-lab-hero">
        <div class="ag-page-wrap">
          <ag-molecule-breadcrumb .items=${breadcrumb}></ag-molecule-breadcrumb>
          <div style="margin-top: 1.25rem">
            <ag-atom-eyebrow>02 · Notas del laboratorio</ag-atom-eyebrow>
          </div>
          <ag-atom-heading
            level="1"
            variant="display"
            style="--ag-heading-size: clamp(4rem, 10vw, 9rem); margin-top: 1.25rem"
          >
            El <ag-atom-gradient-text>Laboratorio</ag-atom-gradient-text>
          </ag-atom-heading>
          <div style="margin-top: 1.375rem">
            <ag-atom-text variant="meta">
              // ${total} ${total === 1 ? 'artículo' : 'artículos'}${categoryLabels.length ? ' · ' + categoryLabels.join(' · ') : ''}
            </ag-atom-text>
          </div>
        </div>
      </header>

      <ag-organism-articles-board
        .articles=${articles}
        .filters=${filters}
        .sortOptions=${SORT_OPTIONS}
        searchPlaceholder="Buscar artículo..."
        sortLabel="Ordenar:"
        gridHeadTitle="Todos los artículos"
        featuredBadgeLabel="● Artículo destacado"
        emptyTitle="Sin resultados"
        emptyMessage="No hay artículos que coincidan con esa búsqueda o filtro."
      ></ag-organism-articles-board>

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

customElements.define('ag-page-laboratorio', AgPageLaboratorio);
