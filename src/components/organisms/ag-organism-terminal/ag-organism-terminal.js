import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styles } from './ag-organism-terminal.styles.js';
import { buildCommands } from '../../../services/terminal-commands.js';
import { escapeHtml } from '../../../utils/escape-html.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../atoms/ag-atom-chip/ag-atom-chip.js';
import '../../atoms/ag-atom-caret/ag-atom-caret.js';

/**
 * ASCII art del logo Arch. Se queda hardcoded — no tiene sentido serializarlo
 * en content.json. Se usa en el template del neofetch.
 */
const NEOFETCH_ASCII =
  '       /\\\n' +
  '      /  \\\n' +
  '     /\\   \\\n' +
  '    /  __  \\\n' +
  '   /  (  )  \\\n' +
  '  / __|  |__ \\\n' +
  ' /.`        `.\\';

/**
 * <ag-organism-terminal> — Terminal interactivo Arch Linux del landing.
 *
 * Dos columnas: copy + chips a la izquierda, REPL con neofetch + input a la
 * derecha. Al montarse corre el boot (`neofetch` + `whoami`). Después acepta
 * comandos del usuario vía input (Enter ejecuta, ↑/↓ navega history) y
 * también vía chips del lado izquierdo (salto directo al handler).
 *
 * Atajo `⌘K` / `Ctrl+K` hace scroll al terminal y focus del input (700ms de
 * delay para respetar la animación de scroll).
 *
 * Comandos (14): help · whoami · skills · stack · now · projects · contact ·
 * neofetch · clear · sudo hire · ls · cat readme.md · date · echo
 *
 * HTML del output es confiable (lo escribimos en `terminal-commands.js`) y se
 * renderiza con `unsafeHTML`. El único input de usuario que llega al HTML es
 * `echo <args>` y ese pasa por `escapeHtml` antes.
 *
 * @property {object} userInfo - `{ name, location, role, bio_short }`.
 * @property {Array} skills - `[{ id, level, items }]`.
 * @property {Array} projects - `[{ title, description, type }]`.
 * @property {Array} socialLinks - `[{ id, label, value, url }]`.
 * @property {Array} stackItems - `[{ label, value }]`.
 * @property {Array<string>} nowItems - Líneas del comando now.
 * @property {string} readmeContent - Contenido multilinea para `cat readme.md`.
 * @property {object} neofetchData - `{ os, kernel, wm, shell, terminal, editor, cpu, memory }`.
 * @property {string} eyebrowText - Eyebrow izquierdo (ej: "03 · Terminal").
 * @property {string} titleText - Título izquierdo.
 * @property {string} kickerText - Párrafo izquierdo.
 * @property {Array<{cmd, label}>} commandChips - Chips de comandos.
 * @property {string} promptUser - Usuario del prompt. Default `"alberto"`.
 * @property {string} promptHost - Host del prompt. Default `"archlinux"`.
 */
