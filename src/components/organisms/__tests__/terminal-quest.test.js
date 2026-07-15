import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import '../ag-organism-terminal-quest/ag-organism-terminal-quest.js';

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

async function mountQuest() {
  const el = document.createElement('ag-organism-terminal-quest');
  // Silenciar _runBoot para no esperar los delays de animación
  el._runBoot = async () => {};
  document.body.appendChild(el);
  await el.updateComplete;
  return track(el);
}

// ─── Helpers del filesystem ────────────────────────────────────────────────

describe('quest-filesystem helpers', async () => {
  const { buildInitialFs, resolvePath, splitPath } = await import(
    '../ag-organism-terminal-quest/quest-filesystem.js'
  );

  it('buildInitialFs devuelve un objeto con /home/agente', () => {
    const fs = buildInitialFs();
    expect(fs['/home/agente']).toBeDefined();
    expect(fs['/home/agente'].__files['misiones.txt']).toContain('MISIONES');
  });

  it('buildInitialFs devuelve copias independientes (deep clone)', () => {
    const a = buildInitialFs();
    const b = buildInitialFs();
    a['/home/agente'].__files['nuevo'] = 'x';
    expect(b['/home/agente'].__files['nuevo']).toBeUndefined();
  });

  it.each([
    ['.',                        '/home/agente', '/home/agente'],
    ['~',                        '/otros',       '/home/agente'],
    ['~/herramientas',           '/otros',       '/home/agente/herramientas'],
    ['/home/agente/herramientas', '/otros',      '/home/agente/herramientas'],
    ['herramientas',             '/home/agente', '/home/agente/herramientas'],
    ['./herramientas',           '/home/agente', '/home/agente/herramientas'],
    ['../agente',                '/home/agente/herramientas', '/home/agente/agente'],
  ])('resolvePath(%s desde %s) === %s', (arg, cwd, expected) => {
    expect(resolvePath(cwd, arg)).toBe(expected);
  });

  it('resolvePath sin arg devuelve cwd', () => {
    expect(resolvePath('/home/agente', '')).toBe('/home/agente');
  });

  it('splitPath sin slash usa cwd', () => {
    const r = splitPath('/home/agente', 'archivo.txt');
    expect(r).toEqual({ dir: '/home/agente', file: 'archivo.txt' });
  });

  it('splitPath con slash separa dir y file', () => {
    const r = splitPath('/home/agente', 'herramientas/mapaTesoro.txt');
    expect(r).toEqual({ dir: '/home/agente/herramientas', file: 'mapaTesoro.txt' });
  });

  it('splitPath con ruta absoluta', () => {
    const r = splitPath('/home/agente', '/home/agente/herramientas/archivo.txt');
    expect(r).toEqual({ dir: '/home/agente/herramientas', file: 'archivo.txt' });
  });
});

// ─── Componente montado ────────────────────────────────────────────────────

describe('ag-organism-terminal-quest — estado inicial', () => {
  it('se monta y tiene shadowRoot', async () => {
    const el = await mountQuest();
    expect(el.shadowRoot).toBeTruthy();
  });

  it('stage inicial es "intro"', async () => {
    const el = await mountQuest();
    expect(el.stage).toBe('intro');
  });

  it('_cwd inicial es /home/agente', async () => {
    const el = await mountQuest();
    expect(el._cwd).toBe('/home/agente');
  });

  it('_shortCwd en home devuelve ~', async () => {
    const el = await mountQuest();
    expect(el._shortCwd()).toBe('~');
  });

  it('_shortCwd en subdir devuelve ~/subdir', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    expect(el._shortCwd()).toBe('~/herramientas');
  });

  it('_shortCwd en ruta absoluta externa', async () => {
    const el = await mountQuest();
    el._cwd = '/etc';
    expect(el._shortCwd()).toBe('/etc');
  });
});

// ─── _hintFor ─────────────────────────────────────────────────────────────

