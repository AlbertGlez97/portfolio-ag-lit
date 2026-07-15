import { describe, it, expect, afterEach, vi } from 'vitest';

// Importar todos los átomos interactivos (registra los custom elements)
import '../ag-atom-button/ag-atom-button.js';
import '../ag-atom-input/ag-atom-input.js';
import '../ag-atom-select/ag-atom-select.js';
import '../ag-atom-textarea/ag-atom-textarea.js';
import '../ag-atom-chip/ag-atom-chip.js';

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

// ─── ag-atom-button ──────────────────────────────────────────────────────────

describe('ag-atom-button', () => {
  it('renderiza <button> por defecto', async () => {
    const el = track(await mount('ag-atom-button'));
    expect(el.shadowRoot.querySelector('button')).toBeTruthy();
  });

  it('renderiza <a> cuando tiene href', async () => {
    const el = track(await mount('ag-atom-button', { href: '/laboratorio' }));
    expect(el.shadowRoot.querySelector('a')).toBeTruthy();
    expect(el.shadowRoot.querySelector('button')).toBeNull();
  });

  it('renderiza <button> si href + disabled (no navega)', async () => {
    const el = track(await mount('ag-atom-button', { href: '/lab', disabled: true }));
    expect(el.shadowRoot.querySelector('button')).toBeTruthy();
  });

  it('aplica atributo disabled al button', async () => {
    const el = track(await mount('ag-atom-button', { disabled: true }));
    expect(el.shadowRoot.querySelector('button').disabled).toBe(true);
  });

  it('emite ag-click al hacer click', async () => {
    const el = track(await mount('ag-atom-button', { variant: 'primary' }));
    let detail = null;
    el.addEventListener('ag-click', (e) => { detail = e.detail; });
    el.shadowRoot.querySelector('button').click();
    expect(detail).toEqual({ variant: 'primary' });
  });

  it('no emite ag-click si está disabled', async () => {
    const el = track(await mount('ag-atom-button', { disabled: true }));
    let fired = false;
    el.addEventListener('ag-click', () => { fired = true; });
    el.shadowRoot.querySelector('button').click();
    expect(fired).toBe(false);
  });

  it('refleja variant como atributo', async () => {
    const el = track(await mount('ag-atom-button', { variant: 'ghost' }));
    expect(el.getAttribute('variant')).toBe('ghost');
  });

  it('picked refleja en el atributo', async () => {
    const el = track(await mount('ag-atom-button', { variant: 'rate', picked: true }));
    expect(el.hasAttribute('picked')).toBe(true);
  });
});

// ─── ag-atom-input ───────────────────────────────────────────────────────────

describe('ag-atom-input', () => {
  it('renderiza un <input>', async () => {
    const el = track(await mount('ag-atom-input'));
    expect(el.shadowRoot.querySelector('input')).toBeTruthy();
  });

  it('aplica type correctamente', async () => {
    const el = track(await mount('ag-atom-input', { type: 'email' }));
    expect(el.shadowRoot.querySelector('input').type).toBe('email');
  });

  it('aplica placeholder', async () => {
    const el = track(await mount('ag-atom-input', { placeholder: 'tu@correo.com' }));
    expect(el.shadowRoot.querySelector('input').placeholder).toBe('tu@correo.com');
  });

  it('emite ag-input al escribir', async () => {
    const el = track(await mount('ag-atom-input'));
    let detail = null;
    el.addEventListener('ag-input', (e) => { detail = e.detail; });
    const input = el.shadowRoot.querySelector('input');
    input.value = 'hola';
    input.dispatchEvent(new Event('input'));
    expect(detail).toEqual({ value: 'hola' });
  });

  it('emite ag-change al cambiar', async () => {
    const el = track(await mount('ag-atom-input'));
    let detail = null;
    el.addEventListener('ag-change', (e) => { detail = e.detail; });
    const input = el.shadowRoot.querySelector('input');
    input.value = 'test';
    input.dispatchEvent(new Event('change'));
    expect(detail).toEqual({ value: 'test' });
  });

  it('deshabilita el input con disabled', async () => {
    const el = track(await mount('ag-atom-input', { disabled: true }));
    expect(el.shadowRoot.querySelector('input').disabled).toBe(true);
  });

  it('refleja error como atributo', async () => {
    const el = track(await mount('ag-atom-input', { error: true }));
    expect(el.hasAttribute('error')).toBe(true);
  });
});

// ─── ag-atom-select ──────────────────────────────────────────────────────────

