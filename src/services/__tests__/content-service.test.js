import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentService } from '../content.service.js';

// Mock del bundle de datos
vi.mock('../../data/index.js', () => ({
  default: {
    personal_info: { name: 'Alberto', location: 'CDMX', role: 'Dev' },
    stats: [{ label: 'años', value: 5 }],
    projects: [
      { title: 'B', order: 2 },
      { title: 'A', order: 1 },
      { title: 'C', order: 3 },
    ],
    articles: [
      { slug: 'primer-articulo', title: 'Primero', body: [] },
      { slug: 'segundo-articulo', title: 'Segundo', read_minutes: 3, body: [] },
    ],
    skills: [{ id: 'js', label: 'JavaScript', level: 8 }],
    social_links: [{ id: 'github', url: 'https://github.com/ag' }],
    contact: { email: 'ag@test.com' },
    terminal: {
      neofetch: { os: 'macOS' },
      stack_items: [{ label: 'Vite', value: '5' }],
      now_items: ['Trabajando en portafolio'],
      readme_content: 'Hola mundo',
    },
  },
}));

let svc;
beforeEach(() => {
  svc = new ContentService();
});

describe('ContentService — load() modo bundle', () => {
  it('resuelve data enriquecida', async () => {
    const data = await svc.load();
    expect(data).toHaveProperty('personal_info');
    expect(data.articles).toBeInstanceOf(Array);
  });

  it('agrega read_minutes a artículos que no lo tienen', async () => {
    const data = await svc.load();
    const art = data.articles.find((a) => a.slug === 'primer-articulo');
    expect(art.read_minutes).toBe(1); // body vacío → mínimo 1
  });

  it('no sobreescribe read_minutes si ya existe', async () => {
    const data = await svc.load();
    const art = data.articles.find((a) => a.slug === 'segundo-articulo');
    expect(art.read_minutes).toBe(3);
  });

  it('es idempotente — segunda llamada retorna misma referencia', async () => {
    const first = await svc.load();
    const second = await svc.load();
    expect(first).toBe(second);
  });
});

describe('ContentService — configure()', () => {
  it('lanza error si se llama después de load()', async () => {
    await svc.load();
    expect(() => svc.configure({ url: 'https://api.test' })).toThrow(
      '[content] configure() debe llamarse antes de load()',
    );
  });
});

describe('ContentService — load() modo API remota', () => {
  it('happy path — fetch mock resuelve data', async () => {
    const mockData = { articles: [], projects: [], personal_info: {} };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    svc.configure({ url: 'https://api.test/content' });
    const data = await svc.load();
    expect(data).toHaveProperty('articles');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/content',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
  });

  it('HTTP error — lanza con mensaje descriptivo', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    svc.configure({ url: 'https://api.test/content' });
    await expect(svc.load()).rejects.toThrow('content → HTTP 404');
  });

  it('limpia _inflight tras error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network fail'));
    svc.configure({ url: 'https://api.test/content' });
    await expect(svc.load()).rejects.toThrow('network fail');
    expect(svc._inflight).toBeNull();
  });
});

describe('ContentService — _require()', () => {
  it('lanza si no se llamó load()', () => {
    expect(() => svc.getProjects()).toThrow('[content] llama a load() primero');
  });
});

describe('ContentService — getters', () => {
  beforeEach(() => svc.load());

  it('getProjects() ordena por order ASC', async () => {
    await svc.load();
    const titles = svc.getProjects().map((p) => p.title);
    expect(titles).toEqual(['A', 'B', 'C']);
  });

  it('getArticleBySlug() retorna el artículo correcto', async () => {
    await svc.load();
    expect(svc.getArticleBySlug('primer-articulo').title).toBe('Primero');
  });

  it('getArticleBySlug() retorna null si no existe', async () => {
    await svc.load();
    expect(svc.getArticleBySlug('no-existe')).toBeNull();
  });

  it('getPersonalInfo() retorna la info personal', async () => {
    await svc.load();
    expect(svc.getPersonalInfo().name).toBe('Alberto');
  });

  it('getStats() retorna array', async () => {
    await svc.load();
    expect(svc.getStats()).toBeInstanceOf(Array);
  });

  it('getSkills() retorna array de skills', async () => {
    await svc.load();
    expect(svc.getSkills()[0].id).toBe('js');
  });

  it('getSocialLinks() retorna array de links', async () => {
    await svc.load();
    expect(svc.getSocialLinks()[0].id).toBe('github');
  });

  it('getContact() retorna objeto de contacto', async () => {
    await svc.load();
    expect(svc.getContact().email).toBe('ag@test.com');
  });

  it('getTerminal() retorna estructura completa', async () => {
    await svc.load();
    const t = svc.getTerminal();
    expect(t).toHaveProperty('neofetch');
    expect(t).toHaveProperty('stack_items');
    expect(t).toHaveProperty('now_items');
    expect(t).toHaveProperty('readme_content');
  });

  it('getArticles() retorna todos los artículos enriquecidos', async () => {
    await svc.load();
    expect(svc.getArticles()).toHaveLength(2);
  });
});
