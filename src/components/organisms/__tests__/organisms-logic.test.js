import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import '../ag-organism-articles-board/ag-organism-articles-board.js';
import '../ag-organism-contact-form/ag-organism-contact-form.js';
import '../ag-organism-nav/ag-organism-nav.js';
import '../ag-organism-reading-progress/ag-organism-reading-progress.js';

async function mount(tag, props = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; vi.restoreAllMocks(); });
const track = (el) => { collected.push(el); return el; };

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ARTICLES = [
  { id: '1', slug: 'lit-intro', title: 'Intro a Lit', excerpt: 'Empezando con Lit', category: 'tutor', categoryLabel: 'Tutorial', tags: ['tutor'], published_at: '2025-04-01', date: '01 · ABR · 2025', readTime: '5 min', featured: true },
  { id: '2', slug: 'threejs-shaders', title: 'Shaders en Three.js', excerpt: 'Matemáticas del rendering', category: 'threejs', categoryLabel: 'Three.js', tags: ['threejs'], published_at: '2025-03-15', date: '15 · MAR · 2025', readTime: '8 min' },
  { id: '3', slug: 'langchain-embeddings', title: 'Embeddings con LangChain', excerpt: 'IA aplicada en producción', category: 'ia', categoryLabel: 'IA', tags: ['ia'], published_at: '2025-02-10', date: '10 · FEB · 2025', readTime: '10 min' },
  { id: '4', slug: 'alpha-article', title: 'Alpha Article', excerpt: 'Primer alfabéticamente', category: 'tutor', categoryLabel: 'Tutorial', tags: ['tutor'], published_at: '2025-01-01', date: '01 · ENE · 2025', readTime: '3 min' },
];

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'threejs', label: 'Three.js' },
  { id: 'ia', label: 'IA' },
  { id: 'tutor', label: 'Tutorial' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'alpha', label: 'Alfabético' },
];

// ─── ag-organism-articles-board ───────────────────────────────────────────────

