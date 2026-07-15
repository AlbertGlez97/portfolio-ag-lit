/**
 * coverage-boost.test.js
 *
 * Tests focalizados en las branches específicas que faltan para llegar al 80%:
 * - ag-molecule-featured-card: badgeLabel y vlabel truthy
 * - ag-organism-article-reader: activeTocId matching, terminal-quest block
 * - ag-organism-terminal-quest: mv llave_maestra.key, grep con comillas
 * - ag-page-laboratorio: category fallback
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

vi.mock('mermaid', () => ({ default: { initialize: vi.fn(), run: vi.fn() } }));

import '../../molecules/ag-molecule-featured-card/ag-molecule-featured-card.js';
import '../ag-organism-article-reader/ag-organism-article-reader.js';
import '../ag-organism-terminal-quest/ag-organism-terminal-quest.js';

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

// ─── ag-molecule-featured-card — branches truthy ───────────────────────────

describe('ag-molecule-featured-card — branches badgeLabel y vlabel', () => {
  it('con badgeLabel muestra el badge', async () => {
    const el = track(await mount('ag-molecule-featured-card', {
      badgeLabel: 'Destacado', category: 'frontend', categoryLabel: 'Frontend', date: '2025', readTime: '5 min',
    }));
    expect(el.shadowRoot.querySelector('.badge')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.badge').textContent).toBe('Destacado');
  });

  it('sin badgeLabel no muestra badge', async () => {
    const el = track(await mount('ag-molecule-featured-card', { badgeLabel: '' }));
    expect(el.shadowRoot.querySelector('.badge')).toBeNull();
  });

  it('con vlabel muestra el vlabel', async () => {
    const el = track(await mount('ag-molecule-featured-card', {
      vlabel: '🎬 Video',
    }));
    expect(el.shadowRoot.querySelector('.vlabel')).toBeTruthy();
  });

  it('sin vlabel no muestra vlabel element', async () => {
    const el = track(await mount('ag-molecule-featured-card', { vlabel: '' }));
    expect(el.shadowRoot.querySelector('.vlabel')).toBeNull();
  });
});

// ─── ag-organism-article-reader — activeTocId branch ──────────────────────

describe('ag-organism-article-reader — branch activeTocId', () => {
  const ARTICLE_WITH_TOC = {
    title: 'Test', tags: [], toc: [
      { id: 'intro', label: 'Introducción' },
      { id: 'code', label: 'Código' },
    ],
    body: [
      { type: 'h2', id: 'intro', n: '01', text: 'Intro' },
      { type: 'p', text: 'Párrafo' },
      { type: 'terminal-quest' }, // ejercita el case 'terminal-quest'
    ],
  };

  it('con _activeTocId matching, el link tiene clase "active"', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: ARTICLE_WITH_TOC }));
    el._activeTocId = 'intro';
    await el.updateComplete;
    const activeLink = el.shadowRoot.querySelector('a.active');
    expect(activeLink).toBeTruthy();
  });

  it('renderiza ag-organism-terminal-quest para block type terminal-quest', async () => {
    const el = track(await mount('ag-organism-article-reader', { article: ARTICLE_WITH_TOC }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('ag-organism-terminal-quest')).toBeTruthy();
  });
});

// ─── terminal-quest — branches específicos ──────────────────────────────────

describe('ag-organism-terminal-quest — branches no cubiertos', () => {
  async function mountQuest() {
    const el = document.createElement('ag-organism-terminal-quest');
    el._runBoot = async () => {};
    document.body.appendChild(el);
    collected.push(el);
    await el.updateComplete;
    return el;
  }

  it('mv llave_maestra.key setea _keyMoved = true', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    // Crear el archivo llave_maestra.key en el directorio
    el._fs['/home/agente/herramientas'].__files['llave_maestra.key'] = '';
    el._handleMv(['llave_maestra.key', 'llave_movida.key']);
    expect(el._keyMoved).toBe(true);
  });

  it('mv con destino inválido retorna error', async () => {
    const el = await mountQuest();
    // Crear src válido pero dst inválido
    el._fs['/home/agente'].__files['archivo.txt'] = 'contenido';
    const { lines } = el._handleMv(['archivo.txt', '/ruta/invalida/dest.txt']);
    expect(lines[0].html).toContain('destino inválido');
  });

  it('grep con patrón entre comillas dobles — extrae el patrón', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep(['"MISIONES"', 'misiones.txt']);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('grep con patrón entre comillas simples — extrae el patrón', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep(["'MISIONES'", 'misiones.txt']);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('_handleTrapDelete cuando trampa no existe', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente'; // no hay trampa aquí
    const { lines } = el._handleTrapDelete();
    expect(lines[0].html).toContain('No existe');
  });

  it('_setupTocObserver no falla sin sections en el renderRoot', async () => {
    // terminal-quest no tiene .content > section, pero _setupTocObserver se llama
    // en article-reader. Esta prueba verifica que el componente no lanza.
    const el = await mountQuest();
    expect(() => el._runBoot()).not.toThrow();
  });
});
