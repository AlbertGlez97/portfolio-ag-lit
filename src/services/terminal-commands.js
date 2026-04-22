import { escapeHtml } from '../utils/escape-html.js';

/**
 * Dibuja una barra de progreso ASCII para el nivel de skill (0–10).
 * @param {number} level
 * @returns {string}
 */
function renderBar(level) {
  const filled = Math.max(0, Math.min(10, Number(level) || 0));
  return '▓'.repeat(filled) + '░'.repeat(10 - filled);
}

/**
 * Alinea una etiqueta a ancho fijo (pad right con espacios).
 * Se usa para que las columnas del output queden alineadas en monoespaciado.
 * @param {string} s
 * @param {number} n
 */
function padEnd(s, n) {
  const str = String(s || '');
  if (str.length >= n) return str;
  return str + ' '.repeat(n - str.length);
}

/**
 * Factory de comandos del terminal. Recibe los datos ya localizados y devuelve
 * un diccionario `{ cmd: handler }`. Cada handler retorna:
 *
 *   { lines: Line[], clear?: boolean, then?: () => void }
 *
 * donde `Line` es:
 *   { t: 'out', html: string }    // output, HTML confiable (via unsafeHTML)
 *   { t: 'spc' }                  // espaciador vertical
 *   { t: 'neofetch', data: object } // render especial del panel neofetch
 *
 * Las propiedades `clear` y `then` son metadata que el organismo interpreta:
 *   - `clear: true`  → vacía el body del terminal
 *   - `then: Fn`     → se ejecuta después de renderizar las lines
 *
 * @param {object} opts
 * @param {object} opts.userInfo - `{ name, location, role, bio_short }`
 * @param {Array} opts.skills - `[{ id, label, level, items: string[] }]`
 * @param {Array} opts.projects - `[{ title, description, type, year }]`
 * @param {Array} opts.socialLinks - `[{ id, label, value, url }]`
 * @param {Array} opts.stackItems - `[{ label, value }]`
 * @param {Array<string>} opts.nowItems - Líneas sueltas del comando now.
 * @param {string} opts.readmeContent - Contenido multilinea del readme.
 * @param {object} opts.neofetchData - `{ os, kernel, wm, shell, terminal, editor, cpu, memory }`
 */
