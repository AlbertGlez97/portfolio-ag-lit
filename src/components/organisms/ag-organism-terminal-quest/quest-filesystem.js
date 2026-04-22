/**
 * quest-filesystem.js — FS simulado + helpers de ruta para ag-organism-terminal-quest.
 *
 * El FS es un objeto plano indexado por ruta absoluta. Cada nodo-directorio
 * tiene `__files` (map de nombre → contenido string) y `__dirs` (array de
 * subdirectorios inmediatos). Los subdirs se materializan como sus propias
 * claves en el mismo objeto raíz — es más simple que un árbol anidado y el
 * lookup por ruta es O(1).
 *
 * `buildInitialFs()` devuelve un deep clone para que cada partida mute sin
 * tocar el template. Se llama en el `connectedCallback` y después de cada
 * reset tras un game over.
 */

export const INITIAL_FS = {
  '/home/agente': {
    __files: {
      '.mensaje_secreto':
        'Agente,\n' +
        'Si estás leyendo esto, encontraste el primer secreto.\n' +
        'Ve a herramientas/ y busca el mapa.\n' +
        'Pero cuidado — ahí adentro hay una trampa.\n' +
        '— El dev anterior',
      'misiones.txt':
        'MISIONES ACTIVAS\n' +
        '================\n' +
        '[ ] 1. Encontrar el mapa\n' +
        '[ ] 2. Seguir las instrucciones\n' +
        '[ ] 3. Llegar al tesoro SIN destruir nada\n' +
        '\n' +
        'Tip: escribe "help" si te pierdes.',
    },
    __dirs: ['herramientas', 'archivos_secretos'],
  },
  '/home/agente/herramientas': {
    __files: {
      'mapaTesoro.txt':
        'MAPA DEL TESORO\n' +
        '================\n' +
        '\n' +
        'El cofre está en:\n' +
        '  /home/agente/archivos_secretos/boveda\n' +
        '\n' +
        'Para abrirlo necesitas una llave_maestra.key\n' +
        '\n' +
        'Pasos:\n' +
        '  1. mkdir cofreLlave\n' +
        '  2. touch cofreLlave/llave_maestra.key\n' +
        '  3. cd a la bóveda y cat TESORO.md\n' +
        '\n' +
        'PERO ANTES: elimina trampa_virus.sh con rm.\n' +
        '\n' +
        'Y primero: haz un backup del mapa.\n' +
        '  cp mapaTesoro.txt mapaTesoro.bak\n' +
        '\n' +
        'Un buen agente nunca opera sin backup.',
      'trampa_virus.sh':
        '#!/bin/bash\n' +
        '# No ejecutar. No tocar. No mirar.\n' +
        'echo "jajaja ya es tarde"\n' +
        'rm -rf /',
    },
    __dirs: [],
  },
  '/home/agente/archivos_secretos': {
    __files: {},
    __dirs: ['boveda'],
  },
  '/home/agente/archivos_secretos/boveda': {
    __files: {
      'TESORO.md':
        '┌──────────────────────────────┐\n' +
        '│    TESORO ENCONTRADO    ★    │\n' +
        '└──────────────────────────────┘\n' +
        '\n' +
        'Felicitaciones, agente.\n' +
        'Lo lograste sin destruir nada.\n' +
        '\n' +
        'Moraleja:\n' +
        '  rm con flags -rf es un arma de guerra.\n' +
        '  Úsalo con cuidado, y siempre con backup.\n' +
        '\n' +
        'Moraleja 2:\n' +
        '  Lee el archivo antes de borrarlo.\n' +
        '  Lee DOS veces lo que va después del rm.',
    },
    __dirs: [],
  },
};

/**
 * Devuelve una copia profunda del FS inicial. Usar en connect y en reset.
 * @returns {object}
 */
export function buildInitialFs() {
  return JSON.parse(JSON.stringify(INITIAL_FS));
}

/**
 * Normaliza una ruta absoluta resolviendo `.` y `..`.
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  const parts = path.split('/').filter(Boolean);
  const out = [];
  for (const p of parts) {
    if (p === '.') continue;
    if (p === '..') out.pop();
    else out.push(p);
  }
  return '/' + out.join('/');
}

/**
 * Resuelve un argumento de ruta contra un cwd. Soporta absoluto, relativo y `~`.
 * @param {string} cwd
 * @param {string} arg
 * @returns {string}
 */
export function resolvePath(cwd, arg) {
  if (!arg || arg === '.') return cwd;
  if (arg === '~') return '/home/agente';
  if (arg.startsWith('~/')) return normalizePath('/home/agente/' + arg.slice(2));
  if (arg.startsWith('/')) return normalizePath(arg);
  return normalizePath(cwd + '/' + arg);
}

/**
 * Separa un argumento tipo `dir/file` en `{ dir, file }` (ambos resueltos
 * contra el cwd). Si no hay `/`, `dir === cwd` y `file === arg`.
 * @param {string} cwd
 * @param {string} arg
 * @returns {{ dir: string, file: string }}
 */
export function splitPath(cwd, arg) {
  if (!arg.includes('/')) return { dir: cwd, file: arg };
  const idx = arg.lastIndexOf('/');
  const dirPart = arg.slice(0, idx) || '/';
  const file = arg.slice(idx + 1);
  return { dir: resolvePath(cwd, dirPart), file };
}
