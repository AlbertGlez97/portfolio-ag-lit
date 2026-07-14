import { describe, it, expect } from 'vitest';
import { formatDateDots, formatDateLong } from '../format-date.js';

describe('formatDateDots', () => {
  it('formatea correctamente en locale es', () => {
    expect(formatDateDots('2025-03-28', 'es')).toBe('28 · MAR · 2025');
  });

  it('formatea correctamente en locale en', () => {
    expect(formatDateDots('2025-03-28', 'en')).toBe('28 · MAR · 2025');
  });

  it('usa locale es por defecto', () => {
    expect(formatDateDots('2025-01-05')).toBe('05 · ENE · 2025');
  });

  it('aplica padding al día (01, 09)', () => {
    expect(formatDateDots('2025-06-01')).toBe('01 · JUN · 2025');
    expect(formatDateDots('2025-06-09')).toBe('09 · JUN · 2025');
  });

  it('retorna string vacío con input vacío', () => {
    expect(formatDateDots('')).toBe('');
  });

  it('retorna string vacío con fecha inválida', () => {
    expect(formatDateDots('no-es-una-fecha')).toBe('');
  });

  it('usa todos los meses en es', () => {
    const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    meses.forEach((mes, i) => {
      const month = String(i + 1).padStart(2, '0');
      expect(formatDateDots(`2025-${month}-15`, 'es')).toContain(mes);
    });
  });

  it('usa todos los meses en en', () => {
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    months.forEach((mes, i) => {
      const month = String(i + 1).padStart(2, '0');
      expect(formatDateDots(`2025-${month}-15`, 'en')).toContain(mes);
    });
  });
});

describe('formatDateLong', () => {
  it('formatea correctamente en locale es', () => {
    expect(formatDateLong('2025-04-12', 'es')).toBe('12 Abr 2025');
  });

  it('formatea correctamente en locale en', () => {
    expect(formatDateLong('2025-04-12', 'en')).toBe('12 Apr 2025');
  });

  it('usa locale es por defecto', () => {
    expect(formatDateLong('2025-01-05')).toBe('5 Ene 2025');
  });

  it('retorna string vacío con input vacío', () => {
    expect(formatDateLong('')).toBe('');
  });

  it('retorna string vacío con fecha inválida', () => {
    expect(formatDateLong('no-es-una-fecha')).toBe('');
  });

  it('usa todos los meses en es', () => {
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    meses.forEach((mes, i) => {
      const month = String(i + 1).padStart(2, '0');
      expect(formatDateLong(`2025-${month}-15`, 'es')).toContain(mes);
    });
  });

  it('usa todos los meses en en', () => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    months.forEach((mes, i) => {
      const month = String(i + 1).padStart(2, '0');
      expect(formatDateLong(`2025-${month}-15`, 'en')).toContain(mes);
    });
  });
});