export function buildCommands({
  userInfo = {},
  skills = [],
  projects = [],
  socialLinks = [],
  stackItems = [],
  nowItems = [],
  readmeContent = '',
  neofetchData = {},
}) {
  return {
    help: () => ({
      lines: [
        { t: 'out', html: 'Comandos disponibles:' },
        { t: 'spc' },
        { t: 'out', html: '  <span class="k">whoami</span>   · quién soy en 4 líneas' },
        { t: 'out', html: '  <span class="k">skills</span>   · en qué soy fuerte' },
        { t: 'out', html: '  <span class="k">stack</span>    · mi toolbox actual' },
        { t: 'out', html: '  <span class="k">now</span>      · en qué estoy trabajando' },
        { t: 'out', html: '  <span class="k">projects</span> · trabajo destacado' },
        { t: 'out', html: '  <span class="k">contact</span>  · cómo encontrarme' },
        { t: 'out', html: '  <span class="k">neofetch</span> · info del sistema' },
        { t: 'out', html: '  <span class="k">ls</span>       · contenido del directorio' },
        { t: 'out', html: '  <span class="k">cat readme.md</span> · leer el readme' },
        { t: 'out', html: '  <span class="k">date</span>     · fecha actual' },
        { t: 'out', html: '  <span class="k">echo</span>     · repite lo que escribas' },
        { t: 'out', html: '  <span class="k">clear</span>    · limpiar la terminal' },
        { t: 'out', html: '  <span class="k">sudo hire</span> · ;)' },
      ],
    }),

    whoami: () => {
      const name = escapeHtml(userInfo.name || '');
      const location = escapeHtml(userInfo.location || '');
      const bio = escapeHtml(userInfo.bio_short || '');
      const role = escapeHtml(userInfo.role || '');
      const out = [];
      if (name || location) {
        out.push({
          t: 'out',
          html: `<span class="v">${name}</span>${location ? ` · ${location}` : ''}`,
        });
      }
      if (role) out.push({ t: 'out', html: role });
      if (bio) out.push({ t: 'out', html: bio });
      if (out.length === 0) {
        out.push({ t: 'out', html: '<span class="warn">(sin datos en content.json)</span>' });
      }
      return { lines: out };
    },

    skills: () => ({
      lines: skills.map((s) => {
        const id = escapeHtml(s.id || s.label || '');
        const items = (s.items || []).map(escapeHtml).join(' · ');
        return {
          t: 'out',
          html: `<span class="k">${padEnd(id, 10)}</span>${renderBar(s.level)} ${items}`,
        };
      }),
    }),

    stack: () => ({
      lines: stackItems.map((item) => ({
        t: 'out',
        html: `<span class="k">${padEnd(escapeHtml(item.label || ''), 10)}</span>→ ${escapeHtml(item.value || '')}`,
      })),
    }),

    now: () => ({
      lines: [
        ...nowItems.map((text) => ({
          t: 'out',
          html: `• ${escapeHtml(text)}`,
        })),
        { t: 'spc' },
        { t: 'out', html: 'última actualización: <span class="k">hoy</span>' },
      ],
    }),

    projects: () => ({
      lines: [
        ...projects.slice(0, 5).map((p, i) => {
          const title = escapeHtml(p.title || '');
          const type = escapeHtml(p.type || '');
          return {
            t: 'out',
            html: `${i + 1}. <span class="v">${padEnd(title, 16)}</span><span class="k">·</span> ${type}`,
          };
        }),
        { t: 'spc' },
        { t: 'out', html: 'scroll a la sección <span class="k">proyectos</span> para ver todo →' },
      ],
    }),

    contact: () => ({
      lines: socialLinks.map((link) => {
        const id = escapeHtml(link.id || link.label || '');
        const val = escapeHtml(link.value || link.url || '');
        return {
          t: 'out',
          html: `<span class="k">${padEnd(id, 10)}</span>→ ${val}`,
        };
      }),
    }),

    neofetch: () => ({
      lines: [{ t: 'neofetch', data: neofetchData }],
    }),

    clear: () => ({ clear: true }),

    'sudo hire': () => ({
      lines: [
        { t: 'out', html: '<span class="warn">[sudo]</span> password for <span class="acc">recruiter</span>:' },
        { t: 'out', html: 'authenticating... <span class="k">ok</span>' },
        { t: 'out', html: '→ redirigiendo a <span class="k">#contacto</span> en 3...2...1' },
      ],
      then: () => {
        setTimeout(() => {
          const target = document.getElementById('contacto');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 1200);
      },
    }),

    ls: () => ({
      lines: [
        { t: 'out', html: 'drwxr-xr-x  <span class="k">projects/</span>' },
        { t: 'out', html: 'drwxr-xr-x  <span class="k">laboratorio/</span>' },
        { t: 'out', html: '-rw-r--r--  <span class="v">README.md</span>' },
        { t: 'out', html: '-rw-r--r--  <span class="v">cv.pdf</span>' },
      ],
    }),

    'cat readme.md': () => {
      const content = readmeContent || '';
      const lines = content.split('\n').map((line) => ({
        t: 'out',
        html: line ? escapeHtml(line) : '&nbsp;',
      }));
      if (lines.length === 0) {
        lines.push({ t: 'out', html: '<span class="warn">(readme vacío en content.json)</span>' });
      }
      return { lines };
    },

    date: () => ({
      lines: [{ t: 'out', html: escapeHtml(new Date().toString()) }],
    }),

    echo: (args = []) => ({
      lines: [{ t: 'out', html: escapeHtml(args.join(' ')) }],
    }),
  };
}