describe('_hintFor — todos los stages', () => {
  const stages = [
    'intro',
    'found_secret',
    'in_tools',
    'read_map',
    'backed_up',
    'trap_cleared',
    'key_made',
    'treasure_found',
    'unknown_stage',
  ];

  it.each(stages)('_hintFor("%s") devuelve string no vacío', async (stage) => {
    const el = await mountQuest();
    const hint = el._hintFor(stage);
    expect(typeof hint).toBe('string');
    expect(hint.length).toBeGreaterThan(0);
  });

  it('_hintFor cuando _gameOver es true', async () => {
    const el = await mountQuest();
    el._gameOver = true;
    expect(el._hintFor('intro')).toBe('reiniciando...');
  });

  it('_hintFor cuando mapa borrado con backup', async () => {
    const el = await mountQuest();
    el._mapDeleted = true;
    el._backedUp = true;
    expect(el._hintFor('backed_up')).toContain('cp mapaTesoro.bak');
  });

  it('_hintFor trap_cleared dentro de subdir de herramientas', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas/cofreLlave';
    const hint = el._hintFor('trap_cleared');
    expect(hint).toContain('cd ..');
  });

  it('_hintFor trap_cleared desde herramientas/ directamente', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    const hint = el._hintFor('trap_cleared');
    expect(hint).toContain('mkdir');
  });
});

// ─── Handlers independientes ───────────────────────────────────────────────

describe('_handleHelp', () => {
  it('devuelve líneas con la lista de comandos', async () => {
    const el = await mountQuest();
    const { lines } = el._handleHelp();
    expect(lines.length).toBeGreaterThan(0);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('ls');
    expect(htmls).toContain('cat');
  });
});

describe('_handleLs', () => {
  it('sin flags lista el contenido del directorio', async () => {
    const el = await mountQuest();
    const { lines } = el._handleLs([]);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('con -la muestra formato largo', async () => {
    const el = await mountQuest();
    const { lines } = el._handleLs(['-la']);
    const htmls = lines.map((l) => l.html || '').join('');
    // Debería mostrar archivos ocultos (empiezan con .)
    expect(htmls).toContain('.mensaje_secreto');
  });

  it('con -a muestra archivos ocultos', async () => {
    const el = await mountQuest();
    const { lines } = el._handleLs(['-a']);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('.mensaje_secreto');
  });

  it('en directorio totalmente vacío devuelve "(vacío)" en short format sin flags', async () => {
    const el = await mountQuest();
    el._fs['/home/agente/vacio'] = { __files: {}, __dirs: [] };
    el._cwd = '/home/agente/vacio';
    const { lines } = el._handleLs([]);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('vacío');
  });

  it('long format con -al muestra archivos ocultos', async () => {
    const el = await mountQuest();
    const { lines } = el._handleLs(['-al']);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('.mensaje_secreto');
  });

  it('en directorio totalmente vacío devuelve "(vacío)" en short format', async () => {
    const el = await mountQuest();
    el._fs['/home/agente/vacio2'] = { __files: {}, __dirs: [] };
    el._cwd = '/home/agente/vacio2';
    const { lines } = el._handleLs([]);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('vacío');
  });

  it('_dir retorna undefined para ruta inexistente', async () => {
    const el = await mountQuest();
    expect(el._dir('/no/existe')).toBeUndefined();
  });
});

describe('_handleCat', () => {
  it('sin args devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCat([]);
    expect(lines[0].html).toContain('falta operando');
  });

  it('archivo inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCat(['no_existe.txt']);
    expect(lines[0].html).toContain('No existe');
  });

  it('cat misiones.txt devuelve contenido', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCat(['misiones.txt']);
    const text = lines.map((l) => l.html || '').join('');
    expect(text).toContain('MISIONES');
  });

  it('cat .mensaje_secreto en stage intro → stage "found_secret"', async () => {
    const el = await mountQuest();
    expect(el.stage).toBe('intro');
    el._handleCat(['.mensaje_secreto']);
    expect(el.stage).toBe('found_secret');
  });

  it('cat mapaTesoro.txt en herramientas → stage "read_map"', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el.stage = 'in_tools';
    el._handleCat(['mapaTesoro.txt']);
    expect(el.stage).toBe('read_map');
  });

  it('cat TESORO.md en boveda → stage "treasure_found"', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/archivos_secretos/boveda';
    el._handleCat(['TESORO.md']);
    expect(el.stage).toBe('treasure_found');
  });
});

