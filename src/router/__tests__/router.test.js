import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from '../ag-router.js';

// Registrar páginas mock una sola vez por archivo
for (const tag of ['ag-page-landing', 'ag-page-laboratorio', 'ag-page-article']) {
  if (!customElements.get(tag)) {
    customElements.define(tag, class extends HTMLElement {});
  }
}

describe('Router', () => {
  let outlet, router;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    router = new Router({ outlet });
    // Partir siempre desde /
    history.replaceState({}, '', '/');
  });

  afterEach(() => {
    router.stop();
    outlet.remove();
    vi.restoreAllMocks();
  });

  // ─── _resolve ───────────────────────────────────────────────────────────────

  describe('_resolve()', () => {
    it('monta ag-page-landing para /', () => {
      router._resolve('/');
      expect(outlet.querySelector('ag-page-landing')).toBeTruthy();
    });

    it('monta ag-page-laboratorio para /laboratorio', () => {
      router._resolve('/laboratorio');
      expect(outlet.querySelector('ag-page-laboratorio')).toBeTruthy();
    });

    it('pasa slug como prop para /laboratorio/mi-slug', () => {
      router._resolve('/laboratorio/mi-slug');
      const el = outlet.querySelector('ag-page-article');
      expect(el).toBeTruthy();
      expect(el.slug).toBe('mi-slug');
    });

    it('renderiza fallback "Ruta no encontrada" para ruta desconocida', () => {
      router._resolve('/ruta-inexistente');
      const fallback = outlet.querySelector('[data-router-fallback]');
      expect(fallback).toBeTruthy();
      expect(fallback.innerHTML).toContain('Ruta no encontrada');
    });

    it('renderiza "Página en construcción" si el custom element no está registrado', () => {
      vi.spyOn(customElements, 'get').mockReturnValue(undefined);
      router._resolve('/');
      const fallback = outlet.querySelector('[data-router-fallback]');
      expect(fallback.innerHTML).toContain('Página en construcción');
    });

    it('limpia el elemento previo antes de montar el nuevo', () => {
      router._resolve('/');
      router._resolve('/laboratorio');
      expect(outlet.querySelectorAll('[slot="page"]').length).toBe(1);
    });

    it('el elemento montado tiene slot="page"', () => {
      router._resolve('/');
      expect(outlet.querySelector('[slot="page"]').tagName.toLowerCase()).toBe('ag-page-landing');
    });
  });

  // ─── ag-route-change ────────────────────────────────────────────────────────

  describe('evento ag-route-change', () => {
    it('emite con path y tag correctos', () => {
      let detail = null;
      outlet.addEventListener('ag-route-change', (e) => { detail = e.detail; });
      router._resolve('/laboratorio');
      expect(detail.path).toBe('/laboratorio');
      expect(detail.tag).toBe('ag-page-laboratorio');
    });

    it('emite params con slug en rutas de artículo', () => {
      let detail = null;
      outlet.addEventListener('ag-route-change', (e) => { detail = e.detail; });
      router._resolve('/laboratorio/test-slug');
      expect(detail.params.slug).toBe('test-slug');
    });

    it('no emite para rutas no encontradas', () => {
      let called = false;
      outlet.addEventListener('ag-route-change', () => { called = true; });
      router._resolve('/ruta-inexistente');
      expect(called).toBe(false);
    });
  });

  // ─── navigate() ─────────────────────────────────────────────────────────────

  describe('navigate()', () => {
    it('llama pushState y resuelve la nueva ruta', () => {
      const spy = vi.spyOn(history, 'pushState');
      router.navigate('/laboratorio');
      expect(spy).toHaveBeenCalledWith({}, '', '/laboratorio');
      expect(outlet.querySelector('ag-page-laboratorio')).toBeTruthy();
    });

    it('es no-op si se navega a la misma ruta actual', () => {
      history.replaceState({}, '', '/laboratorio');
      const spy = vi.spyOn(history, 'pushState');
      router.navigate('/laboratorio');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // ─── start() / stop() ───────────────────────────────────────────────────────

  describe('start() / stop()', () => {
    it('start() registra listener popstate en window', () => {
      const spy = vi.spyOn(window, 'addEventListener');
      router.start();
      expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function));
    });

    it('start() registra listener click en document', () => {
      const spy = vi.spyOn(document, 'addEventListener');
      router.start();
      expect(spy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('stop() elimina listeners de window y document', () => {
      router.start();
      const winSpy = vi.spyOn(window, 'removeEventListener');
      const docSpy = vi.spyOn(document, 'removeEventListener');
      router.stop();
      expect(winSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(docSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('stop() elimina el elemento activo del outlet', () => {
      router.start();
      router._resolve('/');
      router.stop();
      expect(outlet.querySelector('[slot="page"]')).toBeNull();
    });
  });

  // ─── _interceptClick ────────────────────────────────────────────────────────

  describe('_interceptClick()', () => {
    let anchor;

    const fireClick = (el, opts = {}) => {
      const e = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...opts });
      el.dispatchEvent(e);
      return e;
    };

    beforeEach(() => {
      anchor = document.createElement('a');
      document.body.appendChild(anchor);
      router.start();
    });

    afterEach(() => {
      anchor.remove();
    });

    it('intercepta clicks en <a> internos y navega', () => {
      anchor.setAttribute('href', '/laboratorio');
      const e = fireClick(anchor);
      expect(e.defaultPrevented).toBe(true);
      expect(outlet.querySelector('ag-page-laboratorio')).toBeTruthy();
    });

    it('ignora links externos http://', () => {
      anchor.setAttribute('href', 'http://external.com');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora links externos https://', () => {
      anchor.setAttribute('href', 'https://external.com');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora mailto:', () => {
      anchor.setAttribute('href', 'mailto:test@test.com');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora con metaKey', () => {
      anchor.setAttribute('href', '/laboratorio');
      expect(fireClick(anchor, { metaKey: true }).defaultPrevented).toBe(false);
    });

    it('ignora con ctrlKey', () => {
      anchor.setAttribute('href', '/laboratorio');
      expect(fireClick(anchor, { ctrlKey: true }).defaultPrevented).toBe(false);
    });

    it('ignora con shiftKey', () => {
      anchor.setAttribute('href', '/laboratorio');
      expect(fireClick(anchor, { shiftKey: true }).defaultPrevented).toBe(false);
    });

    it('ignora con altKey', () => {
      anchor.setAttribute('href', '/laboratorio');
      expect(fireClick(anchor, { altKey: true }).defaultPrevented).toBe(false);
    });

    it('ignora target="_blank"', () => {
      anchor.setAttribute('href', '/laboratorio');
      anchor.setAttribute('target', '_blank');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora atributo download', () => {
      anchor.setAttribute('href', '/file.pdf');
      anchor.setAttribute('download', '');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora clicks sin href', () => {
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });

    it('ignora hrefs que empiezan con #', () => {
      anchor.setAttribute('href', '#seccion');
      expect(fireClick(anchor).defaultPrevented).toBe(false);
    });
  });

  // ─── hash navigation ────────────────────────────────────────────────────────

  describe('hash navigation', () => {
    it('llama scrollIntoView en el elemento con el ID del hash', () => {
      vi.useFakeTimers();
      const target = document.createElement('div');
      target.id = 'seccion';
      target.scrollIntoView = vi.fn();
      document.body.appendChild(target);

      router._resolve('/#seccion');
      vi.runAllTimers();

      expect(target.scrollIntoView).toHaveBeenCalled();
      target.remove();
      vi.useRealTimers();
    });
  });
});
