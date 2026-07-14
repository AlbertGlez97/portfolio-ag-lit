import { describe, it, expect } from 'vitest';
import { renderBar, padEnd } from '../terminal-commands.js';

describe('renderBar', () => {
  it('nivel 0 → solo bloques vacíos', () => {
    expect(renderBar(0)).toBe('░'.repeat(10));
  });

  it('nivel 5 → mitad llena, mitad vacía', () => {
    expect(renderBar(5)).toBe('▓'.repeat(5) + '░'.repeat(5));
  });

  it('nivel 10 → completamente lleno', () => {
    expect(renderBar(10)).toBe('▓'.repeat(10));
  });

  it('nivel fuera de rango alto → clampea a 10', () => {
    expect(renderBar(99)).toBe('▓'.repeat(10));
  });

  it('nivel fuera de rango bajo → clampea a 0', () => {
    expect(renderBar(-5)).toBe('░'.repeat(10));
  });

  it('la longitud total siempre es 10', () => {
    [0, 1, 5, 9, 10].forEach((n) => {
      expect([...renderBar(n)].length).toBe(10);
    });
  });
});

describe('padEnd', () => {
  it('agrega espacios hasta el ancho indicado', () => {
    expect(padEnd('hi', 5)).toBe('hi   ');
  });

  it('no modifica strings exactamente del ancho indicado', () => {
    expect(padEnd('hola', 4)).toBe('hola');
  });

  it('no trunca strings más largos que n', () => {
    expect(padEnd('demasiado', 3)).toBe('demasiado');
  });

  it('maneja null → lo trata como string vacío', () => {
    expect(padEnd(null, 4)).toBe('    ');
  });

  it('maneja undefined → lo trata como string vacío', () => {
    expect(padEnd(undefined, 4)).toBe('    ');
  });

  it('maneja string vacío', () => {
    expect(padEnd('', 3)).toBe('   ');
  });
});