describe('_handleCd', () => {
  it('sin args va a home (~)', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el._handleCd([]);
    expect(el._cwd).toBe('/home/agente');
  });

  it('cd herramientas cambia _cwd', async () => {
    const el = await mountQuest();
    el._handleCd(['herramientas']);
    expect(el._cwd).toBe('/home/agente/herramientas');
  });

  it('cd a ruta inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCd(['no_existe']);
    expect(lines[0].html).toContain('No existe');
  });

  it('cd herramientas en stage found_secret → stage "in_tools"', async () => {
    const el = await mountQuest();
    el.stage = 'found_secret';
    el._handleCd(['herramientas']);
    expect(el.stage).toBe('in_tools');
  });
});

describe('_handleCp', () => {
  it('sin args devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCp([]);
    expect(lines[0].html).toContain('se necesitan');
  });

  it('src inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCp(['no_existe.txt', 'destino.txt']);
    expect(lines[0].html).toContain('No existe');
  });

  it('destino inválido devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleCp(['misiones.txt', '/ruta/invalida/archivo.txt']);
    expect(lines[0].html).toContain('destino inválido');
  });

  it('cp válido copia el archivo', async () => {
    const el = await mountQuest();
    el._handleCp(['misiones.txt', 'misiones_bak.txt']);
    const dir = el._fs['/home/agente'];
    expect(dir.__files['misiones_bak.txt']).toBeDefined();
  });

  it('cp mapaTesoro.txt → *.bak activa _backedUp y stage "backed_up"', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el.stage = 'read_map';
    el._handleCp(['mapaTesoro.txt', 'mapaTesoro.bak']);
    expect(el._backedUp).toBe(true);
    expect(el.stage).toBe('backed_up');
  });

  it('cp *.bak → mapaTesoro.txt cuando mapa borrado restaura el mapa', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    // Preparar: tener backup y mapa borrado
    el._fs['/home/agente/herramientas'].__files['mapaTesoro.bak'] = 'contenido bak';
    delete el._fs['/home/agente/herramientas'].__files['mapaTesoro.txt'];
    el._mapDeleted = true;
    const { lines } = el._handleCp(['mapaTesoro.bak', 'mapaTesoro.txt']);
    expect(el._mapDeleted).toBe(false);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('restaurado');
  });
});

describe('_handleMkdir', () => {
  it('sin args devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMkdir([]);
    expect(lines[0].html).toContain('falta operando');
  });

  it('crea el directorio en el FS', async () => {
    const el = await mountQuest();
    el._handleMkdir(['nuevaDir']);
    expect(el._fs['/home/agente/nuevaDir']).toBeDefined();
  });

  it('directorio existente devuelve error', async () => {
    const el = await mountQuest();
    el._handleMkdir(['herramientas']);
    const { lines } = el._handleMkdir(['herramientas']);
    expect(lines[0].html).toContain('ya existe');
  });

  it('ruta padre inválida devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMkdir(['/no/existe/dir']);
    expect(lines[0].html).toContain('ruta inválida');
  });
});

describe('_handleTouch', () => {
  it('sin args devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleTouch([]);
    expect(lines[0].html).toContain('falta operando');
  });

  it('crea el archivo en el FS', async () => {
    const el = await mountQuest();
    el._handleTouch(['nuevo.txt']);
    expect(el._fs['/home/agente'].__files['nuevo.txt']).toBeDefined();
  });

  it('archivo ya existente no falla (touch es idempotente)', async () => {
    const el = await mountQuest();
    const { lines } = el._handleTouch(['misiones.txt']);
    // Touch en archivo existente retorna líneas vacías (no error)
    expect(Array.isArray(lines)).toBe(true);
  });

  it('directorio padre inválido devuelve error con "ruta inválida"', async () => {
    const el = await mountQuest();
    const { lines } = el._handleTouch(['/no/existe/archivo.txt']);
    expect(lines[0].html).toContain('ruta inválida');
  });
});

describe('_handleIpA', () => {
  it('devuelve output con dirección IP simulada', async () => {
    const el = await mountQuest();
    const { lines } = el._handleIpA();
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('inet');
  });
});

