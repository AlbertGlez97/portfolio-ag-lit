import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styles } from './ag-organism-articles-board.styles.js';
import '../../atoms/ag-atom-chip/ag-atom-chip.js';
import '../../atoms/ag-atom-select/ag-atom-select.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../molecules/ag-molecule-search-box/ag-molecule-search-box.js';
import '../../molecules/ag-molecule-featured-card/ag-molecule-featured-card.js';
import '../../molecules/ag-molecule-article-card/ag-molecule-article-card.js';

function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * <ag-organism-articles-board> — Board del laboratorio standalone (/laboratorio).
 *
 * Contiene: filters bar (chips + search + sort), featured card opcional,
 * grid 2-columnas de article cards y empty state. El estado de filtros y
 * search es interno; los counts de cada chip se calculan desde `articles`.
 *
 * Atajo `/` global → focus del search box (via método público `focus()`
 * de `ag-molecule-search-box`). Se ignora si el foco ya está en un input
 * o textarea (checkeado via `composedPath`).
 *
 * Featured card: se detecta como `articles.find(a => a.featured && filtered)`
 * — es decir, el featured solo aparece si existe Y pasa el filtro/search
 * activo. El resto van al grid.
 *
 * Empty state cuando NADA (ni featured ni grid) matchea el filtro/query.
 *
 * El `id="laboratorio-board"` (o lo que corresponda) lo setea la page en
 * el host, no el organismo.
 *
 * @property {Array} articles - `[{ id, slug, category, categoryLabel, date, title, excerpt, featured, published_at, readTime, href?, featuredSvg?, vlabel? }]`
 * @property {Array<{id, label}>} filters - Filtros disponibles (incluido `{ id: 'all', label: 'Todos' }`).
 * @property {Array<{value, label}>} sortOptions - Opciones del select de sort.
 * @property {string} searchPlaceholder - Placeholder del search.
 * @property {string} sortLabel - Label "Ordenar:" antes del select.
 * @property {string} gridHeadTitle - Título del grid ("Todos los artículos").
 * @property {string} featuredBadgeLabel - Badge del featured card.
 * @property {string} emptyTitle - Título del empty state.
 * @property {string} emptyMessage - Mensaje del empty state.
 *
 * @example
 *   <ag-organism-articles-board
 *     .articles=${articles}
 *     .filters=${[
 *       { id: 'all',      label: 'Todos' },
 *       { id: 'threejs',  label: 'Three.js' },
 *       { id: 'ia',       label: 'IA' },
 *       { id: 'tutor',    label: 'Tutorial' },
 *       { id: 'backend',  label: 'Backend' },
 *     ]}
 *     .sortOptions=${[
 *       { value: 'recent', label: 'Más recientes' },
 *       { value: 'alpha',  label: 'Alfabético' },
 *     ]}
 *     searchPlaceholder="Buscar artículo..."
 *     sortLabel="Ordenar:"
 *     gridHeadTitle="Todos los artículos"
 *     featuredBadgeLabel="● Artículo destacado"
 *     emptyTitle="Sin resultados"
 *     emptyMessage="No hay artículos que coincidan con esa búsqueda o filtro."
 *   ></ag-organism-articles-board>
 */