class AgOrganismTerminal extends LitElement {
  static properties = {
    userInfo: { type: Object },
    skills: { type: Array },
    projects: { type: Array },
    socialLinks: { type: Array },
    stackItems: { type: Array },
    nowItems: { type: Array },
    readmeContent: { type: String },
    neofetchData: { type: Object },
    eyebrowText: { type: String },
    titleText: { type: String },
    kickerText: { type: String },
    commandChips: { type: Array },
    promptUser: { type: String },
    promptHost: { type: String },
    inputHint: { type: String },
    _lines: { state: true },
    _input: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.userInfo = {};
    this.skills = [];
    this.projects = [];
    this.socialLinks = [];
    this.stackItems = [];
    this.nowItems = [];
    this.readmeContent = '';
    this.neofetchData = {};
    this.eyebrowText = '';
    this.titleText = '';
    this.kickerText = '';
    this.commandChips = [];
    this.promptUser = 'alberto';
    this.promptHost = 'archlinux';
    this.inputHint = 'haz clic en la terminal o usa ⌘K para escribir';
    this._lines = [];
    this._input = '';
    this._history = [];
    this._historyIdx = 0;
    this._commands = null;
    this._booted = false;
    this._bootStarted = false;
    this._bootActive = false;
    this._onGlobalKey = this._onGlobalKey.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onGlobalKey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onGlobalKey);
    this._bootActive = false;
  }

  updated(changed) {
    // Rebuild commands dict when any source prop changes
    const sourceKeys = [
      'userInfo',
      'skills',
      'projects',
      'socialLinks',
      'stackItems',
      'nowItems',
      'readmeContent',
      'neofetchData',
    ];
    if (sourceKeys.some((k) => changed.has(k)) || !this._commands) {
      this._commands = buildCommands({
        userInfo: this.userInfo,
        skills: this.skills,
        projects: this.projects,
        socialLinks: this.socialLinks,
        stackItems: this.stackItems,
        nowItems: this.nowItems,
        readmeContent: this.readmeContent,
        neofetchData: this.neofetchData,
      });

      if (!this._booted && !this._bootStarted) {
        this._bootStarted = true;
        this._runBoot();
      }
    }

    // Auto-scroll to bottom on any line change
    if (changed.has('_lines')) {
      const body = this.renderRoot?.querySelector('.term-body');
      if (body) body.scrollTop = body.scrollHeight;
    }
  }

  /* ---------- Boot ---------- */

  async _runBoot() {
    this._bootActive = true;

    this._appendLine({ t: 'cmd', text: 'neofetch' });
    await this._sleep(120);
    if (!this._bootActive) return;

    this._appendLine({ t: 'neofetch', data: this.neofetchData });
    this._appendLine({ t: 'spc' });
    await this._sleep(200);
    if (!this._bootActive) return;

    this._appendLine({ t: 'cmd', text: 'whoami' });
    const whoami = this._commands.whoami();
    for (const line of whoami.lines || []) {
      this._appendLine(line);
      await this._sleep(60);
      if (!this._bootActive) return;
    }

    this._appendLine({ t: 'spc' });
    this._appendLine({
      t: 'out',
      html:
        '<span style="color: var(--fg-dimmer)">Escribe ' +
        '<span class="k">help</span> para ver todos los comandos disponibles.</span>',
    });
    this._appendLine({ t: 'spc' });

    this._booted = true;
  }

  /* ---------- REPL ---------- */

  async _runCommand(raw) {
    const trimmed = (raw || '').trim();
    if (!trimmed) return;

    this._appendLine({ t: 'cmd', text: trimmed });
    this._history = [...this._history, trimmed];
    this._historyIdx = this._history.length;

    const lower = trimmed.toLowerCase();
    const parts = lower.split(/\s+/);
    let handler = this._commands[lower] || this._commands[parts[0]];
    const args = parts.slice(1);

    if (!handler) {
      this._appendLine({
        t: 'out',
        html: `<span class="warn">zsh: command not found:</span> ${escapeHtml(trimmed)}`,
      });
      this._appendLine({
        t: 'out',
        html: 'prueba <span class="k">help</span> para ver comandos disponibles.',
      });
      this._appendLine({ t: 'spc' });
      return;
    }

    const result = handler(args) || {};

    if (result.clear) {
      this._lines = [];
      return;
    }

    for (const line of result.lines || []) {
      this._appendLine(line);
      await this._sleep(35);
    }
    this._appendLine({ t: 'spc' });

    if (typeof result.then === 'function') {
      result.then();
    }
  }

  _appendLine(line) {
    this._lines = [...this._lines, line];
  }

  /* ---------- Handlers ---------- */

  _onSubmit(e) {
    e.preventDefault();
    const value = this._input;
    this._input = '';
    this._runCommand(value);
    setTimeout(() => this._focusInput(), 0);
  }

  _onInput(e) {
    this._input = e.target.value;
  }

  _onKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this._history.length && this._historyIdx > 0) {
        this._historyIdx -= 1;
        this._input = this._history[this._historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this._historyIdx < this._history.length - 1) {
        this._historyIdx += 1;
        this._input = this._history[this._historyIdx];
      } else {
        this._historyIdx = this._history.length;
        this._input = '';
      }
    }
  }

  _onChipCommand(e) {
    this._runCommand(e.detail.cmd);
    setTimeout(() => this._focusInput(), 0);
  }

  _onTermClick(e) {
    // Si el click fue en un link o botón dentro del terminal, dejarlo pasar
    const path = e.composedPath();
    const interactive = path.some((el) => {
      const t = el.tagName?.toLowerCase();
      return t === 'a' || t === 'button';
    });
    if (interactive) return;
    this._focusInput();
  }

  _onGlobalKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => this._focusInput(), 700);
    }
  }

  _focusInput() {
    const input = this.renderRoot?.querySelector('.term-input input');
    input?.focus();
  }

  _sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ---------- Render ---------- */

  render() {
    return html`
      <div class="wrap">
        <div class="copy">
          <ag-atom-eyebrow>${this.eyebrowText}</ag-atom-eyebrow>
          <ag-atom-heading level="2" variant="section">${this.titleText}</ag-atom-heading>
          <ag-atom-text variant="body">${this.kickerText}</ag-atom-text>
          <div class="chips" @ag-chip-command=${this._onChipCommand}>
            ${this.commandChips.map(
              (c) => html`
                <ag-atom-chip variant="command" cmd=${c.cmd}>${c.label}</ag-atom-chip>
              `
            )}
          </div>
        </div>

        <div class="term" @click=${this._onTermClick}>
          <div class="term-bar">
            <span>${this.promptUser}@${this.promptHost}</span>
            <span class="sep">—</span>
            <span>zsh</span>
            <span class="sep">—</span>
            <span>120×38</span>
          </div>
          <div class="term-body">
            ${this._lines.map((line) => this._renderLine(line))}
          </div>
          <form class="term-input" @submit=${this._onSubmit} autocomplete="off">
            <span class="lb">[</span><span class="usr">${this.promptUser}</span><span class="host">@${this.promptHost}</span> <span class="path">~</span><span class="rb">]</span><span class="dollar">$</span>
            <div class="term-mirror">
              <span class="term-typed">${this._input}</span><ag-atom-caret variant="terminal"></ag-atom-caret>
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
            />
          </form>
          <span class="term-hint">${this.inputHint}</span>
        </div>
      </div>
    `;
  }

  _renderLine(line) {
    switch (line.t) {
      case 'spc':
        return html`<div class="term-line spc"></div>`;
      case 'cmd':
        return html`<div class="term-line cmd"><span class="lb">[</span><span class="usr">${this.promptUser}</span><span class="host">@${this.promptHost}</span> <span class="path">~</span><span class="rb">]</span><span class="dollar">$</span> ${line.text}</div>`;
      case 'neofetch':
        return this._renderNeofetch(line.data);
      case 'out':
      default:
        return html`<div class="term-line out">${unsafeHTML(line.html || '')}</div>`;
    }
  }

  _renderNeofetch(data) {
    const d = data || this.neofetchData || {};
    return html`
      <div class="neofetch">
        <pre>${NEOFETCH_ASCII}</pre>
        <div class="nf-info">
          <div class="nf-id">
            <span>${this.promptUser}</span><span class="at">@</span><span>${this.promptHost}</span>
          </div>
          <div class="nf-sep">──────────────────</div>
          ${d.os ? html`<div class="nf-row"><span class="lbl">OS</span> ${d.os}</div>` : ''}
          ${d.kernel ? html`<div class="nf-row"><span class="lbl">Kernel</span> ${d.kernel}</div>` : ''}
          ${d.wm ? html`<div class="nf-row"><span class="lbl">WM</span> ${d.wm}</div>` : ''}
          ${d.shell ? html`<div class="nf-row"><span class="lbl">Shell</span> ${d.shell}</div>` : ''}
          ${d.terminal ? html`<div class="nf-row"><span class="lbl">Terminal</span> ${d.terminal}</div>` : ''}
          ${d.editor ? html`<div class="nf-row"><span class="lbl">Editor</span> ${d.editor}</div>` : ''}
          ${d.cpu ? html`<div class="nf-row"><span class="lbl">CPU</span> ${d.cpu}</div>` : ''}
          ${d.memory ? html`<div class="nf-row"><span class="lbl">Memory</span> ${d.memory}</div>` : ''}
          <div class="nf-row nf-swatches">
            <span style="background:#1a1e27"></span>
            <span style="background:#ff5f57"></span>
            <span style="background:#28c840"></span>
            <span style="background:#febc2e"></span>
            <span style="background:#7aa2f7"></span>
            <span style="background:#a855f7"></span>
            <span style="background:#00e5c8"></span>
            <span style="background:#e8ecf3"></span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('ag-organism-terminal', AgOrganismTerminal);