describe('ag-organism-articles-board', () => {
  it('se monta con shadowRoot', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renderiza un chip por filtro', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const chips = el.shadowRoot.querySelectorAll('ag-atom-chip[variant="filter"]');
    expect(chips.length).toBe(FILTERS.length);
  });

  it('_countFor("all") retorna el total de artículos', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES }));
    expect(el._countFor('all')).toBe(4);
  });

  it('_countFor por categoría retorna el count correcto', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES }));
    expect(el._countFor('threejs')).toBe(1);
    expect(el._countFor('tutor')).toBe(2);
  });

  it('_getFiltered retorna todos con filtro "all"', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, sortOptions: SORT_OPTIONS }));
    expect(el._getFiltered().length).toBe(4);
  });

  it('_getFiltered filtra por categoría al cambiar _activeFilter', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, sortOptions: SORT_OPTIONS }));
    el._activeFilter = 'ia';
    expect(el._getFiltered().length).toBe(1);
    expect(el._getFiltered()[0].slug).toBe('langchain-embeddings');
  });

  it('_getFiltered filtra por búsqueda de texto', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, sortOptions: SORT_OPTIONS }));
    el._query = 'shaders';
    expect(el._getFiltered().length).toBe(1);
    expect(el._getFiltered()[0].slug).toBe('threejs-shaders');
  });

  it('_getFiltered ordena alfabéticamente con sort=alpha', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, sortOptions: SORT_OPTIONS }));
    el._sort = 'alpha';
    const titles = el._getFiltered().map((a) => a.title);
    expect(titles[0]).toBe('Alpha Article');
    expect(titles[1]).toBe('Embeddings con LangChain');
  });

  it('_getFiltered ordena por fecha reciente por defecto', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, sortOptions: SORT_OPTIONS }));
    el._sort = 'recent';
    const dates = el._getFiltered().map((a) => a.published_at);
    expect(dates[0]).toBe('2025-04-01');
  });

  it('muestra empty state cuando no hay resultados', async () => {
    const el = track(await mount('ag-organism-articles-board', {
      articles: ARTICLES, sortOptions: SORT_OPTIONS,
      emptyTitle: 'Sin resultados', emptyMessage: 'Nada coincide.',
    }));
    el._query = 'xyzimpossible';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.empty')).toBeTruthy();
  });

  it('tecla / hace focus en el search box', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS, sortOptions: SORT_OPTIONS }));
    const searchBox = el.shadowRoot.querySelector('ag-molecule-search-box');
    const spy = vi.spyOn(searchBox, 'focus');
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
    expect(spy).toHaveBeenCalled();
  });

  it('tecla / se ignora si el foco está en un input', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const searchBox = el.shadowRoot?.querySelector('ag-molecule-search-box');
    if (searchBox) {
      const spy = vi.spyOn(searchBox, 'focus');
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
      expect(spy).not.toHaveBeenCalled();
      input.remove();
    }
  });

  it('_onFilterSelect actualiza _activeFilter desde chip event', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const chip = el.shadowRoot.querySelector('ag-atom-chip[data-filter-id="threejs"]');
    chip.dispatchEvent(new CustomEvent('ag-chip-select', { bubbles: true }));
    expect(el._activeFilter).toBe('threejs');
  });

  it('_renderFeatured con article sin campos opcionales cubre ramas falsas', async () => {
    const minimal = [{ id: 'x', featured: true }];
    const el = track(await mount('ag-organism-articles-board', { articles: minimal }));
    // Con article sin category, title, etc, las ramas || '' son falsy (usan '')
    const card = el.shadowRoot.querySelector('ag-molecule-featured-card');
    expect(card).toBeTruthy();
  });

  it('_renderFeatured con article con href y featuredSvg cubre ramas truthy', async () => {
    const withHref = [{ id: 'y', featured: true, href: '/mi-articulo', featuredSvg: '<circle/>' }];
    const el = track(await mount('ag-organism-articles-board', { articles: withHref }));
    const card = el.shadowRoot.querySelector('ag-molecule-featured-card');
    expect(card).toBeTruthy();
    expect(card.getAttribute('href')).toBe('/mi-articulo');
  });
});

// ─── ag-organism-contact-form ─────────────────────────────────────────────────

