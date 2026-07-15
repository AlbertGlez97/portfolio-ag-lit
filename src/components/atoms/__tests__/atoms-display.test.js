import { describe, it, expect, afterEach } from 'vitest';

// Prioridad media
import '../ag-atom-heading/ag-atom-heading.js';
import '../ag-atom-text/ag-atom-text.js';
import '../ag-atom-link/ag-atom-link.js';
import '../ag-atom-tag/ag-atom-tag.js';
import '../ag-atom-icon/ag-atom-icon.js';
import '../ag-atom-kbd/ag-atom-kbd.js';

// Prioridad baja (smoke)
import '../ag-atom-avatar/ag-atom-avatar.js';
import '../ag-atom-caret/ag-atom-caret.js';
import '../ag-atom-divider/ag-atom-divider.js';
import '../ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../ag-atom-logo/ag-atom-logo.js';
import '../ag-atom-pulse/ag-atom-pulse.js';
import '../ag-atom-quote/ag-atom-quote.js';

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

// ─── ag-atom-heading ─────────────────────────────────────────────────────────

describe('ag-atom-heading', () => {
  it.each([1, 2, 3, 4, 5, 6])('renderiza <h%i> para level=%i', async (level) => {
    const el = track(await mount('ag-atom-heading', { level }));
    expect(el.shadowRoot.querySelector(`h${level}`)).toBeTruthy();
  });

  it('renderiza <h2> por defecto', async () => {
    const el = track(await mount('ag-atom-heading'));
    expect(el.shadowRoot.querySelector('h2')).toBeTruthy();
  });

  it('renderiza <h2> para level inválido (fallback)', async () => {
    const el = track(await mount('ag-atom-heading', { level: 99 }));
    expect(el.shadowRoot.querySelector('h2')).toBeTruthy();
  });

  it('refleja variant como atributo', async () => {
    const el = track(await mount('ag-atom-heading', { variant: 'display' }));
    expect(el.getAttribute('variant')).toBe('display');
  });

  it('setea data-n cuando tiene num', async () => {
    const el = track(await mount('ag-atom-heading', { level: 2, num: '01' }));
    expect(el.shadowRoot.querySelector('h2').getAttribute('data-n')).toBe('01');
  });
});

// ─── ag-atom-text ────────────────────────────────────────────────────────────

describe('ag-atom-text', () => {
  it.each(['lede', 'body', 'hero-sub'])('renderiza <p> para variant=%s', async (variant) => {
    const el = track(await mount('ag-atom-text', { variant }));
    expect(el.shadowRoot.querySelector('p')).toBeTruthy();
  });

  it('renderiza <code> para variant=mono', async () => {
    const el = track(await mount('ag-atom-text', { variant: 'mono' }));
    expect(el.shadowRoot.querySelector('code')).toBeTruthy();
  });

  it.each(['caption', 'meta'])('renderiza <span> para variant=%s', async (variant) => {
    const el = track(await mount('ag-atom-text', { variant }));
    expect(el.shadowRoot.querySelector('span')).toBeTruthy();
  });

  it('renderiza <span> por defecto (fallback)', async () => {
    const el = track(await mount('ag-atom-text', { variant: 'unknown' }));
    expect(el.shadowRoot.querySelector('span')).toBeTruthy();
  });

  it('refleja variant como atributo', async () => {
    const el = track(await mount('ag-atom-text', { variant: 'lede' }));
    expect(el.getAttribute('variant')).toBe('lede');
  });
});

// ─── ag-atom-link ────────────────────────────────────────────────────────────

describe('ag-atom-link', () => {
  it('renderiza un <a> con href', async () => {
    const el = track(await mount('ag-atom-link', { href: '/laboratorio' }));
    expect(el.shadowRoot.querySelector('a').getAttribute('href')).toBe('/laboratorio');
  });

  it('usa _self como target por defecto', async () => {
    const el = track(await mount('ag-atom-link', { href: '/lab' }));
    expect(el.shadowRoot.querySelector('a').getAttribute('target')).toBe('_self');
  });

  it('acepta target externo', async () => {
    const el = track(await mount('ag-atom-link', { href: 'https://github.com', target: '_blank' }));
    expect(el.shadowRoot.querySelector('a').getAttribute('target')).toBe('_blank');
  });
});

// ─── ag-atom-tag ─────────────────────────────────────────────────────────────

describe('ag-atom-tag', () => {
  it('se monta sin errores', async () => {
    const el = track(await mount('ag-atom-tag'));
    expect(el.shadowRoot).toBeTruthy();
  });

  it.each(['neutral', 'threejs', 'ia', 'tutor', 'backend'])('refleja variant=%s', async (variant) => {
    const el = track(await mount('ag-atom-tag', { variant }));
    expect(el.getAttribute('variant')).toBe(variant);
  });

  it.each(['sm', 'md'])('refleja size=%s', async (size) => {
    const el = track(await mount('ag-atom-tag', { size }));
    expect(el.getAttribute('size')).toBe(size);
  });
});

// ─── ag-atom-icon ────────────────────────────────────────────────────────────

describe('ag-atom-icon', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mount('ag-atom-icon'));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('setea la CSS var con el size en updated()', async () => {
    const el = track(await mount('ag-atom-icon', { size: 24 }));
    await el.updateComplete;
    expect(el.style.getPropertyValue('--_ag-icon-size')).toBe('1.5rem');
  });

  it('size por defecto es 16 → 1rem', async () => {
    const el = track(await mount('ag-atom-icon'));
    await el.updateComplete;
    expect(el.style.getPropertyValue('--_ag-icon-size')).toBe('1rem');
  });
});

// ─── ag-atom-kbd ─────────────────────────────────────────────────────────────

describe('ag-atom-kbd', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mount('ag-atom-kbd'));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renderiza un slot', async () => {
    const el = track(await mount('ag-atom-kbd'));
    expect(el.shadowRoot.querySelector('slot')).toBeTruthy();
  });
});

// ─── Átomos visuales — smoke tests ───────────────────────────────────────────

describe('átomos visuales (smoke)', () => {
  it.each([
    'ag-atom-avatar',
    'ag-atom-caret',
    'ag-atom-divider',
    'ag-atom-eyebrow',
    'ag-atom-gradient-text',
    'ag-atom-logo',
    'ag-atom-pulse',
    'ag-atom-quote',
  ])('%s se monta sin errores y tiene shadowRoot', async (tag) => {
    const el = track(await mount(tag));
    expect(el.shadowRoot).toBeTruthy();
  });
});
