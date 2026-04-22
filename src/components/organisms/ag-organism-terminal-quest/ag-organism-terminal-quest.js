import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styles } from './ag-organism-terminal-quest.styles.js';
import { buildInitialFs, resolvePath, splitPath } from './quest-filesystem.js';
import { escapeHtml } from '../../../utils/escape-html.js';
import '../../atoms/ag-atom-caret/ag-atom-caret.js';

/**
 * <ag-organism-terminal-quest> — Terminal interactiva embebida en artículos.
 *
 * Quest con estados, FS simulado y tres desenlaces para `rm`:
 *   1. `rm trampa_virus.sh` → limpia la trampa (camino correcto).
 *   2. `rm -rf .` / `rm -f *` → game over dramático con reset total.
 *   3. `rm mapaTesoro.txt` → depende de `_backedUp`: si hay backup, el user
 *      puede recuperar con `cp mapaTesoro.bak mapaTesoro.txt`; si no, game
 *      over.
 *
 * El FS arranca desde `buildInitialFs()` (deep clone de INITIAL_FS en
 * quest-filesystem.js). Mutaciones van al `_fs` interno — reset rebuild.
 *
 * Stages (`_stage`): `intro` → `found_secret` → `in_tools` → `read_map` →
 * `backed_up` → `trap_cleared` → `key_made` → `treasure_found`. Cada stage
 * dispara un hint distinto debajo del input.
 *
 * El componente emite `stage-change` cuando cambia `stage` (si la page
 * quiere reaccionar al progreso desde afuera).
 *
 * Comandos soportados:
 *   help, pwd, ls, ls -la, cat, cd, cp, mkdir, touch, mv, grep, rm, ip a,
 *   man, echo, clear.
 *
 * Patrón de input: mirror (input nativo invisible + span visible con caret).
 * Mismo patrón que `ag-organism-terminal` — se vale de `ag-atom-caret`
 * variant="terminal".
 *
 * @fires stage-change - Detail: `{ stage: string }`
 *
 * @property {String} stage - Stage actual del quest. Reflecting.
 *
 * @example
 *   <ag-organism-terminal-quest></ag-organism-terminal-quest>
 */
class AgOrganismTerminalQuest extends LitElement {
  static properties = {
    stage: { type: String, reflect: true },
    _cwd: { state: true },
    _lines: { state: true },
    _input: { state: true },
    _fs: { state: true },
    _backedUp: { state: true },
    _mapDeleted: { state: true },
    _gameOver: { state: true },
    _keyMoved: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.stage = 'intro';
    this._cwd = '/home/agente';
    this._lines = [];
    this._input = '';
    this._fs = buildInitialFs();
    this._backedUp = false;
    this._mapDeleted = false;
    this._gameOver = false;
    this._keyMoved = false;
    this._history = [];
    this._historyIdx = 0;
    this._createdDirs = [];
    this._createdFiles = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this._runBoot();
  }

  updated(changed) {
    if (changed.has('_gameOver')) {
      this.classList.toggle('game-over', this._gameOver);
    }
    if (changed.has('stage')) {
      this.dispatchEvent(
        new CustomEvent('stage-change', {
          detail: { stage: this.stage },
          bubbles: true,
          composed: true,
        })
      );
    }
    if (changed.has('_lines')) {
      this._scrollToBottom();
    }
  }