describe('ag-organism-contact-form', () => {
  const PROPS = {
    nameLabel: 'Nombre', nameErrorMsg: 'Nombre requerido',
    emailLabel: 'Email', emailErrorMsg: 'Email inválido',
    messageLabel: 'Mensaje', messageErrorMsg: 'Mensaje muy corto',
    submitLabel: 'Enviar',
  };

  it('se monta y renderiza el formulario', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    expect(el.shadowRoot.querySelector('ag-atom-input')).toBeTruthy();
    expect(el.shadowRoot.querySelector('ag-atom-textarea')).toBeTruthy();
  });

  it('_validate retorna false con campos vacíos', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    expect(el._validate()).toBe(false);
  });

  it('_validate retorna true con campos válidos', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._name = 'Alberto';
    el._email = 'ag@test.com';
    el._message = 'Mensaje de prueba largo suficiente';
    expect(el._validate()).toBe(true);
  });

  it('_validate marca error en nombre vacío', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._name = '';
    el._email = 'ag@test.com';
    el._message = 'Mensaje largo suficiente para pasar';
    el._validate();
    expect(el._nameError).toBe(true);
  });

  it('_validate marca error en email inválido', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._name = 'Alberto';
    el._email = 'no-es-email';
    el._message = 'Mensaje largo suficiente para pasar';
    el._validate();
    expect(el._emailError).toBe(true);
  });

  it('_validate marca error en mensaje corto (<10 chars)', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._name = 'Alberto';
    el._email = 'ag@test.com';
    el._message = 'corto';
    el._validate();
    expect(el._messageError).toBe(true);
  });

  it('submit exitoso → status=success y emite ag-contact-submitted', async () => {
    const submitFn = vi.fn().mockResolvedValue(undefined);
    const el = track(await mount('ag-organism-contact-form', { ...PROPS, submitFn }));
    el._name = 'Alberto';
    el._email = 'ag@test.com';
    el._message = 'Mensaje de prueba largo suficiente';
    let detail = null;
    el.addEventListener('ag-contact-submitted', (e) => { detail = e.detail; });
    await el._handleSubmit();
    expect(el._status).toBe('success');
    expect(detail.name).toBe('Alberto');
    expect(detail.email).toBe('ag@test.com');
  });

  it('submit exitoso → renderiza estado success con nombre', async () => {
    const submitFn = vi.fn().mockResolvedValue(undefined);
    const el = track(await mount('ag-organism-contact-form', { ...PROPS, submitFn, successTitle: 'Enviado' }));
    el._name = 'Alberto González';
    el._email = 'ag@test.com';
    el._message = 'Mensaje de prueba largo suficiente';
    await el._handleSubmit();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.success')).toBeTruthy();
  });

  it('submit con error → status=network-error y muestra banner', async () => {
    const submitFn = vi.fn().mockRejectedValue(new Error('Fallo de red'));
    const el = track(await mount('ag-organism-contact-form', { ...PROPS, submitFn }));
    el._name = 'Alberto';
    el._email = 'ag@test.com';
    el._message = 'Mensaje de prueba largo suficiente';
    await el._handleSubmit();
    await el.updateComplete;
    expect(el._status).toBe('network-error');
    expect(el.shadowRoot.querySelector('.error-banner')).toBeTruthy();
  });

  it('_onNameInput actualiza _name y limpia error', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._nameError = true;
    el._onNameInput({ detail: { value: 'Nuevo Nombre' } });
    expect(el._name).toBe('Nuevo Nombre');
    expect(el._nameError).toBe(false);
  });

  it('no envía si ya está submitting', async () => {
    const submitFn = vi.fn().mockResolvedValue(undefined);
    const el = track(await mount('ag-organism-contact-form', { ...PROPS, submitFn }));
    el._status = 'submitting';
    el._name = 'Alberto';
    el._email = 'ag@test.com';
    el._message = 'Mensaje largo suficiente para pasar';
    await el._handleSubmit();
    expect(submitFn).not.toHaveBeenCalled();
  });

  it('_onNameInput sin error previo no falla (branch false de if)', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._nameError = false;
    el._onNameInput({ detail: { value: 'Carlos' } });
    expect(el._name).toBe('Carlos');
    expect(el._nameError).toBe(false); // no cambió
  });

  it('_onEmailInput limpia error si estaba activo', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._emailError = true;
    el._onEmailInput({ detail: { value: 'test@test.com' } });
    expect(el._email).toBe('test@test.com');
    expect(el._emailError).toBe(false);
  });

  it('_onEmailInput sin error previo no falla', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._emailError = false;
    el._onEmailInput({ detail: { value: 'otro@test.com' } });
    expect(el._email).toBe('otro@test.com');
  });

  it('_onMessageInput limpia error si estaba activo', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    el._messageError = true;
    el._onMessageInput({ detail: { value: 'Mensaje de prueba largo' } });
    expect(el._messageError).toBe(false);
  });

  it('_onClickSubmit ejecuta _handleSubmit', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    const spy = vi.fn();
    el._handleSubmit = spy;
    el._onClickSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('_defaultSubmit resuelve sin arrojar error', async () => {
    const el = track(await mount('ag-organism-contact-form', PROPS));
    // Verificar que _defaultSubmit existe y resuelve
    await expect(el._defaultSubmit({})).resolves.toBeUndefined();
  });
});

// ─── articles-board _onGlobalKey branches ─────────────────────────────────────

