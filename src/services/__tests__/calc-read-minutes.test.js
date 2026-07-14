import { describe, it, expect } from 'vitest';
import { calcReadMinutes } from '../content.service.js';

describe('calcReadMinutes', () => {
  it('retorna 1 cuando body no es un array', () => {
    expect(calcReadMinutes(null)).toBe(1);
    expect(calcReadMinutes(undefined)).toBe(1);
    expect(calcReadMinutes('texto')).toBe(1);
    expect(calcReadMinutes({})).toBe(1);
  });

  it('retorna 1 con body vacío', () => {
    expect(calcReadMinutes([])).toBe(1);
  });

  it('calcula prosa a 200 wpm', () => {
    // 200 palabras → 1 minuto exacto
    const words = 'palabra '.repeat(200).trim();
    expect(calcReadMinutes([{ type: 'prose', text: words }])).toBe(1);
  });

  it('calcula código a 100 wpm', () => {
    // 100 palabras de código → 1 minuto exacto
    const words = 'token '.repeat(100).trim();
    expect(calcReadMinutes([{ type: 'code', lines: [words] }])).toBe(1);
  });

  it('calcula mixto (prosa + código) sumando correctamente', () => {
    // 200 palabras prosa (1 min) + 100 palabras código (1 min) = 2 min
    const prose = 'palabra '.repeat(200).trim();
    const code = 'token '.repeat(100).trim();
    expect(calcReadMinutes([
      { type: 'prose', text: prose },
      { type: 'code', lines: [code] },
    ])).toBe(2);
  });

  it('redondea hacia arriba (Math.ceil)', () => {
    // 1 palabra de prosa → 1/200 min → ceil = 1
    expect(calcReadMinutes([{ type: 'prose', text: 'hola' }])).toBe(1);
    // 201 palabras de prosa → 201/200 = 1.005 → ceil = 2
    const words = 'palabra '.repeat(201).trim();
    expect(calcReadMinutes([{ type: 'prose', text: words }])).toBe(2);
  });

  it('el mínimo siempre es 1', () => {
    expect(calcReadMinutes([{ type: 'prose', text: '' }])).toBe(1);
    expect(calcReadMinutes([{ type: 'code', lines: [] }])).toBe(1);
  });

  it('acumula title además de text en bloques de prosa', () => {
    // 100 words en text + 100 words en title = 200 words prosa → 1 min
    const half = 'palabra '.repeat(100).trim();
    expect(calcReadMinutes([{ type: 'prose', text: half, title: half }])).toBe(1);
  });
});