class AgOrganismArticlesBoard extends LitElement {
  static properties = {
    articles: { type: Array },
    filters: { type: Array },
    sortOptions: { type: Array },
    searchPlaceholder: { type: String },
    sortLabel: { type: String },
    gridHeadTitle: { type: String },
    featuredBadgeLabel: { type: String },
    emptyTitle: { type: String },
    emptyMessage: { type: String },
    _activeFilter: { state: true },
    _query: { state: true },
    _sort: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.articles = [];
    this.filters = [];
    this.sortOptions = [];
    this.searchPlaceholder = 'Buscar artículo...';
    this.sortLabel = 'Ordenar:';
    this.gridHeadTitle = 'Todos los artículos';
    this.featuredBadgeLabel = '● Artículo destacado';
    this.emptyTitle = 'Sin resultados';
    this.emptyMessage = 'No hay artículos que coincidan con esa búsqueda o filtro.';
    this._activeFilter = 'all';
    this._query = '';
    this._sort = '';
    this._onGlobalKey = this._onGlobalKey.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onGlobalKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onGlobalKey);
  }

  /* ---------- Derived ---------- */

  _countFor(filterId) {
    if (filterId === 'all') return this.articles.length;
    return this.articles.filter((a) => a.category === filterId).length;
  }

  _getFiltered() {
    let list = this.articles.slice();

    if (this._activeFilter !== 'all') {
      list = list.filter((a) => a.category === this._activeFilter);
    }

    const q = this._query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        const title = (a.title || '').toLowerCase();
        const excerpt = (a.excerpt || '').toLowerCase();
        return title.includes(q) || excerpt.includes(q);
      });
    }

    const sort = this._sort || (this.sortOptions[0]?.value ?? 'recent');
    if (sort === 'recent') {
      list.sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''));
    } else if (sort === 'alpha') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }

  /* ---------- Handlers ---------- */

  _onFilterSelect(e) {
    const chip = e.target;
    const id = chip.dataset?.filterId;
    if (id) this._activeFilter = id;
  }

  _onSearchInput(e) {
    this._query = e.detail.value;
  }

  _onSortChange(e) {
    this._sort = e.detail.value;
  }

  _onGlobalKey(e) {
    if (e.key !== '/') return;
    const path = e.composedPath();
    const inInput = path.some((el) => {
      const t = el.tagName?.toLowerCase();
      return t === 'input' || t === 'textarea';
    });
    if (inInput) return;
    e.preventDefault();
    const searchBox = this.renderRoot?.querySelector('ag-molecule-search-box');
    searchBox?.focus();
  }

  /* ---------- Render ---------- */

  render() {
    const filtered = this._getFiltered();
    const featured = filtered.find((a) => a.featured);
    const grid = filtered.filter((a) => !a.featured);
    const noResults = filtered.length === 0;

    return html`
      <div class="wrap">
        <div class="top-bar">
          <div class="filters" @ag-chip-select=${this._onFilterSelect}>
            ${this.filters.map(
              (f) => html`
                <ag-atom-chip
                  variant="filter"
                  data-filter-id=${f.id}
                  ?active=${this._activeFilter === f.id}
                  count=${this._countFor(f.id)}
                >${f.label}</ag-atom-chip>
              `
            )}
          </div>
          <div class="right">
            <ag-molecule-search-box
              placeholder=${this.searchPlaceholder}
              .value=${this._query}
              @ag-input=${this._onSearchInput}
            ></ag-molecule-search-box>
            ${this.sortOptions.length
              ? html`
                  <div class="sort">
                    <span>${this.sortLabel}</span>
                    <ag-atom-select
                      .options=${this.sortOptions}
                      .value=${this._sort || this.sortOptions[0].value}
                      @ag-change=${this._onSortChange}
                    ></ag-atom-select>
                  </div>
                `
              : ''}
          </div>
        </div>

        ${featured ? this._renderFeatured(featured) : ''}

        ${grid.length > 0
          ? html`
              <div class="grid-head">
                <ag-atom-heading
                  level="3"
                  variant="card-sm"
                  style="--ag-heading-size: 1.375rem"
                >${this.gridHeadTitle}</ag-atom-heading>
                <ag-atom-text variant="meta">${pad2(grid.length)} de ${pad2(this.articles.length)}</ag-atom-text>
              </div>
              <div class="grid">
                ${grid.map(
                  (a) => html`
                    <ag-molecule-article-card
                      category=${a.category || ''}
                      categoryLabel=${a.categoryLabel || ''}
                      date=${a.date || ''}
                      title=${a.title || ''}
                      excerpt=${a.excerpt || ''}
                      readTime=${a.readTime || ''}
                      href=${a.href || (a.slug ? `/laboratorio/${a.slug}` : '')}
                    ></ag-molecule-article-card>
                  `
                )}
              </div>
            `
          : ''}

        ${noResults
          ? html`
              <div class="empty">
                <ag-atom-heading
                  level="3"
                  variant="card-sm"
                  style="--ag-heading-size: 1.375rem"
                >${this.emptyTitle}</ag-atom-heading>
                <ag-atom-text variant="body">${this.emptyMessage}</ag-atom-text>
              </div>
            `
          : ''}
      </div>
    `;
  }

  _renderFeatured(featured) {
    return html`
      <ag-molecule-featured-card
        badgeLabel=${this.featuredBadgeLabel}
        category=${featured.category || ''}
        categoryLabel=${featured.categoryLabel || ''}
        date=${featured.date || ''}
        readTime=${featured.readTime || ''}
        title=${featured.title || ''}
        excerpt=${featured.excerpt || ''}
        vlabel=${featured.vlabel || ''}
        href=${featured.href || (featured.slug ? `/laboratorio/${featured.slug}` : '')}
      >
        ${featured.featuredSvg
          ? html`<div slot="visual" style="width:100%;height:100%;display:block">${unsafeHTML(featured.featuredSvg)}</div>`
          : ''}
      </ag-molecule-featured-card>
    `;
  }
}

customElements.define('ag-organism-articles-board', AgOrganismArticlesBoard);