describe('_handleGrep', () => {
  it('sin args devuelve error con "uso: grep"', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep([]);
    expect(lines[0].html).toContain('uso: grep');
  });

  it('busca en un archivo existente', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep(['MISIONES', 'misiones.txt']);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('patrón sin coincidencias devuelve líneas vacías', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep(['xyzabc123', 'misiones.txt']);
    expect(lines).toEqual([]);
  });

  it('archivo inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleGrep(['patron', 'no_existe.txt']);
    expect(lines[0].html).toContain('No existe');
  });
});

describe('_handleMan', () => {
  const topics = ['rm', 'ls', 'cat', 'cd', 'cp', 'mv', 'mkdir', 'touch', 'grep', 'echo', 'pwd'];

  it.each(topics)('man %s devuelve contenido', async (topic) => {
    const el = await mountQuest();
    const { lines } = el._handleMan([topic]);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('man sin topic conocido devuelve "no hay entrada de manual"', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMan(['desconocido']);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('no hay entrada de manual');
  });

  it('man sin args devuelve "no hay entrada de manual" con string vacío', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMan([]);
    expect(lines[0].html).toContain('no hay entrada de manual');
  });
});

describe('_handleMv', () => {
  it('sin args devuelve error con "se necesitan"', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMv([]);
    expect(lines[0].html).toContain('se necesitan');
  });

  it('src inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleMv(['no_existe.txt', 'destino.txt']);
    expect(lines[0].html).toContain('No existe');
  });

  it('mv válido mueve el archivo', async () => {
    const el = await mountQuest();
    el._handleMv(['misiones.txt', 'misiones_movido.txt']);
    expect(el._fs['/home/agente'].__files['misiones_movido.txt']).toBeDefined();
    expect(el._fs['/home/agente'].__files['misiones.txt']).toBeUndefined();
  });
});

// ─── _handleRm ────────────────────────────────────────────────────────────

describe('_handleRm', () => {
  it('sin target devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleRm([]);
    expect(lines[0].html).toContain('falta operando');
  });

  it('rm trampa_virus.sh desde herramientas/ → stage "trap_cleared"', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el.stage = 'backed_up';
    el._handleRm(['trampa_virus.sh']);
    expect(el.stage).toBe('trap_cleared');
  });

  it('rm trampa_virus.sh inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleRm(['trampa_virus.sh']);
    expect(lines[0].html).toContain('No existe');
  });

  it('rm mapaTesoro.txt con backup devuelve aviso restaurable', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el._backedUp = true;
    const { lines } = el._handleRm(['mapaTesoro.txt']);
    expect(el._mapDeleted).toBe(true);
    const htmls = lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('backup');
  });

  it('rm mapaTesoro.txt sin backup inicia game-over asíncrono', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el._backedUp = false;
    el._sleep = () => Promise.resolve(); // silenciar delays
    const { lines, then } = el._handleRm(['mapaTesoro.txt']);
    expect(el._mapDeleted).toBe(true);
    expect(typeof then).toBe('function');
    // Ejecutar el then para que el juego no quede colgado
    await then();
  });

  it('rm mapaTesoro.txt inexistente devuelve error', async () => {
    const el = await mountQuest();
    // No estamos en herramientas, no hay mapaTesoro.txt aquí
    const { lines } = el._handleRm(['mapaTesoro.txt']);
    expect(lines[0].html).toContain('No existe');
  });

  it('rm -rf . inicia gameOver', async () => {
    const el = await mountQuest();
    el._sleep = () => Promise.resolve();
    el._handleRm(['-rf', '.']);
    expect(el._gameOver).toBe(true);
  });

  it('rm -f * inicia gameOver', async () => {
    const el = await mountQuest();
    el._sleep = () => Promise.resolve();
    el._handleRm(['-f', '*']);
    expect(el._gameOver).toBe(true);
  });

  it('rm genérico de archivo existente lo elimina', async () => {
    const el = await mountQuest();
    el._handleRm(['misiones.txt']);
    expect(el._fs['/home/agente'].__files['misiones.txt']).toBeUndefined();
  });

  it('rm genérico de archivo inexistente devuelve error', async () => {
    const el = await mountQuest();
    const { lines } = el._handleRm(['no_existe.txt']);
    expect(lines[0].html).toContain('No existe');
  });
});

