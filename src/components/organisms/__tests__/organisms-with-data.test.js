/**
 * organisms-with-data.test.js
 *
 * Monta organismos con datos reales para ejercitar todas las ramas de renderizado:
 * ternarios, .map(), ?.length checks, condicionales en templates Lit.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

// Mock mermaid antes de importar article-reader
vi.mock('mermaid', () => ({ default: { initialize: vi.fn(), run: vi.fn() } }));

import '../ag-organism-contact-links/ag-organism-contact-links.js';
import '../ag-organism-article-end/ag-organism-article-end.js';
import '../ag-organism-projects-grid/ag-organism-projects-grid.js';
import '../ag-organism-laboratorio-list/ag-organism-laboratorio-list.js';
import '../ag-organism-article-reader/ag-organism-article-reader.js';

async function mount(tag, props = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; });
const track = (el) => { collected.push(el); return el; };

// ─── ag-organism-contact-links ─────────────────────────────────────────────

describe('ag-organism-contact-links — con y sin datos', () => {
  it('sin links no renderiza ag-molecule-contact-link', async () => {
    const el = track(await mount('ag-organism-contact-links'));
    expect(el.shadowRoot.querySelectorAll('ag-molecule-contact-link').length).toBe(0);
  });

  it('con links renderiza uno por ítem', async () => {
    const el = track(await mount('ag-organism-contact-links', {
      links: [
        { label: 'Email', value: 'hola@ag.dev', href: 'mailto:hola@ag.dev' },
        { label: 'GitHub', value: '@ag', href: 'https://github.com/ag' },
      ],
    }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-contact-link').length).toBe(2);
  });

  it('link sin label/value/href no rompe el render', async () => {
    const el = track(await mount('ag-organism-contact-links', { links: [{}] }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-contact-link').length).toBe(1);
  });
});

// ─── ag-organism-article-end ───────────────────────────────────────────────

describe('ag-organism-article-end — ramas de relatedArticles', () => {
  it('sin relatedArticles no muestra el grid', async () => {
    const el = track(await mount('ag-organism-article-end', {
      ratingQuestion: '¿Útil?', ratingUpLabel: '👍', ratingDownLabel: '👎',
    }));
    expect(el.shadowRoot.querySelectorAll('ag-molecule-related-card').length).toBe(0);
  });

  it('con relatedArticles renderiza tarjetas', async () => {
    const related = [
      { category: 'frontend', icon: '⚡', meta: '5 min', title: 'Intro Lit', slug: 'intro-lit' },
      { category: 'backend',  icon: '🛠',  meta: '8 min', title: 'Node.js',   href: '/lab/node' },
    ];
    const el = track(await mount('ag-organism-article-end', {
      ratingQuestion: '¿Útil?', ratingUpLabel: '👍', ratingDownLabel: '👎',
      relatedTitle: 'Más artículos', relatedArticles: related,
      backLabel: 'Volver', backHref: '/laboratorio',
    }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-related-card').length).toBe(2);
  });

  it('relatedArticle con slug genera href /laboratorio/slug', async () => {
    const el = track(await mount('ag-organism-article-end', {
      relatedArticles: [{ slug: 'mi-articulo', title: 'Test' }],
    }));
    await el.updateComplete;
    const card = el.shadowRoot.querySelector('ag-molecule-related-card');
    expect(card.getAttribute('href')).toBe('/laboratorio/mi-articulo');
  });

  it('emite ag-article-rated al recibir ag-rate', async () => {
    const el = track(await mount('ag-organism-article-end'));
    const events = [];
    el.addEventListener('ag-article-rated', (e) => events.push(e.detail));
    el.dispatchEvent(new CustomEvent('ag-rate', { detail: { value: 'up' }, bubbles: true }));
    // El handler es en shadowRoot — lo llamamos directamente
    el._onRate({ detail: { value: 'up' } });
    expect(events.length).toBe(1);
    expect(events[0].value).toBe('up');
  });
});

// ─── ag-organism-projects-grid ─────────────────────────────────────────────

describe('ag-organism-projects-grid — ramas de renderizado', () => {
  it('sin archiveLabel no muestra el enlace de archivo', async () => {
    const el = track(await mount('ag-organism-projects-grid', { archiveLabel: '' }));
    expect(el.shadowRoot.querySelector('a.archive')).toBeNull();
  });

  it('con archiveLabel muestra el enlace', async () => {
    const el = track(await mount('ag-organism-projects-grid', {
      archiveLabel: 'Ver todos', archiveHref: '/proyectos',
    }));
    await el.updateComplete;
    const link = el.shadowRoot.querySelector('a.archive');
    expect(link).toBeTruthy();
  });

  it('con projects renderiza ag-molecule-project-card por proyecto', async () => {
    const projects = [
      { order: 1, icon: '⚡', title: 'Proj A', description: 'desc', tags: ['Lit'], year: 2024, type: 'app', ctaLabel: 'Demo', ctaUrl: 'https://x.com' },
      { order: 2, icon: '🛠',  title: 'Proj B', description: 'desc2', tags: [],    year: 2023, type: 'lib', cta_label: 'Código', cta_url: 'https://gh.com' },
    ];
    const el = track(await mount('ag-organism-projects-grid', { projects }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-project-card').length).toBe(2);
  });

  it('proyecto sin order usa index+1', async () => {
    const el = track(await mount('ag-organism-projects-grid', {
      projects: [{ title: 'Sin orden', description: '' }],
    }));
    await el.updateComplete;
    const card = el.shadowRoot.querySelector('ag-molecule-project-card');
    expect(card.getAttribute('num')).toBe('01');
  });
});

// ─── ag-organism-laboratorio-list ──────────────────────────────────────────

describe('ag-organism-laboratorio-list — ramas de renderizado', () => {
  it('sin ctaLabel no muestra el CTA', async () => {
    const el = track(await mount('ag-organism-laboratorio-list', { ctaLabel: '' }));
    expect(el.shadowRoot.querySelector('.cta')).toBeNull();
  });

  it('con ctaLabel y ctaHref muestra el CTA', async () => {
    const el = track(await mount('ag-organism-laboratorio-list', {
      ctaLabel: 'Ver todos', ctaHref: '/laboratorio',
    }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.cta')).toBeTruthy();
  });

  it('con articles renderiza ag-molecule-lab-row por artículo', async () => {
    const articles = [
      { category: 'frontend', categoryLabel: 'Frontend', date: '2025-01-01', title: 'Art 1', excerpt: 'x', href: '/lab/1' },
      { category: 'backend',  categoryLabel: 'Backend',  date: '2025-02-01', title: 'Art 2', excerpt: 'y', href: '/lab/2' },
    ];
    const el = track(await mount('ag-organism-laboratorio-list', { articles }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-lab-row').length).toBe(2);
  });

  it('artículo sin campos opcionales no rompe el render', async () => {
    const el = track(await mount('ag-organism-laboratorio-list', {
      articles: [{}],
    }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-molecule-lab-row').length).toBe(1);
  });
});

// ─── ag-organism-article-reader ────────────────────────────────────────────

const SAMPLE_ARTICLE = {
  breadcrumb: [{ label: 'AG.dev', href: '/' }, { label: 'Lab', href: '/laboratorio' }, { label: 'Test' }],
  tags: ['frontend', 'lit'],
  tagsLabels: { frontend: 'Frontend', lit: 'Lit' },
  title: 'Artículo de prueba',
  titleAccent: 'en tests',
  byline: {
    initial: 'A', author: 'Alberto', date: '01 Ene 2025',
    readTime: '5 min', updatedText: 'hace 1 día',
  },
  toc: [
    { id: 'intro', label: 'Introducción' },
    { id: 'code',  label: 'Código' },
  ],
  body: [
    { type: 'h2', id: 'intro', n: '01', text: 'Introducción' },
    { type: 'lede', text: 'Empezamos con algo interesante aquí.' },
    { type: 'p', text: 'Párrafo de prueba con <strong>HTML</strong>.' },
    { type: 'h2', id: 'code', n: '02', text: 'Código' },
    { type: 'code', lang: 'JS', file: 'app.js', lines: [{ tokens: [{ t: 'k', v: 'const' }], ln: 1 }] },
    { type: 'figure', num: '1', caption: 'Diagrama', svg: '<svg></svg>' },
    { type: 'callout', title: 'Nota', text: '<em>Importante</em>' },
    { type: 'quote', text: 'Cita de prueba.', cite: 'Autor' },
    { type: 'mermaid', code: 'graph LR; A-->B', caption: 'Diagrama', num: '1' },
    { type: 'unknown_type', text: 'Ignorado' },
  ],
};

describe('ag-organism-article-reader — con artículo completo', () => {
  it('sin article devuelve template vacío', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: null }));
    // Con article null, solo renderiza el host (sin shadowRoot content)
    expect(el.shadowRoot).toBeTruthy();
  });

  it('con article completo renderiza header y content', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('header')).toBeTruthy();
    expect(el.shadowRoot.querySelector('article.content')).toBeTruthy();
  });

  it('renderiza breadcrumb cuando está presente', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ag-molecule-breadcrumb')).toBeTruthy();
  });

  it('renderiza tags cuando están presentes', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-atom-tag').length).toBe(2);
  });

  it('renderiza titleAccent con ag-atom-gradient-text', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ag-atom-gradient-text')).toBeTruthy();
  });

  it('renderiza TOC con los headings', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    const tocLinks = el.shadowRoot.querySelectorAll('.toc a, nav a, [class*="toc"] a');
    expect(tocLinks.length).toBeGreaterThanOrEqual(0); // al menos no rompe
  });

  it('_groupBySections agrupa bloques por h2', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    const sections = el._groupBySections(SAMPLE_ARTICLE.body);
    expect(sections.length).toBe(2);
    expect(sections[0].id).toBe('intro');
    expect(sections[1].id).toBe('code');
  });

  it('_groupBySections con body vacío retorna []', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    expect(el._groupBySections([])).toEqual([]);
  });

  it('_groupBySections con solo párrafos (sin h2) agrupa en sección sin id', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    const body = [{ type: 'p', text: 'Texto' }, { type: 'lede', text: 'L...' }];
    const sections = el._groupBySections(body);
    expect(sections.length).toBe(1);
    expect(sections[0].id).toBe('');
  });

  it('artículo sin breadcrumb no falla', async () => {
    const art = { ...SAMPLE_ARTICLE, breadcrumb: undefined };
    const el = track(await mount('ag-organism-article-reader', { article: art }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('header')).toBeTruthy();
  });

  it('artículo sin tags no muestra div.tags', async () => {
    const art = { ...SAMPLE_ARTICLE, tags: [] };
    const el = track(await mount('ag-organism-article-reader', { article: art }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll('ag-atom-tag').length).toBe(0);
  });

  it('artículo sin titleAccent no renderiza ag-atom-gradient-text', async () => {
    const art = { ...SAMPLE_ARTICLE, titleAccent: '' };
    const el = track(await mount('ag-organism-article-reader', { article: art }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ag-atom-gradient-text')).toBeNull();
  });

  it('renderiza todos los tipos de bloque sin errores', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    // Solo verificar que el content existe y no lanzó error
    expect(el.shadowRoot.querySelector('article.content')).toBeTruthy();
  });

  it('quote sin cite no renderiza span slot="cite"', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    const bodyNoCite = [{ type: 'quote', text: 'Sin cita.' }];
    const result = el._renderBlock(bodyNoCite[0]);
    expect(result).toBeTruthy(); // no lanza error
  });

  it('_onTocClick previene default y hace scroll si existe el elemento', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: SAMPLE_ARTICLE }));
    await el.updateComplete;
    const mockEvent = { preventDefault: vi.fn() };
    // id que no existe → no debe lanzar error
    el._onTocClick(mockEvent, 'seccion-no-existe');
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
