import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../escape-html.js';

describe('escapeHtml', () => {
  it('escapa &', () => expect(escapeHtml('a & b')).toBe('a &amp; b'));
  it('escapa <', () => expect(escapeHtml('<div>')).toBe('&lt;div&gt;'));
  it('escapa >', () => expect(escapeHtml('a > b')).toBe('a &gt; b'));
  it('escapa "', () => expect(escapeHtml('"hola"')).toBe('&quot;hola&quot;'));
  it("escapa '", () => expect(escapeHtml("it's")).toBe('it&#39;s'));
  it('no altera strings sin caracteres especiales', () => expect(escapeHtml('hola mundo')).toBe('hola mundo'));
  it('maneja string vacío', () => expect(escapeHtml('')).toBe(''));
  it('coerce número a string', () => expect(escapeHtml(42)).toBe('42'));
  it('coerce null a string', () => expect(escapeHtml(null)).toBe('null'));
  it('coerce undefined a string', () => expect(escapeHtml(undefined)).toBe('undefined'));
  it('escapa múltiples caracteres especiales juntos', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });
});
