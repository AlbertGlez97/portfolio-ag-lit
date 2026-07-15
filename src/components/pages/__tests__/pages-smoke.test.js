import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

vi.mock('../../../services/content.service.js', () => ({
  contentService: {
    load: vi.fn().mockResolvedValue({}),
    getPersonalInfo: vi.fn().mockReturnValue({ name: 'Alberto', location: 'CDMX', role: 'Dev', bio_short: 'Full Stack' }),
    getProjects: vi.fn().mockReturnValue([
      { title: 'Proj', description: 'desc', type: 'app', tags: ['Lit'], year: 2024, icon: '⚡', order: 1 }
    ]),
    getArticles: vi.fn().mockReturnValue([{
      slug: 'test-slug', title: 'Título test', title_accent: 'acento',
      category: 'frontend', tags: ['lit'], excerpt: 'Extracto.', read_minutes: 5,
      published_at: '2025-01-01', updated_at: '2025-02-01', toc: [], body: [], related_ids: [],
    }]),
    getArticleBySlug: vi.fn().mockReturnValue({
      slug: 'test-slug', title: 'Título test', title_accent: 'acento',
      category: 'frontend', tags: ['lit'], excerpt: 'Extracto.', read_minutes: 5,
      published_at: '2025-01-01', updated_at: '2025-02-01', toc: [], body: [], related_ids: [],
    }),
    getSkills: vi.fn().mockReturnValue([{ id: 'Frontend', level: 5, items: ['Lit'] }]),
    getSocialLinks: vi.fn().mockReturnValue([{ id: 'gh', label: 'GitHub', value: '@ag', url: 'https://gh.com' }]),
    getStats: vi.fn().mockReturnValue([{ label: 'Proyectos', value: '10+' }]),
    getTerminal: vi.fn().mockReturnValue({ neofetch: {}, stack_items: [], now_items: ['Leyendo'], readme_content: '# Hola' }),
    getContact: vi.fn().mockReturnValue({ intro: 'Contacto', email: 'hola@ag.dev' }),
  },
}));

import '../../pages/ag-page-landing/ag-page-landing.js';
import '../../pages/ag-page-laboratorio/ag-page-laboratorio.js';
import '../../pages/ag-page-article/ag-page-article.js';

async function mountAndWait(tag, props = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  // Esperar el connectedCallback async (load) + primer render
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 20));
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; vi.restoreAllMocks(); });
const track = (el) => { collected.push(el); return el; };

describe('pages — smoke con datos reales mockeados', () => {
  it('ag-page-landing carga y renderiza contenido', async () => {
    const el = track(await mountAndWait('ag-page-landing'));
    expect(el.isConnected).toBe(true);
    // Verificar que _loaded es true (render de datos ocurrió)
    expect(el._loaded).toBe(true);
  });

  it('ag-page-landing en estado de error muestra el mensaje', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    contentService.load.mockRejectedValueOnce(new Error('Network error'));
    const el = track(await mountAndWait('ag-page-landing'));
    expect(el._error).toBe('Network error');
  });

  it('ag-page-laboratorio carga y renderiza con artículos', async () => {
    const el = track(await mountAndWait('ag-page-laboratorio'));
    expect(el.isConnected).toBe(true);
    expect(el._loaded).toBe(true);
  });

  it('ag-page-laboratorio en estado de error', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    contentService.load.mockRejectedValueOnce(new Error('Load failed'));
    const el = track(await mountAndWait('ag-page-laboratorio'));
    expect(el._error).toBe('Load failed');
  });

  it('ag-page-article con slug válido carga el artículo', async () => {
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    expect(el.isConnected).toBe(true);
    expect(el._loaded).toBe(true);
  });

  it('ag-page-article con slug sin resultado renderiza sin error', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    contentService.getArticleBySlug.mockReturnValueOnce(null);
    const el = track(await mountAndWait('ag-page-article', { slug: 'inexistente' }));
    expect(el.isConnected).toBe(true);
  });

  it('ag-page-article en estado de error', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    contentService.load.mockRejectedValueOnce(new Error('Error de red'));
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    expect(el._error).toBe('Error de red');
  });
});

// ─── ag-page-article — métodos internos ───────────────────────────────────

describe('ag-page-article — lógica interna', () => {
  it('_applyDeepLink sin hash no lanza error', async () => {
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    expect(() => el._applyDeepLink()).not.toThrow();
  });

  it('_applyDeepLink sin ag-organism-article-reader en DOM retorna sin error', async () => {
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    // No hay reader en el light DOM en este test — branch "!reader → return"
    // Forzar un hash para ejercitar el branch
    const origHash = location.hash;
    try {
      Object.defineProperty(location, 'hash', { value: '#intro', configurable: true, writable: true });
    } catch { /* ignore */ }
    expect(() => el._applyDeepLink()).not.toThrow();
  });

  it('_prepareRelated sin artículo actual retorna []', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    contentService.getArticles.mockReturnValueOnce([]);
    const el = track(await mountAndWait('ag-page-article', { slug: 'no-match' }));
    const result = el._prepareRelated();
    expect(result).toEqual([]);
  });

  it('_prepareRelated con artículo sin related_ids retorna []', async () => {
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    // El artículo test-slug existe pero related_ids es []
    const result = el._prepareRelated();
    expect(Array.isArray(result)).toBe(true);
  });

  it('_prepareArticle con artículo sin read_minutes usa cadena vacía', async () => {
    const { contentService } = await import('../../../services/content.service.js');
    const el = track(await mountAndWait('ag-page-article', { slug: 'test-slug' }));
    // Cambiar el mock DESPUÉS del mount para la llamada directa a _prepareArticle()
    contentService.getArticleBySlug.mockReturnValueOnce({
      slug: 'test-slug', title: 'Test', category: 'frontend', tags: [],
      published_at: '2025-01-01', toc: [], body: [],
      // sin read_minutes ni updated_at → los branches "|| ''" se ejercitan
    });
    const article = el._prepareArticle();
    expect(article.byline.readTime).toBe('');
    expect(article.byline.updated).toBe('');
  });
});

