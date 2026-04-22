/**
 * @file Router minimalista sobre History API.
 *
 * Mapea rutas a custom elements (páginas). Si el elemento está registrado
 * (`customElements.get(tag)`), lo instancia, le pasa los parámetros por
 * propiedad y lo coloca en el outlet con `slot="page"`. Si no está registrado,
 * renderiza un fallback inline ("Página en construcción"). Si la ruta no
 * coincide con ninguna, renderiza "Ruta no encontrada".
 *
 * Las páginas se registran importando su módulo — típicamente desde `main.js`
 * a medida que se van construyendo. El router no hace `import()` dinámico
 * porque Vite analiza esos imports estáticamente y falla si los archivos
 * no existen todavía.
 *
 * No soporta nested routes ni guards — un portafolio no los necesita.
 */

const ROUTES = [
  {
    pattern: /^\/$/,
    tag: 'ag-page-landing',
  },
  {
    pattern: /^\/laboratorio\/?$/,
    tag: 'ag-page-laboratorio',
  },
  {
    pattern: /^\/laboratorio\/([^/]+)\/?$/,
    tag: 'ag-page-article',
    params: (match) => ({ slug: match[1] }),
  },
];

/**
 * Router SPA.
 *
 * @example
 *   const router = new Router({ outlet: document.querySelector('ag-app') });
 *   router.start();
 *   router.navigate('/laboratorio');
 *
 * @fires ag-route-change — Sobre el outlet. Detail: `{ path, tag, params }`.
 */
export class Router {
  /**
   * @param {object} opts
   * @param {HTMLElement} opts.outlet Elemento padre donde se monta la página activa.
   */
  constructor({ outlet }) {
    this._outlet = outlet;
    this._current = null;
    this._onPop = () => this._resolve(location.pathname + location.hash);
    this._onClick = (e) => this._interceptClick(e);
  }

  start() {
    window.addEventListener('popstate', this._onPop);
    document.addEventListener('click', this._onClick);
    this._resolve(location.pathname + location.hash);
  }

  stop() {
    window.removeEventListener('popstate', this._onPop);
    document.removeEventListener('click', this._onClick);
    if (this._current) {
      this._current.remove();
      this._current = null;
    }
  }

  /**
   * Navega a una ruta interna sin recargar la página.
   * @param {string} path
   */
  navigate(path) {
    if (path === location.pathname + location.hash) return;
    history.pushState({}, '', path);
    this._resolve(path);
  }

  _interceptClick(e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const anchor = e.composedPath().find((n) => n.tagName === 'A');
    if (!anchor) return;
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download')) return;

    const href = anchor.getAttribute('href');
    if (!href) return;
    if (
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) return;

    e.preventDefault();
    this.navigate(href);
  }

  _resolve(fullPath) {
    const hashIdx = fullPath.indexOf('#');
    const path = (hashIdx >= 0 ? fullPath.slice(0, hashIdx) : fullPath) || '/';
    const hash = hashIdx >= 0 ? fullPath.slice(hashIdx + 1) : '';

    if (this._current) {
      this._current.remove();
      this._current = null;
    }

    const route = ROUTES.find((r) => r.pattern.test(path));
    if (!route) {
      this._renderFallback(path, 'Ruta no encontrada');
      return;
    }

    if (!customElements.get(route.tag)) {
      this._renderFallback(path, 'Página en construcción');
      return;
    }

    const match = path.match(route.pattern);
    const params = route.params ? route.params(match) : {};
    const el = document.createElement(route.tag);
    el.setAttribute('slot', 'page');
    for (const [k, v] of Object.entries(params)) el[k] = v;
    this._outlet.appendChild(el);
    this._current = el;

    if (hash) {
      setTimeout(() => {
        const target = document.getElementById(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }

    this._outlet.dispatchEvent(
      new CustomEvent('ag-route-change', {
        detail: { path, hash, tag: route.tag, params },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderFallback(path, message) {
    const el = document.createElement('div');
    el.setAttribute('slot', 'page');
    el.setAttribute('data-router-fallback', '');
    el.style.cssText = [
      'display:grid',
      'place-items:center',
      'min-height:100vh',
      'padding:48px 24px',
      'font-family:var(--mono)',
      'color:var(--fg-dim)',
      'text-align:center',
    ].join(';');
    el.innerHTML = `
      <div>
        <div style="font-family:var(--display);font-weight:600;font-size:32px;color:var(--fg);letter-spacing:-0.02em;margin-bottom:14px;">${message}</div>
        <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--fg-dimmer);">${path}</div>
      </div>
    `;
    this._outlet.appendChild(el);
    this._current = el;
  }
}
