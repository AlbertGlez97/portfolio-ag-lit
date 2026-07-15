import { describe, it, expect, afterEach, vi } from 'vitest';
import '../ag-organism-terminal/ag-organism-terminal.js';

const BASE_PROPS = {
  userInfo: { name: 'Alberto', location: 'CDMX', role: 'Dev', bio_short: 'Full Stack' },
  skills: [{ id: 'Frontend', level: 5, items: ['Lit', 'CSS'] }],
  projects: [{ title: 'Demo', description: 'desc', type: 'app' }],
  socialLinks: [{ id: 'gh', label: 'GitHub', value: 'ag', url: 'https://github.com' }],
  stackItems: [{ label: 'Lit', value: '3.x' }],
  nowItems: ['Leyendo libros'],
  readmeContent: '# Hola\nSoy Alberto',
  neofetchData: { os: 'Arch', kernel: '6.x', shell: 'zsh', editor: 'nvim', cpu: 'M3', memory: '16GB' },
};

async function mountTerminal(props = {}) {
  const el = document.createElement('ag-organism-terminal');
  // Silenciar boot para no esperar delays
  el._runBoot = async () => {};
  for (const [k, v] of Object.entries({ ...BASE_PROPS, ...props })) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; });
const track = (el) => { collected.push(el); return el; };

describe('ag-organism-terminal — estado inicial', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = track(await mountTerminal());
    expect(el.shadowRoot).toBeTruthy();
  });

  it('_commands se construye al montar con props', async () => {
    const el = track(await mountTerminal());
    expect(el._commands).toBeTruthy();
    expect(typeof el._commands.help).toBe('function');
  });

  it('promptUser por defecto es "alberto"', async () => {
    const el = track(await mountTerminal());
    expect(el.promptUser).toBe('alberto');
  });
});

describe('_runCommand — comandos válidos', () => {
  it('help retorna líneas', async () => {
    const el = track(await mountTerminal());
    const before = el._lines.length;
    el._sleep = () => Promise.resolve();
    await el._runCommand('help');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('whoami retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('whoami');
    const htmls = el._lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('Alberto');
  });

  it('skills retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('skills');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('stack retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('stack');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('now retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('now');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('contact retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('contact');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('date retorna líneas con fecha', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('date');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('projects retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('projects');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('neofetch retorna líneas', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('neofetch');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('cat readme.md retorna contenido del readme', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('cat readme.md');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('echo retorna el argumento', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('echo hola test');
    const outLines = el._lines.filter((l) => l.t === 'out');
    const htmls = outLines.map((l) => l.html || '').join('');
    expect(htmls).toContain('hola test');
  });

  it('sudo hire retorna respuesta especial', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('sudo hire');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('ls retorna lista de archivos simulada', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('ls');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('clear vacía _lines', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('help'); // añadir líneas primero
    expect(el._lines.length).toBeGreaterThan(0);
    await el._runCommand('clear');
    expect(el._lines.length).toBe(0);
  });
});

describe('_runCommand — comando no encontrado', () => {
  it('comando desconocido agrega "command not found"', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('xyzcomando123');
    const htmls = el._lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('command not found');
  });

  it('comando vacío no hace nada', async () => {
    const el = track(await mountTerminal());
    const before = el._lines.length;
    await el._runCommand('');
    expect(el._lines.length).toBe(before);
  });

  it('comando solo espacios no hace nada', async () => {
    const el = track(await mountTerminal());
    const before = el._lines.length;
    await el._runCommand('   ');
    expect(el._lines.length).toBe(before);
  });
});

describe('_onKeyDown — historial de comandos', () => {
  it('ArrowUp navega hacia atrás en el historial', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('help');
    await el._runCommand('whoami');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    el._onKeyDown(event);
    expect(el._input).toBe('whoami');
    el._onKeyDown(event);
    expect(el._input).toBe('help');
  });

  it('ArrowDown navega hacia adelante en el historial', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('help');
    await el._runCommand('whoami');
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
    el._onKeyDown(upEvent);
    el._onKeyDown(upEvent);
    el._onKeyDown(downEvent);
    expect(el._input).toBe('whoami');
  });

  it('ArrowDown más allá del final limpia el input', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    await el._runCommand('help');
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
    el._onKeyDown(upEvent);
    el._onKeyDown(downEvent);
    expect(el._input).toBe('');
  });

  it('ArrowUp sin historial no cambia el input', async () => {
    const el = track(await mountTerminal());
    el._input = '';
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
    el._onKeyDown(event);
    expect(el._input).toBe('');
  });
});

describe('_onTermClick — interactividad', () => {
  it('click en elemento no interactivo llama _focusInput', async () => {
    const el = track(await mountTerminal());
    const spy = vi.fn();
    el._focusInput = spy;
    const div = document.createElement('div');
    const event = { composedPath: () => [div, el.shadowRoot, el] };
    el._onTermClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('click en enlace (a) no llama _focusInput', async () => {
    const el = track(await mountTerminal());
    const spy = vi.fn();
    el._focusInput = spy;
    const link = document.createElement('a');
    const event = { composedPath: () => [link, el.shadowRoot, el] };
    el._onTermClick(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('click en button no llama _focusInput', async () => {
    const el = track(await mountTerminal());
    const spy = vi.fn();
    el._focusInput = spy;
    const button = document.createElement('button');
    const event = { composedPath: () => [button, el.shadowRoot, el] };
    el._onTermClick(event);
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('_onGlobalKey — ⌘K / Ctrl+K', () => {
  it('Ctrl+K llama scrollIntoView y focus con delay', async () => {
    const el = track(await mountTerminal());
    const scrollSpy = vi.fn();
    el.scrollIntoView = scrollSpy;
    el._focusInput = vi.fn();
    vi.useFakeTimers();
    const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'k', cancelable: true });
    el._onGlobalKey(event);
    expect(scrollSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('Ctrl+K ignora otros keys', async () => {
    const el = track(await mountTerminal());
    const scrollSpy = vi.fn();
    el.scrollIntoView = scrollSpy;
    const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'x', cancelable: true });
    el._onGlobalKey(event);
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});

describe('propiedad update — reconstruye _commands', () => {
  it('cambiar userInfo actualiza _commands', async () => {
    const el = track(await mountTerminal());
    const oldCommands = el._commands;
    el.userInfo = { name: 'Nuevo', location: 'MTY', role: 'Dev', bio_short: 'x' };
    await el.updateComplete;
    expect(el._commands).not.toBe(oldCommands);
  });
});

describe('_onChipCommand — ejecuta comando de chip', () => {
  it('llama _runCommand con el cmd del detail', async () => {
    const el = track(await mountTerminal());
    el._sleep = () => Promise.resolve();
    const spy = vi.fn().mockResolvedValue(undefined);
    el._runCommand = spy;
    el._focusInput = vi.fn();
    el._onChipCommand({ detail: { cmd: 'whoami' } });
    expect(spy).toHaveBeenCalledWith('whoami');
  });
});

describe('_focusInput — hace focus en el input', () => {
  it('no lanza si el input no existe (renderRoot vacío)', async () => {
    const el = track(await mountTerminal());
    expect(() => el._focusInput()).not.toThrow();
  });
});