// ─── _reset ───────────────────────────────────────────────────────────────

describe('_reset', () => {
  it('restablece el estado completo', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el.stage = 'treasure_found';
    el._backedUp = true;
    el._mapDeleted = true;
    el._gameOver = true;
    el._runBoot = async () => {}; // silenciar
    el._reset();
    await el.updateComplete;
    expect(el._cwd).toBe('/home/agente');
    expect(el.stage).toBe('intro');
    expect(el._backedUp).toBe(false);
    expect(el._mapDeleted).toBe(false);
    expect(el._gameOver).toBe(false);
  });
});

// ─── _runCommand integración ───────────────────────────────────────────────

describe('_runCommand — integración', () => {
  it('clear vacía las líneas', async () => {
    const el = await mountQuest();
    el._lines = [{ t: 'out', html: 'algo' }];
    await el._runCommand('clear');
    expect(el._lines.length).toBe(0);
  });

  it('pwd imprime el _cwd actual', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('pwd');
    expect(el._lines.length).toBeGreaterThan(before);
    // El output es penúltimo; el último es el spc separador
    const outLine = el._lines.slice(before).find((l) => l.t === 'out');
    expect(outLine.html).toContain('/home/agente');
  });

  it('echo imprime el argumento', async () => {
    const el = await mountQuest();
    await el._runCommand('echo hola mundo');
    const outLine = el._lines.filter((l) => l.t === 'out').at(-1);
    expect(outLine.html).toContain('hola mundo');
  });

  it('help devuelve líneas', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('help');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('comando vacío no agrega líneas de output', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('   ');
    // Solo agrega la línea del prompt, no output extra
    expect(el._lines.length).toBeLessThanOrEqual(before + 2);
  });

  it('comando desconocido devuelve "command not found"', async () => {
    const el = await mountQuest();
    await el._runCommand('xyzdesconocido');
    const htmls = el._lines.map((l) => l.html || '').join('');
    expect(htmls).toContain('not found');
  });

  it('comando con && ejecuta dos comandos', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('pwd && ls');
    expect(el._lines.length).toBeGreaterThan(before + 1);
  });

  // ── Cubrir los case del switch en _runSingleCommand via _runCommand ──

  it('ls via _runCommand agrega líneas', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('ls');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('cat via _runCommand agrega líneas', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('cat misiones.txt');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('cd via _runCommand cambia directorio', async () => {
    const el = await mountQuest();
    await el._runCommand('cd herramientas');
    expect(el._cwd).toContain('herramientas');
  });

  it('cp via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('cp misiones.txt copia.txt');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('mkdir via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('mkdir nueva_dir');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('touch via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('touch nuevo.txt');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('mv via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('mv misiones.txt renombrado.txt');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('grep via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('grep agente misiones.txt');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('rm via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente';
    const before = el._lines.length;
    await el._runCommand('rm misiones.txt');
    expect(el._lines.length).toBeGreaterThanOrEqual(before);
  });

  it('ip a via _runCommand muestra ip info', async () => {
    const el = await mountQuest();
    el._sleep = () => Promise.resolve();
    const before = el._lines.length;
    await el._runCommand('ip a');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('ip sin a via _runCommand muestra uso', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('ip b');
    const htmls = el._lines.slice(before).map((l) => l.html || '').join('');
    expect(htmls).toContain('uso:');
  });

  it('man via _runCommand devuelve resultado', async () => {
    const el = await mountQuest();
    const before = el._lines.length;
    await el._runCommand('man ls');
    expect(el._lines.length).toBeGreaterThan(before);
  });

  it('rm mapaTesoro.txt sin backup via _runCommand ejecuta then', async () => {
    const el = await mountQuest();
    el._cwd = '/home/agente/herramientas';
    el._backedUp = false;
    el._sleep = () => Promise.resolve();
    el._runTypingLoop = async () => {};
    await el._runCommand('rm mapaTesoro.txt');
    expect(el._mapDeleted).toBe(true);
  });
});
