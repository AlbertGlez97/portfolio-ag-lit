import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg id="mock">diagram</svg>' }),
  },
}));

import '../ag-molecule-search-box/ag-molecule-search-box.js';
import '../ag-molecule-code-block/ag-molecule-code-block.js';
import '../ag-molecule-rating/ag-molecule-rating.js';
import '../ag-molecule-breadcrumb/ag-molecule-breadcrumb.js';
import '../ag-molecule-form-field/ag-molecule-form-field.js';
import '../ag-molecule-mermaid/ag-molecule-mermaid.js';

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

// ─── ag-molecule-search-box ──────────────────────────────────────────────────

describe('ag-molecule-search-box', () => {
  it('renderiza un input de texto', async () => {
    const el = track(await mount('ag-molecule-search-box'));
    expect(el.shadowRoot.querySelector('input')).toBeTruthy();
  });

  it('aplica placeholder al input', async () => {
    const el = track(await mount('ag-molecule-search-box', { placeholder: 'Buscar...' }));
    expect(el.shadowRoot.querySelector('input').placeholder).toBe('Buscar...');
  });

  it('emite ag-input al escribir', async () => {
    const el = track(await mount('ag-molecule-search-box'));
    let detail = null;
    el.addEventListener('ag-input', (e) => { detail = e.detail; });
    const input = el.shadowRoot.querySelector('input');
    input.value = 'lit';
    input.dispatchEvent(new Event('input'));
    expect(detail).toEqual({ value: 'lit' });
  });

  it('muestra el kbdHint por defecto (/)', async () => {
    const el = track(await mount('ag-molecule-search-box'));
    expect(el.shadowRoot.querySelector('ag-atom-kbd')).toBeTruthy();
  });

  it('oculta kbd cuando kbdHint es vacío', async () => {
    const el = track(await mount('ag-molecule-search-box', { kbdHint: '' }));
    expect(el.shadowRoot.querySelector('ag-atom-kbd')).toBeNull();
  });

  it('focus() delega al input interno', async () => {
    const el = track(await mount('ag-molecule-search-box'));
    const input = el.shadowRoot.querySelector('input');
    const spy = vi.spyOn(input, 'focus');
    el.focus();
    expect(spy).toHaveBeenCalled();
  });
});

// ─── ag-molecule-code-block ──────────────────────────────────────────────────

describe('ag-molecule-code-block', () => {
  it('renderiza el código en un <pre><code>', async () => {
    const el = track(await mount('ag-molecule-code-block', { lines: ['const x = 1;', 'const y = 2;'] }));
    const code = el.shadowRoot.querySelector('pre code');
    expect(code.textContent).toContain('const x = 1;');
    expect(code.textContent).toContain('const y = 2;');
  });

  it('renderiza el lang y el file en el header', async () => {
    const el = track(await mount('ag-molecule-code-block', { lang: 'JS', file: 'app.js', lines: [] }));
    const head = el.shadowRoot.querySelector('.head');
    expect(head.textContent).toContain('JS');
    expect(head.textContent).toContain('app.js');
  });

  it('genera numeración en el gutter por cada línea', async () => {
    const el = track(await mount('ag-molecule-code-block', { lines: ['a', 'b', 'c'] }));
    const nums = el.shadowRoot.querySelectorAll('.gutter div');
    expect(nums.length).toBe(3);
    expect(nums[0].textContent.trim()).toBe('1');
    expect(nums[2].textContent.trim()).toBe('3');
  });

  it('copia al clipboard y emite ag-code-copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const el = track(await mount('ag-molecule-code-block', { lang: 'JS', file: 'app.js', lines: ['hello'] }));
    let detail = null;
    el.addEventListener('ag-code-copy', (e) => { detail = e.detail; });
    el.shadowRoot.querySelector('.copy').click();
    await new Promise((r) => setTimeout(r, 10));
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(detail).toEqual({ lang: 'JS', file: 'app.js' });
  });

  it('muestra label copiado tras copiar', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const el = track(await mount('ag-molecule-code-block', { lines: ['x'] }));
    el.shadowRoot.querySelector('.copy').click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.copy').textContent.trim()).toBe('copiado ✓');
  });
});

// ─── ag-molecule-rating ──────────────────────────────────────────────────────