describe('ag-atom-select', () => {
  const OPTIONS = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'popular', label: 'Más leídos' },
  ];

  it('renderiza un <select> con las opciones', async () => {
    const el = track(await mount('ag-atom-select', { options: OPTIONS }));
    const opts = el.shadowRoot.querySelectorAll('option');
    expect(opts.length).toBe(2);
    expect(opts[0].value).toBe('recent');
    expect(opts[1].value).toBe('popular');
  });

  it('marca la opción correcta como selected', async () => {
    const el = track(await mount('ag-atom-select', { options: OPTIONS, value: 'popular' }));
    const selected = el.shadowRoot.querySelector('option[selected]');
    // Verificar vía la propiedad .value del select
    expect(el.shadowRoot.querySelector('select').value).toBe('popular');
  });

  it('emite ag-change al seleccionar', async () => {
    const el = track(await mount('ag-atom-select', { options: OPTIONS }));
    let detail = null;
    el.addEventListener('ag-change', (e) => { detail = e.detail; });
    const select = el.shadowRoot.querySelector('select');
    select.value = 'popular';
    select.dispatchEvent(new Event('change'));
    expect(detail).toEqual({ value: 'popular' });
  });

  it('deshabilita el select con disabled', async () => {
    const el = track(await mount('ag-atom-select', { disabled: true }));
    expect(el.shadowRoot.querySelector('select').disabled).toBe(true);
  });
});

// ─── ag-atom-textarea ────────────────────────────────────────────────────────

describe('ag-atom-textarea', () => {
  it('renderiza un <textarea>', async () => {
    const el = track(await mount('ag-atom-textarea'));
    expect(el.shadowRoot.querySelector('textarea')).toBeTruthy();
  });

  it('aplica placeholder', async () => {
    const el = track(await mount('ag-atom-textarea', { placeholder: 'Cuéntame...' }));
    expect(el.shadowRoot.querySelector('textarea').placeholder).toBe('Cuéntame...');
  });

  it('emite ag-input al escribir', async () => {
    const el = track(await mount('ag-atom-textarea'));
    let detail = null;
    el.addEventListener('ag-input', (e) => { detail = e.detail; });
    const ta = el.shadowRoot.querySelector('textarea');
    ta.value = 'hola mundo';
    ta.dispatchEvent(new Event('input'));
    expect(detail).toEqual({ value: 'hola mundo' });
  });

  it('emite ag-change al blur', async () => {
    const el = track(await mount('ag-atom-textarea'));
    let detail = null;
    el.addEventListener('ag-change', (e) => { detail = e.detail; });
    const ta = el.shadowRoot.querySelector('textarea');
    ta.value = 'blur value';
    ta.dispatchEvent(new Event('change'));
    expect(detail).toEqual({ value: 'blur value' });
  });

  it('deshabilita el textarea con disabled', async () => {
    const el = track(await mount('ag-atom-textarea', { disabled: true }));
    expect(el.shadowRoot.querySelector('textarea').disabled).toBe(true);
  });

  it('refleja error como atributo', async () => {
    const el = track(await mount('ag-atom-textarea', { error: true }));
    expect(el.hasAttribute('error')).toBe(true);
  });
});

// ─── ag-atom-chip ────────────────────────────────────────────────────────────

describe('ag-atom-chip', () => {
  it('renderiza variant filter con slot', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'filter' }));
    expect(el.shadowRoot.querySelector('slot')).toBeTruthy();
  });

  it('renderiza variant command con prompt $', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'command', cmd: 'whoami' }));
    expect(el.shadowRoot.querySelector('.prompt').textContent).toBe('$');
  });

  it('emite ag-chip-select al click en variant filter', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'filter', active: false }));
    let detail = null;
    el.addEventListener('ag-chip-select', (e) => { detail = e.detail; });
    el.click();
    expect(detail).toEqual({ variant: 'filter', active: false });
  });

  it('emite ag-chip-command al click en variant command', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'command', cmd: 'skills' }));
    let detail = null;
    el.addEventListener('ag-chip-command', (e) => { detail = e.detail; });
    el.click();
    expect(detail).toEqual({ cmd: 'skills' });
  });

  it('emite el mismo evento con Enter y Space', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'command', cmd: 'help' }));
    let count = 0;
    el.addEventListener('ag-chip-command', () => { count++; });
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(count).toBe(2);
  });

  it('muestra contador con padding en variant filter', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'filter', count: 4 }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('.count').textContent).toBe('04');
  });

  it('establece role=button y tabindex en connectedCallback', async () => {
    const el = track(await mount('ag-atom-chip'));
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('aria-pressed refleja active en variant filter', async () => {
    const el = track(await mount('ag-atom-chip', { variant: 'filter', active: true }));
    await el.updateComplete;
    expect(el.getAttribute('aria-pressed')).toBe('true');
  });
});
