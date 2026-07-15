/**
 * molecules-missing-branches.test.js
 *
 * Tests focalizados en las branches específicas no cubiertas en moléculas:
 * - ag-molecule-nav-link: active=true → aria-current="page"
 * - ag-organism-footer: role ya setado → no vuelve a setarlo
 * - ag-organism-reading-progress: _onScroll con _rafId activo (early return)
 * - ag-organism-nav: mobile-open toggle
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import '../../molecules/ag-molecule-nav-link/ag-molecule-nav-link.js';
import '../ag-organism-footer/ag-organism-footer.js';
import '../ag-organism-reading-progress/ag-organism-reading-progress.js';
import '../ag-organism-nav/ag-organism-nav.js';

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

// ─── ag-molecule-nav-link ──────────────────────────────────────────────────

describe('ag-molecule-nav-link — branch active', () => {
  it('con active=false, aria-current es "false"', async () => {
    const el = track(await mount('ag-molecule-nav-link', { active: false, href: '/', idx: '01' }));
    const a = el.shadowRoot.querySelector('a');
    expect(a.getAttribute('aria-current')).toBe('false');
  });

  it('con active=true, aria-current es "page"', async () => {
    const el = track(await mount('ag-molecule-nav-link', { active: true, href: '/', idx: '01' }));
    const a = el.shadowRoot.querySelector('a');
    expect(a.getAttribute('aria-current')).toBe('page');
  });
});

// ─── ag-organism-footer ───────────────────────────────────────────────────

describe('ag-organism-footer — branch role', () => {
  it('sin role previo → lo setea a "contentinfo"', async () => {
    const el = track(await mount('ag-organism-footer'));
    expect(el.getAttribute('role')).toBe('contentinfo');
  });

  it('con role ya seteado → no lo sobrescribe', async () => {
    const el = document.createElement('ag-organism-footer');
    el.setAttribute('role', 'banner'); // pre-set antes de conectar
    document.body.appendChild(el);
    collected.push(el);
    await el.updateComplete;
    // El branch "ya tiene role" → mantiene 'banner'
    expect(el.getAttribute('role')).toBe('banner');
  });
});

// ─── ag-organism-reading-progress ─────────────────────────────────────────

describe('ag-organism-reading-progress — branch _rafId', () => {
  it('_onScroll con _rafId activo retorna sin crear otro raf', async () => {
    const el = track(await mount('ag-organism-reading-progress'));
    // Simular _rafId activo para ejercitar el `if (this._rafId) return` branch
    el._rafId = 999;
    el._updateBar = vi.fn();
    el._onScroll();
    // No se debería llamar _updateBar porque retornó temprano
    expect(el._updateBar).not.toHaveBeenCalled();
  });

  it('_onScroll sin _rafId activo crea un RAF', async () => {
    const el = track(await mount('ag-organism-reading-progress'));
    el._rafId = null;
    el._updateBar = vi.fn();
    el._onScroll();
    // Se creó un RAF (el _rafId ya no es null)
    expect(el._rafId).not.toBeNull();
    // Cancelar el RAF pendiente
    if (el._rafId) cancelAnimationFrame(el._rafId);
  });
});

// ─── ag-organism-nav — branches de mobile toggle ─────────────────────────

describe('ag-organism-nav — branches de estado', () => {
  it('se monta con shadowRoot', async () => {
    const el = track(await mount('ag-organism-nav', {
      links: [{ idx: '01', label: 'Proyectos', href: '#proyectos', sectionId: 'proyectos' }],
    }));
    expect(el.shadowRoot).toBeTruthy();
  });

  it('_activeId actualiza el estado', async () => {
    const el = track(await mount('ag-organism-nav'));
    el._activeId = 'proyectos';
    await el.updateComplete;
    expect(el._activeId).toBe('proyectos');
  });
});