describe('ag-molecule-rating', () => {
  const PROPS = {
    question: '¿Útil?',
    upLabel: 'Sí',
    downLabel: 'No',
    upCount: 10,
    downCount: 2,
    thanksText: '¡Gracias!',
  };

  it('renderiza la pregunta', async () => {
    const el = track(await mount('ag-molecule-rating', PROPS));
    expect(el.shadowRoot.querySelector('.question').textContent.trim()).toBe('¿Útil?');
  });

  it('emite ag-rate con vote=up al hacer click en up', async () => {
    const el = track(await mount('ag-molecule-rating', PROPS));
    let detail = null;
    el.addEventListener('ag-rate', (e) => { detail = e.detail; });
    el.shadowRoot.querySelector('ag-atom-button').dispatchEvent(
      new CustomEvent('ag-click', { bubbles: true, composed: true })
    );
    expect(detail).toEqual({ vote: 'up' });
  });

  it('setea picked=up internamente al votar up', async () => {
    const el = track(await mount('ag-molecule-rating', PROPS));
    el.shadowRoot.querySelector('ag-atom-button').dispatchEvent(
      new CustomEvent('ag-click', { bubbles: true, composed: true })
    );
    await el.updateComplete;
    expect(el.picked).toBe('up');
  });

  it('muestra .thanks solo después de votar', async () => {
    const el = track(await mount('ag-molecule-rating', PROPS));
    expect(el.shadowRoot.querySelector('.thanks')).toBeNull();
    el.picked = 'up';
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.thanks').textContent).toContain('¡Gracias!');
  });

  it('emite ag-rate con vote=down al hacer click en down', async () => {
    const el = track(await mount('ag-molecule-rating', PROPS));
    let detail = null;
    el.addEventListener('ag-rate', (e) => { detail = e.detail; });
    const buttons = el.shadowRoot.querySelectorAll('ag-atom-button');
    buttons[1].dispatchEvent(new CustomEvent('ag-click', { bubbles: true, composed: true }));
    expect(detail).toEqual({ vote: 'down' });
  });
});

// ─── ag-molecule-breadcrumb ──────────────────────────────────────────────────

describe('ag-molecule-breadcrumb', () => {
  const ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'Laboratorio', href: '/laboratorio' },
    { label: 'Artículo' },
  ];

  it('renderiza links para items con href', async () => {
    const el = track(await mount('ag-molecule-breadcrumb', { items: ITEMS }));
    const links = el.shadowRoot.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe('/');
  });

  it('el último item tiene clase current y aria-current=page', async () => {
    const el = track(await mount('ag-molecule-breadcrumb', { items: ITEMS }));
    const current = el.shadowRoot.querySelector('.current');
    expect(current.textContent.trim()).toBe('Artículo');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('agrega separadores / entre items', async () => {
    const el = track(await mount('ag-molecule-breadcrumb', { items: ITEMS }));
    const seps = el.shadowRoot.querySelectorAll('.sep');
    expect(seps.length).toBe(2); // entre 3 items hay 2 separadores
  });

  it('setea aria-label=Breadcrumb en connectedCallback', async () => {
    const el = track(await mount('ag-molecule-breadcrumb', { items: ITEMS }));
    expect(el.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('item sin href y no último renderiza como span sin enlace', async () => {
    // Branch: no isLast, no href → span sin enlace
    const itemsWithSpan = [
      { label: 'Home', href: '/' },
      { label: 'Sin enlace' },    // ← no href, no último
      { label: 'Actual' },        // ← último
    ];
    const el = track(await mount('ag-molecule-breadcrumb', { items: itemsWithSpan }));
    const spans = el.shadowRoot.querySelectorAll('span:not(.current):not(.sep)');
    const noLinkSpan = Array.from(spans).find((s) => s.textContent.trim() === 'Sin enlace');
    expect(noLinkSpan).toBeTruthy();
  });
});

// ─── ag-molecule-form-field ──────────────────────────────────────────────────

describe('ag-molecule-form-field', () => {
  it('renderiza el label', async () => {
    const el = track(await mount('ag-molecule-form-field', { label: 'Email' }));
    expect(el.shadowRoot.querySelector('label').textContent).toContain('Email');
  });

  it('muestra asterisco * cuando required=true', async () => {
    const el = track(await mount('ag-molecule-form-field', { label: 'Email', required: true }));
    expect(el.shadowRoot.querySelector('.req')).toBeTruthy();
    expect(el.shadowRoot.querySelector('.req').textContent).toBe('*');
  });

  it('no muestra asterisco sin required', async () => {
    const el = track(await mount('ag-molecule-form-field', { label: 'Email' }));
    expect(el.shadowRoot.querySelector('.req')).toBeNull();
  });

  it('muestra mensaje de error cuando error=true y errorMsg tiene texto', async () => {
    const el = track(await mount('ag-molecule-form-field', { error: true, errorMsg: 'Campo requerido' }));
    expect(el.shadowRoot.querySelector('.err').textContent).toBe('Campo requerido');
  });

  it('no muestra error cuando error=false', async () => {
    const el = track(await mount('ag-molecule-form-field', { error: false, errorMsg: 'Error' }));
    expect(el.shadowRoot.querySelector('.err')).toBeNull();
  });
});

// ─── ag-molecule-mermaid ─────────────────────────────────────────────────────

describe('ag-molecule-mermaid', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mount('ag-molecule-mermaid'));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renderiza el SVG del mock tras pasar code', async () => {
    const el = track(await mount('ag-molecule-mermaid', { code: 'flowchart TD\n  A-->B' }));
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    expect(el._svg).toContain('<svg');
  });

  it('muestra caption con num cuando ambos están presentes', async () => {
    const el = track(await mount('ag-molecule-mermaid', { caption: 'Diagrama de flujo', num: '1' }));
    await el.updateComplete;
    const cap = el.shadowRoot.querySelector('figcaption');
    expect(cap.textContent).toContain('Diagrama de flujo');
    expect(cap.textContent).toContain('Fig. 1');
  });
});
