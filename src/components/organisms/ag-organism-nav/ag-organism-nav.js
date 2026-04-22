import { LitElement, html } from 'lit';
import { styles } from './ag-organism-nav.styles.js';
import '../../atoms/ag-atom-logo/ag-atom-logo.js';
import '../../molecules/ag-molecule-nav-link/ag-molecule-nav-link.js';

/**
 * <ag-organism-nav> — Nav principal del sitio.
 *
 * Fixed al top con backdrop blur, altura `--nav-h` (4.25rem / 68px).
 * Logo izquierda (siempre enlaza a `/`), links derecha. Cuando `scrollY > 16`
 * agrega atributo `scrolled` al host: aparece borde inferior y el background
 * se vuelve más opaco.
 *
 * Active link por IntersectionObserver sobre elementos con los `sectionId`
 * configurados en cada link. Los sections deben existir en el light DOM del
 * documento (`document.getElementById`). Si no están rendered al montar el
 * nav, se reintenta en el primer scroll. También se puede forzar refresh
 * con `refreshObserver()`.
 *
 * Responsive: los nav-links con `keep: false` se ocultan en viewports
 * ≤ 45rem (la molécula gestiona su propia visibility). El padding del
 * wrapper también se reduce en mobile.
 *
 * Cuando se navega entre páginas (ej: `/` → `/laboratorio`), el consumer
 * debería llamar `refreshObserver()` después del cambio para re-observar
 * los sections de la nueva página. Si la ruta no tiene ninguna de las
 * sections configuradas, ningún link queda activo (comportamiento esperado).
 *
 * @property {Array<{href, sectionId, idx, label, keep?}>} links - Entradas del nav.
 * @property {boolean} scrolled - Auto-gestionado por el scroll. NO setear manualmente.
 *
 * @example
 *   <ag-organism-nav .links=${[
 *     { href: '/#proyectos',   sectionId: 'proyectos',   idx: '01', label: 'Proyectos' },
 *     { href: '/laboratorio',  sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
 *     { href: '/#terminal',    sectionId: 'terminal',    idx: '03', label: 'Terminal' },
 *     { href: '/#contacto',    sectionId: 'contacto',    idx: '04', label: 'Contacto', keep: true },
 *   ]}></ag-organism-nav>
 */
class AgOrganismNav extends LitElement {
  static properties = {
    links: { type: Array },
    scrolled: { type: Boolean, reflect: true },
    _activeId: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.links = [];
    this.scrolled = false;
    this._activeId = '';
    this._io = null;
    this._hasObserved = false;
    this._onScroll = this._onScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation');
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Principal');
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    this._io?.disconnect();
    this._io = null;
  }

  updated(changed) {
    if (changed.has('links')) {
      this.refreshObserver();
    }
  }

  /**
   * Re-escanea el DOM buscando las secciones configuradas y (re)crea el
   * IntersectionObserver. Útil cuando las secciones se renderizan después
   * del nav o tras cambiar de página.
   */
  refreshObserver() {
    this._io?.disconnect();
    this._io = null;
    this._hasObserved = false;
    if (!this.links.length) return;

    const sections = this.links
      .filter((l) => l.sectionId)
      .map((l) => document.getElementById(l.sectionId))
      .filter(Boolean);
    if (!sections.length) return;

    this._io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          this._activeId = visible[0].target.id;
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => this._io.observe(s));
    this._hasObserved = true;
  }

  _onScroll() {
    this.scrolled = window.scrollY > 16;
    if (!this._hasObserved && this.links.length) {
      this.refreshObserver();
    }
  }

  render() {
    return html`
      <div class="inner">
        <ag-atom-logo href="/"></ag-atom-logo>
        <div class="links">
          ${this.links.map(
            (l) => html`
              <ag-molecule-nav-link
                href=${l.href}
                idx=${l.idx}
                ?active=${this._activeId === l.sectionId}
                ?keep=${l.keep}
              >${l.label}</ag-molecule-nav-link>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('ag-organism-nav', AgOrganismNav);