describe('ag-organism-articles-board — _onGlobalKey branches', () => {
  const ARTICLES = [
    { id: '1', slug: 'a', title: 'Título A', excerpt: 'ex', category: 'frontend', tags: ['lit'], published_at: '2025-01-01', read_minutes: 3, featured: false },
  ];
  const FILTERS = [{ id: 'all', label: 'Todos' }];

  it('_onGlobalKey con key != "/" retorna sin acción', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const e = new KeyboardEvent('keydown', { key: 'a', bubbles: true });
    expect(() => el._onGlobalKey(e)).not.toThrow();
  });

  it('_onGlobalKey con "/" fuera de input intenta hacer focus en search-box', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const searchBox = el.shadowRoot?.querySelector('ag-molecule-search-box');
    if (searchBox) {
      const focusSpy = vi.fn();
      searchBox.focus = focusSpy;
    }
    const e = { key: '/', composedPath: () => [el], preventDefault: vi.fn() };
    el._onGlobalKey(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('_onGlobalKey con "/" dentro de input no hace focus', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES, filters: FILTERS }));
    const input = document.createElement('input');
    const e = { key: '/', composedPath: () => [input, el], preventDefault: vi.fn() };
    el._onGlobalKey(e);
    expect(e.preventDefault).not.toHaveBeenCalled();
  });

  it('_onSearchInput actualiza _query', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES }));
    el._onSearchInput({ detail: { value: 'shader' } });
    expect(el._query).toBe('shader');
  });

  it('_onSortChange actualiza _sort', async () => {
    const el = track(await mount('ag-organism-articles-board', { articles: ARTICLES }));
    el._onSortChange({ detail: { value: 'date-asc' } });
    expect(el._sort).toBe('date-asc');
  });
});

// ─── ag-organism-nav ──────────────────────────────────────────────────────────

describe('ag-organism-nav', () => {
  const LINKS = [
    { href: '/#proyectos', sectionId: 'proyectos', idx: '01', label: 'Proyectos' },
    { href: '/laboratorio', sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
  ];

  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('setea role=navigation y aria-label en connectedCallback', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    expect(el.getAttribute('role')).toBe('navigation');
    expect(el.getAttribute('aria-label')).toBe('Principal');
  });

  it('renderiza un nav-link por cada entry en links', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    const navLinks = el.shadowRoot.querySelectorAll('ag-molecule-nav-link');
    expect(navLinks.length).toBe(2);
  });

  it('scrolled=true cuando scrollY > 16', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    el._onScroll();
    expect(el.scrolled).toBe(true);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('scrolled=false cuando scrollY <= 16', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    Object.defineProperty(window, 'scrollY', { value: 5, configurable: true });
    el._onScroll();
    expect(el.scrolled).toBe(false);
  });

  it('refreshObserver no falla con secciones inexistentes', async () => {
    const el = track(await mount('ag-organism-nav', { links: LINKS }));
    expect(() => el.refreshObserver()).not.toThrow();
  });
});

// ─── ag-organism-reading-progress ─────────────────────────────────────────────

describe('ag-organism-reading-progress', () => {
  it('se monta y renderiza .bar', async () => {
    const el = track(await mount('ag-organism-reading-progress'));
    expect(el.shadowRoot.querySelector('.bar')).toBeTruthy();
  });

  it('_updateBar setea scaleX a 0 cuando no hay scroll', async () => {
    const el = track(await mount('ag-organism-reading-progress'));
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    el._updateBar();
    const bar = el.shadowRoot.querySelector('.bar');
    expect(bar.style.transform).toBe('scaleX(0)');
  });

  it('_updateBar setea scaleX a 1 cuando está al final', async () => {
    const el = track(await mount('ag-organism-reading-progress'));
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 1200, configurable: true });
    el._updateBar();
    const bar = el.shadowRoot.querySelector('.bar');
    expect(bar.style.transform).toBe('scaleX(1)');
  });

  it('registra listener scroll en connectedCallback', async () => {
    const spy = vi.spyOn(window, 'addEventListener');
    const el = track(await mount('ag-organism-reading-progress'));
    expect(spy).toHaveBeenCalledWith('scroll', expect.any(Function), expect.any(Object));
  });
});
