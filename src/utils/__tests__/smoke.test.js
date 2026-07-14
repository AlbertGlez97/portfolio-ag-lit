import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../escape-html.js';

describe('escapeHtml — smoke test (Fase 0)', () => {
  it('la infraestructura de testing funciona correctamente', () => {
    expect(escapeHtml('<b>hola</b>')).toBe('&lt;b&gt;hola&lt;/b&gt;');
  });
});