  _scrollToBottom() {
    const body = this.renderRoot?.querySelector('.term-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  _sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  _appendLine(line) {
    this._lines = [...this._lines, line];
  }

  // ---------- Boot ----------
  async _runBoot() {
    this._appendLine({ t: 'out', html: '<span class="k">SISTEMA INICIADO</span>' });
    await this._sleep(180);
    this._appendLine({ t: 'out', html: `<span class="dim">ubicación:</span> ${this._cwd}` });
    await this._sleep(120);
    this._appendLine({
      t: 'out',
      html: '<span class="dim">misión:</span> encontrar el tesoro sin destruir nada.',
    });
    await this._sleep(200);
    this._appendLine({ t: 'spc' });
    this._appendLine({
      t: 'out',
      html:
        'escribe <span class="k">ls -la</span> para ver qué hay · ' +
        '<span class="k">help</span> para ayuda contextual',
    });
    this._appendLine({ t: 'spc' });
  }

  // ---------- Input handling ----------
  _onTermClick() {
    const input = this.renderRoot?.querySelector('.term-native');
    if (input) input.focus();
  }

  _onInput(e) {
    this._input = e.target.value;
  }

  _onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this._historyIdx > 0) {
        this._historyIdx--;
        this._input = this._history[this._historyIdx] ?? '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this._historyIdx < this._history.length - 1) {
        this._historyIdx++;
        this._input = this._history[this._historyIdx] ?? '';
      } else {
        this._historyIdx = this._history.length;
        this._input = '';
      }
    }
  }

  async _onSubmit(e) {
    e.preventDefault();
    const raw = this._input;
    this._input = '';
    if (!raw.trim()) return;
    await this._runCommand(raw);
  }

  async _runCommand(raw) {
    const trimmed = raw.trim();
    // Snapshot del cwd ANTES de ejecutar — para que el historial muestre la ruta correcta
    this._appendLine({ t: 'cmd', text: trimmed, cwd: this._shortCwd() });
    this._history = [...this._history, trimmed];
    this._historyIdx = this._history.length;

    if (this._gameOver) return;

    // Soporte básico de && — ejecuta cada sub-comando en secuencia
    const subCmds = trimmed.split(/\s*&&\s*/);
    if (subCmds.length > 1) {
      for (const sub of subCmds) {
        await this._runSingleCommand(sub.trim());
      }
      return;
    }

    await this._runSingleCommand(trimmed);
  }

  /** Ejecuta un único comando (sin &&). Usado por _runCommand y por el parser de &&. */
  async _runSingleCommand(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1);
    if (!cmd) return;

    let result;
    switch (cmd) {
      case 'help':
        result = this._handleHelp();
        break;
      case 'pwd':
        result = { lines: [{ t: 'out', html: escapeHtml(this._cwd) }] };
        break;
      case 'ls':
        result = this._handleLs(args);
        break;
      case 'cat':
        result = this._handleCat(args);
        break;
      case 'cd':
        result = this._handleCd(args);
        break;
      case 'cp':
        result = this._handleCp(args);
        break;
      case 'mkdir':
        result = this._handleMkdir(args);
        break;
      case 'touch':
        result = this._handleTouch(args);
        break;
      case 'mv':
        result = this._handleMv(args);
        break;
      case 'grep':
        result = this._handleGrep(args);
        break;
      case 'rm':
        result = this._handleRm(args);
        break;
      case 'ip':
        result = args[0] === 'a'
          ? this._handleIpA()
          : { lines: [{ t: 'out', html: 'uso: <span class="k">ip a</span>' }] };
        break;
      case 'man':
        result = this._handleMan(args);
        break;
      case 'echo':
        result = { lines: [{ t: 'out', html: escapeHtml(args.join(' ')) }] };
        break;
      case 'clear':
        this._lines = [];
        return;
      default:
        result = {
          lines: [
            {
              t: 'out',
              html: `<span class="warn">zsh: command not found:</span> ${escapeHtml(cmd)}`,
            },
          ],
        };
    }

    for (const line of result.lines || []) {
      this._appendLine(line);
      await this._sleep(15);
    }
    this._appendLine({ t: 'spc' });

    if (typeof result.then === 'function') {
      await result.then();
    }
  }

  // ---------- Helpers FS ----------
  _dir(path) {
    return this._fs[path];
  }
  _touchFs() {
    // fuerza reactivity en estado profundo
    this._fs = { ...this._fs };
  }

  // ---------- Commands ----------
  _handleHelp() {
    return {
      lines: [
        { t: 'out', html: '<span class="k">Comandos disponibles:</span>' },
        { t: 'spc' },
        {
          t: 'out',
          html:
            'ls · ls -la · cat · cd · pwd · cp · mv · mkdir · touch · rm · grep · echo · clear · man · ip a',
        },
        { t: 'spc' },
        { t: 'out', html: `<span class="k">Pista:</span> ${escapeHtml(this._hintFor(this.stage))}` },
      ],
    };
  }

  _handleLs(args) {
    const longFormat = args.includes('-la') || args.includes('-al') || args.includes('-l');
    const showAll   = longFormat || args.includes('-a');
    const dir = this._dir(this._cwd);
    if (!dir) return { lines: [{ t: 'out', html: '' }] };

    const files = Object.keys(dir.__files || {})
      .filter((f) => showAll || !f.startsWith('.'))
      .sort();
    const dirs = (dir.__dirs || []).slice().sort();

    if (longFormat) {
      // Una entrada por línea, estilo `ls -la`
      const lines = [];
      if (showAll) {
        lines.push({ t: 'out', html: '<span class="path">./</span>  <span class="dim">(directorio actual)</span>' });
        lines.push({ t: 'out', html: '<span class="path">../</span> <span class="dim">(directorio padre)</span>' });
      }
      for (const d of dirs) {
        lines.push({ t: 'out', html: `<span class="path">${escapeHtml(d)}/</span>` });
      }
      for (const f of files) {
        const hidden = f.startsWith('.') ? '<span class="warn">·</span> ' : '  ';
        lines.push({ t: 'out', html: `${hidden}${escapeHtml(f)}` });
      }
      if (lines.length === 0) return { lines: [{ t: 'out', html: '<span class="dim">(vacío)</span>' }] };
      return { lines };
    }

    // Sin -l: mostrar en fila horizontal separada por espacios
    const items = [];
    for (const d of dirs) items.push(`<span class="path">${escapeHtml(d)}/</span>`);
    for (const f of files) items.push(escapeHtml(f));
    if (items.length === 0) return { lines: [{ t: 'out', html: '<span class="dim">(vacío)</span>' }] };
    return { lines: [{ t: 'out', html: items.join('  ') }] };
  }

  _handleCat(args) {
    const file = args[0];
    if (!file) {
      return { lines: [{ t: 'out', html: 'cat: falta operando' }] };
    }
    const dir = this._dir(this._cwd);
    const content = dir?.__files?.[file];
    if (content === undefined) {
      return {
        lines: [
          { t: 'out', html: `cat: ${escapeHtml(file)}: No existe el archivo o directorio` },
        ],
      };
    }

    // Stage transitions
    if (file === '.mensaje_secreto' && this.stage === 'intro') {
      this.stage = 'found_secret';
    }
    if (file === 'mapaTesoro.txt' && this._cwd === '/home/agente/herramientas') {
      if (this.stage === 'in_tools' || this.stage === 'found_secret') {
        this.stage = 'read_map';
      }
    }
    if (file === 'TESORO.md' && this._cwd === '/home/agente/archivos_secretos/boveda') {
      this.stage = 'treasure_found';
    }

    const lines = content.split('\n').map((l) => ({
      t: 'out',
      html: l === '' ? '&nbsp;' : escapeHtml(l),
    }));
    return { lines };
  }

  _handleCd(args) {
    const target = args[0] ?? '~';
    const newPath = resolvePath(this._cwd, target);
    if (!this._fs[newPath]) {
      return {
        lines: [
          { t: 'out', html: `cd: ${escapeHtml(target)}: No existe el archivo o directorio` },
        ],
      };
    }
    this._cwd = newPath;

    if (newPath === '/home/agente/herramientas' && this.stage === 'found_secret') {
      this.stage = 'in_tools';
    }
    return { lines: [] };
  }

  _handleCp(args) {
    const [src, dst] = args;
    if (!src || !dst) {
      return { lines: [{ t: 'out', html: 'cp: se necesitan src y dst' }] };
    }
    const srcSplit = splitPath(this._cwd, src);
    const srcDir = this._dir(srcSplit.dir);
    const srcContent = srcDir?.__files?.[srcSplit.file];
    if (srcContent === undefined) {
      return {
        lines: [
          { t: 'out', html: `cp: ${escapeHtml(src)}: No existe el archivo o directorio` },
        ],
      };
    }
    const dstSplit = splitPath(this._cwd, dst);
    const dstDir = this._dir(dstSplit.dir);
    if (!dstDir) {
      return { lines: [{ t: 'out', html: `cp: ${escapeHtml(dst)}: destino inválido` }] };
    }
    if (!dstDir.__files) dstDir.__files = {};
    dstDir.__files[dstSplit.file] = srcContent;
    this._touchFs();

    // Detectar backup del mapa
    if (srcSplit.file === 'mapaTesoro.txt' && dstSplit.file.includes('bak')) {
      this._backedUp = true;
      if (this.stage === 'read_map') this.stage = 'backed_up';
    }

    // Recuperación del mapa
    if (this._mapDeleted && srcSplit.file.includes('bak') && dstSplit.file === 'mapaTesoro.txt') {
      this._mapDeleted = false;
      return {
        lines: [
          { t: 'out', html: `'${escapeHtml(src)}' -> '${escapeHtml(dst)}'` },
          { t: 'spc' },
          {
            t: 'out',
            html:
              '<span class="k">✓ Mapa restaurado.</span> Tu backup te salvó. Lección aprendida.',
          },
        ],
      };
    }

    return {
      lines: [{ t: 'out', html: `'${escapeHtml(src)}' -> '${escapeHtml(dst)}'` }],
    };
  }

  _handleMkdir(args) {
    const name = args[0];
    if (!name) return { lines: [{ t: 'out', html: 'mkdir: falta operando' }] };

    const { dir: parentPath, file: dirName } = splitPath(this._cwd, name);
    const parent = this._dir(parentPath);
    if (!parent) {
      return {
        lines: [
          { t: 'out', html: `mkdir: no se puede crear '${escapeHtml(name)}': ruta inválida` },
        ],
      };
    }
    const newPath = parentPath === '/' ? `/${dirName}` : `${parentPath}/${dirName}`;
    if (this._fs[newPath]) {
      return {
        lines: [{ t: 'out', html: `mkdir: '${escapeHtml(name)}': ya existe` }],
      };
    }
    if (!parent.__dirs) parent.__dirs = [];
    if (!parent.__dirs.includes(dirName)) parent.__dirs.push(dirName);
    this._fs[newPath] = { __files: {}, __dirs: [] };
    this._createdDirs = [...this._createdDirs, newPath];
    this._touchFs();
    return { lines: [] };
  }

  _handleTouch(args) {
    const name = args[0];
    if (!name) return { lines: [{ t: 'out', html: 'touch: falta operando' }] };

    const { dir: parentPath, file: fileName } = splitPath(this._cwd, name);
    const parent = this._dir(parentPath);
    if (!parent) {
      return {
        lines: [
          { t: 'out', html: `touch: no se puede crear '${escapeHtml(name)}': ruta inválida` },
        ],
      };
    }
    if (!parent.__files) parent.__files = {};
    if (!(fileName in parent.__files)) {
      parent.__files[fileName] = '';
      this._createdFiles = [...this._createdFiles, `${parentPath}/${fileName}`];
    }
    this._touchFs();

    if (fileName === 'llave_maestra.key' && this.stage === 'trap_cleared') {
      this.stage = 'key_made';
    }
    return { lines: [] };
  }

  _handleMv(args) {
    const [src, dst] = args;
    if (!src || !dst) {
      return { lines: [{ t: 'out', html: 'mv: se necesitan src y dst' }] };
    }
    const srcSplit = splitPath(this._cwd, src);
    const srcDir = this._dir(srcSplit.dir);
    const content = srcDir?.__files?.[srcSplit.file];
    if (content === undefined) {
      return {
        lines: [
          { t: 'out', html: `mv: ${escapeHtml(src)}: No existe el archivo o directorio` },
        ],
      };
    }
    const dstSplit = splitPath(this._cwd, dst);
    const dstDir = this._dir(dstSplit.dir);
    if (!dstDir) {
      return { lines: [{ t: 'out', html: `mv: ${escapeHtml(dst)}: destino inválido` }] };
    }
    delete srcDir.__files[srcSplit.file];
    if (!dstDir.__files) dstDir.__files = {};
    dstDir.__files[dstSplit.file] = content;
    this._touchFs();

    if (srcSplit.file === 'llave_maestra.key') {
      this._keyMoved = true;
    }
    return {
      lines: [{ t: 'out', html: `'${escapeHtml(src)}' -> '${escapeHtml(dst)}'` }],
    };
  }

  _handleGrep(args) {
    let pattern = args[0];
    const file = args[1];
    if (!pattern || !file) {
      return { lines: [{ t: 'out', html: 'uso: grep "patrón" archivo' }] };
    }
    if (
      (pattern.startsWith('"') && pattern.endsWith('"')) ||
      (pattern.startsWith("'") && pattern.endsWith("'"))
    ) {
      pattern = pattern.slice(1, -1);
    }
    const dir = this._dir(this._cwd);
    const content = dir?.__files?.[file];
    if (content === undefined) {
      return {
        lines: [
          { t: 'out', html: `grep: ${escapeHtml(file)}: No existe el archivo o directorio` },
        ],
      };
    }
    const needle = pattern.toLowerCase();
    const matches = content
      .split('\n')
      .filter((l) => l.toLowerCase().includes(needle))
      .map((l) => {
        const re = new RegExp(pattern, 'gi');
        const highlighted = escapeHtml(l).replace(
          new RegExp(escapeHtml(pattern), 'gi'),
          (m) => `<span class="k">${m}</span>`
        );
        return { t: 'out', html: highlighted || escapeHtml(l) };
      });
    return { lines: matches };
  }

  _handleIpA() {
    const lines = [
      '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN',
      '    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00',
      '    inet 127.0.0.1/8 scope host lo',
      '2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP',
      '    link/ether 4a:2f:3e:87:1c:9d brd ff:ff:ff:ff:ff:ff',
      '    inet 192.168.1.42/24 brd 192.168.1.255 scope global wlan0',
    ];
    return { lines: lines.map((l) => ({ t: 'out', html: escapeHtml(l) })) };
  }

  _handleMan(args) {
    const cmd = args[0];
    const descs = {
      pwd: 'imprime el directorio actual',
      ls: 'lista archivos del directorio. -la incluye ocultos',
      cat: 'muestra el contenido de un archivo',
      cd: 'cambia de directorio',
      cp: 'copia un archivo. ideal para backups',
      mv: 'mueve o renombra archivos',
      mkdir: 'crea un directorio vacío',
      touch: 'crea un archivo vacío o actualiza su timestamp',
      grep: 'busca un patrón dentro de un archivo',
      rm: 'elimina archivos. CON CUIDADO. rm -rf es irreversible',
      ip: 'muestra info de red (soporta: ip a)',
      echo: 'imprime el texto que recibe',
      clear: 'limpia la terminal',
      help: 'muestra ayuda contextual según el progreso',
      man: 'muestra el manual de un comando',
    };
    if (!cmd || !descs[cmd]) {
      return {
        lines: [
          { t: 'out', html: `man: no hay entrada de manual para "${escapeHtml(cmd || '')}"` },
        ],
      };
    }
    return {
      lines: [
        { t: 'out', html: `<span class="k">NOMBRE</span>` },
        { t: 'out', html: `    ${escapeHtml(cmd)}` },
        { t: 'spc' },
        { t: 'out', html: `<span class="k">DESCRIPCIÓN</span>` },
        { t: 'out', html: `    ${escapeHtml(descs[cmd])}` },
      ],
    };
  }

  // ---------- rm — el plato fuerte ----------
  _handleRm(args) {
    const flags = args.filter((a) => a.startsWith('-')).join('').replace(/-/g, '');
    const targets = args.filter((a) => !a.startsWith('-'));
    const target = targets[0];

    if (!target) {
      return { lines: [{ t: 'out', html: 'rm: falta operando' }] };
    }

    // CASO 2: destructivo total
    const destructive =
      (target === '*' && (flags.includes('f') || flags.includes('r'))) ||
      (target === '.' && (flags.includes('f') || flags.includes('r'))) ||
      (target === '*' && flags === '') ||
      (target === '~' && (flags.includes('f') || flags.includes('r')));

    if (destructive && (flags.includes('f') || flags.includes('r'))) {
      this._startGameOver();
      return { lines: [] };
    }

    // CASO 3: borrar el mapa
    if (target === 'mapaTesoro.txt') {
      return this._handleMapDelete(flags);
    }

    // CASO 1: borrar la trampa
    if (target === 'trampa_virus.sh') {
      return this._handleTrapDelete();
    }

    // rm genérico
    return this._handleGenericRm(target);
  }

  _handleMapDelete() {
    const dir = this._dir(this._cwd);
    if (!dir?.__files?.['mapaTesoro.txt']) {
      return {
        lines: [
          { t: 'out', html: 'rm: mapaTesoro.txt: No existe el archivo o directorio' },
        ],
      };
    }
    delete dir.__files['mapaTesoro.txt'];
    this._mapDeleted = true;
    this._touchFs();

    const lines = [
      { t: 'out', html: '<span class="dim">removed</span> mapaTesoro.txt' },
      { t: 'spc' },
      { t: 'out', html: '<span class="warn">Oh no. Eliminaste tu propio mapa.</span>' },
    ];

    if (this._backedUp) {
      lines.push({
        t: 'out',
        html:
          '<span class="warn">Pero hiciste backup.</span> ' +
          'Prueba: <span class="k">cp mapaTesoro.bak mapaTesoro.txt</span>',
      });
      return { lines };
    }

    // Sin backup → game over tras unos segundos
    return {
      lines,
      then: async () => {
        await this._sleep(700);
        this._appendLine({
          t: 'out',
          html: '<span class="danger">Y no hiciste backup.</span>',
        });
        await this._sleep(900);
        this._appendLine({
          t: 'out',
          html:
            '<span class="danger">Esta es la lección más cara que vas a aprender hoy.</span>',
        });
        await this._sleep(800);
        this._startGameOver();
      },
    };
  }

  _handleTrapDelete() {
    const dir = this._dir(this._cwd);
    if (!dir?.__files?.['trampa_virus.sh']) {
      return {
        lines: [
          { t: 'out', html: 'rm: trampa_virus.sh: No existe el archivo o directorio' },
        ],
      };
    }
    delete dir.__files['trampa_virus.sh'];
    this._touchFs();
    if (this.stage === 'backed_up' || this.stage === 'read_map' || this.stage === 'in_tools') {
      this.stage = 'trap_cleared';
    }
    return {
      lines: [
        { t: 'out', html: '<span class="dim">removed</span> trampa_virus.sh' },
        { t: 'spc' },
        {
          t: 'out',
          html:
            '<span class="k">✓ Perfecto.</span> Eliminaste solo lo que debías. El cofre está libre.',
        },
      ],
    };
  }

  _handleGenericRm(target) {
    const dir = this._dir(this._cwd);
    if (!dir?.__files?.[target]) {
      return {
        lines: [
          { t: 'out', html: `rm: ${escapeHtml(target)}: No existe el archivo o directorio` },
        ],
      };
    }
    delete dir.__files[target];
    this._touchFs();
    return {
      lines: [{ t: 'out', html: `<span class="dim">removed</span> ${escapeHtml(target)}` }],
    };
  }

  // ---------- Game over ----------
  async _startGameOver() {
    if (this._gameOver) return;
    this._gameOver = true;

    // Limpiar TODO el fs del cwd para amplificar el drama
    const dir = this._dir(this._cwd);
    if (dir) {
      dir.__files = {};
      dir.__dirs = [];
      this._touchFs();
    }

    const dramatic = [
      { html: '<span class="danger">Silencio.</span>', delay: 900 },
      { html: '<span class="danger">Tu mapa, tu llave, tu camino...</span>', delay: 700 },
      { html: '<span class="danger">todo desapareció.</span>', delay: 500 },
      { html: '<span class="danger">rm no pregunta. rm no perdona.</span>', delay: 600 },
      {
        html: '<span class="danger">Reiniciando desde el principio en 5...</span>',
        delay: 1000,
      },
    ];
    for (const l of dramatic) {
      this._appendLine({ t: 'out', html: l.html });
      await this._sleep(l.delay);
    }
    for (let i = 4; i >= 1; i--) {
      this._appendLine({ t: 'out', html: `<span class="danger">${i}...</span>` });
      await this._sleep(1000);
    }
    await this._sleep(400);
    this._reset();
  }

  _reset() {
    this._cwd = '/home/agente';
    this.stage = 'intro';
    this._backedUp = false;
    this._mapDeleted = false;
    this._keyMoved = false;
    this._fs = buildInitialFs();
    this._lines = [];
    this._history = [];
    this._historyIdx = 0;
    this._createdDirs = [];
    this._createdFiles = [];
    this._input = '';
    this._gameOver = false; // dispara la limpieza del class .game-over vía updated()
    this._runBoot();
  }

  // ---------- Hints ----------
  _hintFor(stage) {
    if (this._gameOver) return 'reiniciando...';
    if (this._mapDeleted && this._backedUp) {
      return 'recupera el mapa: cp mapaTesoro.bak mapaTesoro.txt';
    }
    switch (stage) {
      case 'intro':
        return 'prueba "ls -la" para ver qué hay en este directorio';
      case 'found_secret':
        return 'el mensaje habla de herramientas/ — cd herramientas';
      case 'in_tools':
        return 'cat el archivo con "mapa" en el nombre';
      case 'read_map':
        return 'primero haz un backup: cp mapaTesoro.txt mapaTesoro.bak';
      case 'backed_up':
        return 'ahora elimina la trampa: rm trampa_virus.sh';
      case 'trap_cleared': {
        // Si el usuario está en un subdirectorio de herramientas (no en herramientas/), sugiere subir
        const inTools = this._cwd === '/home/agente/herramientas';
        if (!inTools && this._cwd.startsWith('/home/agente/herramientas/')) {
          return 'estás dentro de un subdirectorio — escribe cd .. para volver a herramientas/';
        }
        return 'crea la llave: mkdir cofreLlave && touch cofreLlave/llave_maestra.key';
      }
      case 'key_made':
        return 'el cofre está en /home/agente/archivos_secretos/boveda';
      case 'treasure_found':
        return '★ completaste el quest — recarga la página para jugar de nuevo';
      default:
        return 'escribe "help" para ver los comandos';
    }
  }

  // ---------- Render ----------
  _shortCwd() {
    if (this._cwd === '/home/agente') return '~';
    if (this._cwd.startsWith('/home/agente/')) {
      return '~/' + this._cwd.slice('/home/agente/'.length);
    }
    return this._cwd;
  }

  render() {
    return html`
      <div class="term" @click=${this._onTermClick}>
        <div class="term-bar">
          <span class="glyph">$</span>
          <span>agente@quest</span>
          <span class="sep">—</span>
          <span>zsh</span>
          <span class="sep">—</span>
          <span>quest.sh</span>
        </div>
        <div class="term-body">
          ${this._lines.map((l) => this._renderLine(l))}
        </div>
        <form class="term-input" @submit=${this._onSubmit} autocomplete="off">
          <span class="lb">[</span><span class="usr">agente</span><span class="host">@quest</span> <span class="path">${this._shortCwd()}</span><span class="rb">]</span><span class="dollar">$</span>
          <div class="term-mirror">
            <span class="term-typed">${this._input}</span
            ><ag-atom-caret variant="terminal"></ag-atom-caret>
          </div>
          <input
            type="text"
            class="term-native"
            .value=${this._input}
            @input=${this._onInput}
            @keydown=${this._onKeyDown}
            autocomplete="off"
            spellcheck="false"
            aria-label="Terminal input"
            ?disabled=${this._gameOver}
          />
        </form>
        <span class="term-hint">${this._hintFor(this.stage)}</span>
      </div>
    `;
  }

  _renderLine(line) {
    if (line.t === 'spc') {
      return html`<div class="term-line spc"></div>`;
    }
    if (line.t === 'cmd') {
      // Usa line.cwd (snapshot al momento de ejecución), no this._shortCwd() reactivo
      const cwd = line.cwd ?? this._shortCwd();
      return html`<div class="term-line cmd"><span class="lb">[</span><span class="usr">agente</span><span class="host">@quest</span> <span class="path">${cwd}</span><span class="rb">]</span><span class="dollar">$</span> ${line.text}</div>`;
    }
    // out
    return html`<div class="term-line out">${unsafeHTML(line.html || '')}</div>`;
  }
}

customElements.define('ag-organism-terminal-quest', AgOrganismTerminalQuest);
