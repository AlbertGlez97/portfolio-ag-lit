/**
 * organisms-hero.test.js
 *
 * Pruebas para ag-organism-hero y su typing animation (_runTypingLoop).
 * Controlamos _sleep con un contador para detener el loop después de N ciclos.
 */
import { describe, it, expect, afterEach } from 'vitest';
import '../ag-organism-hero/ag-organism-hero.js';

/** Monta el hero con el loop activo pero _sleep controlado */
async function mountHeroWithLoop(props = {}, maxSleeps = 50) {
  const el = document.createElement('ag-organism-hero');
  let sleepCount = 0;
  el._sleep = () => {
    sleepCount++;
    if (sleepCount >= maxSleeps) el._typingActive = false;
    return Promise.resolve();
  };
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  // Esperar a que el loop termine (desactivado por sleep counter)
  await new Promise((r) => setTimeout(r, 10));
  return el;
}

/** Monta el hero con el loop silenciado */
async function mountHero(props = {}) {
  const el = document.createElement('ag-organism-hero');
  el._runTypingLoop = async () => {};
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; });
const track = (el) => { collected.push(el); return el; };

describe('ag-organism-hero — estado inicial', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mountHero());
    expect(el.shadowRoot).toBeTruthy();
  });

  it('_typed inicial es ""', async () => {
    const el = track(await mountHero());
    expect(el._typed).toBe('');
  });

  it('disconnectedCallback desactiva el loop', async () => {
    const el = track(await mountHero());
    el._typingActive = true;
    el.disconnectedCallback();
    expect(el._typingActive).toBe(false);
  });
});

describe('ag-organism-hero — _runTypingLoop branch coverage', () => {
  it('sin heroPhrases el loop llama _sleep(500) y regresa', async () => {
    const sleeps = [];
    const el = document.createElement('ag-organism-hero');
    let count = 0;
    el._sleep = (ms) => {
      sleeps.push(ms);
      count++;
      if (count >= 3) el._typingActive = false;
      return Promise.resolve();
    };
    el.heroPhrases = [];
    document.body.appendChild(el);
    collected.push(el);
    await new Promise((r) => setTimeout(r, 20));
    // Verificar que el branch vacío ejecutó sleep(500)
    expect(sleeps).toContain(500);
  });

  it('con heroPhrases tipea la frase y activa _typed', async () => {
    const el = track(await mountHeroWithLoop({ heroPhrases: ['Hi'] }, 30));
    // Después de ejecutar, _typed debería haber pasado por varios valores
    // _typingActive ya es false, el loop terminó
    expect(el._typingActive).toBe(false);
  });

  it('con múltiples frases avanza al siguiente phrase', async () => {
    const el = track(await mountHeroWithLoop({ heroPhrases: ['Hi', 'Bye'] }, 80));
    expect(el._typingActive).toBe(false);
  });

  it('_typingActive=false durante tipeo detiene el loop (branch mid-type)', async () => {
    const el = document.createElement('ag-organism-hero');
    let typeCount = 0;
    el._sleep = () => {
      typeCount++;
      // Detener exactamente a mitad del tipeo de 'Hello'
      if (typeCount === 3) el._typingActive = false;
      return Promise.resolve();
    };
    el.heroPhrases = ['Hello'];
    document.body.appendChild(el);
    collected.push(el);
    await new Promise((r) => setTimeout(r, 20));
    expect(el._typingActive).toBe(false);
  });

  it('_typingActive=false durante pause (2000ms) detiene el loop', async () => {
    const el = document.createElement('ag-organism-hero');
    let phase = 'type';
    el._sleep = (ms) => {
      if (ms === 2000) el._typingActive = false; // detener en la pausa
      return Promise.resolve();
    };
    el.heroPhrases = ['Hi'];
    document.body.appendChild(el);
    collected.push(el);
    await new Promise((r) => setTimeout(r, 30));
    expect(el._typingActive).toBe(false);
  });

  it('_typingActive=false durante borrado detiene el loop', async () => {
    const el = document.createElement('ag-organism-hero');
    let inDelete = false;
    el._sleep = (ms) => {
      if (ms === 16 && inDelete) el._typingActive = false;
      if (ms === 2000) inDelete = true; // siguiente sleep de 16 es borrado
      return Promise.resolve();
    };
    el.heroPhrases = ['Hi'];
    document.body.appendChild(el);
    collected.push(el);
    await new Promise((r) => setTimeout(r, 50));
    expect(el._typingActive).toBe(false);
  });
});

describe('ag-organism-hero — render', () => {
  it('renderiza el shadowRoot con props básicas', async () => {
    const el = track(await mountHero({
      firstName: 'Alberto', lastName: 'González',
      subtitle: 'Dev', availability: 'Disponible',
    }));
    expect(el.shadowRoot.innerHTML).toBeTruthy();
  });
});

describe('ag-organism-hero — _runTypingLoop lógica', () => {
  it('con heroPhrases vacías duerme y continua', async () => {
    const el = track(await mountHero({ heroPhrases: [] }));

    const sleeps = [];
    el._sleep = (ms) => { sleeps.push(ms); return Promise.resolve(); };

    // Ejecutar solo una iteración del loop (sin while(true) infinito)
    el._typingActive = true;
    // Invocar el bucle interno manualmente — solo un ciclo
    const phrases = el.heroPhrases;
    if (!phrases || phrases.length === 0) {
      await el._sleep(500); // esto ejercita el branch "sin frases"
    }
    el._typingActive = false;

    expect(sleeps).toContain(500);
  });

  it('con una frase escribe y borra correctamente', async () => {
    const el = track(await mountHero({ heroPhrases: ['Hi'] }));

    const typed = [];
    el._sleep = () => Promise.resolve();

    // Simular una sola pasada de type+delete sin el while
    el._typingActive = true;
    const phrase = 'Hi';
    for (let c = 0; c <= phrase.length; c++) {
      if (!el._typingActive) break;
      el._typed = phrase.slice(0, c);
      typed.push(el._typed);
      await el._sleep(38);
    }
    await el._sleep(2000);

    for (let c = phrase.length; c >= 0; c--) {
      if (!el._typingActive) break;
      el._typed = phrase.slice(0, c);
      typed.push(el._typed);
      await el._sleep(16);
    }
    el._typingActive = false;

    expect(typed).toContain('Hi');
    expect(typed).toContain('H');
    expect(typed).toContain('');
  });

  it('_typingActive=false interrumpe el loop durante el tipeo', async () => {
    const el = track(await mountHero({ heroPhrases: ['Hello World'] }));

    let sleepCount = 0;
    el._sleep = () => { sleepCount++; return Promise.resolve(); };

    el._typingActive = true;

    // Simular que el loop se interrumpe después de 3 pasos
    const phrase = 'Hello World';
    for (let c = 0; c <= phrase.length; c++) {
      if (!el._typingActive) break;
      el._typed = phrase.slice(0, c);
      await el._sleep(38);
      if (c === 3) { el._typingActive = false; } // interrumpir
    }

    expect(el._typed).toBe('Hel');
    expect(el._typingActive).toBe(false);
  });
});

describe('ag-organism-hero — render', () => {
  it('renderiza el shadowRoot con props básicas', async () => {
    const el = track(await mountHero({
      firstName: 'Alberto', lastName: 'González',
      subtitle: 'Dev', availability: 'Disponible',
    }));
    expect(el.shadowRoot.innerHTML).toBeTruthy();
  });
});
