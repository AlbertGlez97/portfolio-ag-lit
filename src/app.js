import { LitElement, html, css } from 'lit';
import { Router } from './router/ag-router.js';
import { contentService } from './services/content.service.js';

/**
 * <ag-app> — Shell raíz de la aplicación.
 *
 * Responsabilidades:
 *   1. Cargar el contenido vía `content.service` (fetch a `content.json`).
 *   2. Inicializar `i18n.service` con los idiomas disponibles.
 *   3. Arrancar el router y exponer un outlet `<slot name="page">` donde
 *      se monta la página activa.
 *   4. Mostrar un placeholder de arranque mientras el contenido se carga,
 *      y un estado de error si algo sale mal.
 *
 * Nota: este componente NO renderiza nav ni footer — esos son organismos
 * que se añadirán en fases posteriores (divide y vencerás).
 *
 * @fires ag-app-ready — Cuando el contenido se cargó y el router está listo. Detail: `{ locale }`.
 * @fires ag-app-error — Cuando falla la inicialización. Detail: `{ message }`.
 */
class AgApp extends LitElement {
  static properties = {
    /** 'boot' | 'ready' | 'error' */
    _status: { state: true },
    _error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    .boot {
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 48px 24px;
      font-family: var(--mono);
      font-size: 13px;
      letter-spacing: 0.08em;
      color: var(--fg-dim);
      text-align: center;
    }

    .boot .title {
      font-family: var(--display);
      font-weight: 600;
      font-size: 24px;
      letter-spacing: -0.02em;
      color: var(--fg);
      margin-bottom: 12px;
    }

    .boot .dot {
      color: var(--cyan);
      margin-right: 10px;
      animation: pulse 1.4s ease-in-out infinite;
    }

    .boot .err {
      color: var(--orange);
      margin-right: 10px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.35; }
    }
  `;

  constructor() {
    super();
    this._status = 'boot';
    this._error = null;
    this._router = null;
    this._initStarted = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this._initStarted) return;
    this._initStarted = true;

    try {
      await contentService.load();
      this._router = new Router({ outlet: this });
      this._router.start();
      this._status = 'ready';
      this.dispatchEvent(
        new CustomEvent('ag-app-ready', {
          detail: { locale: 'es' },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this._error = err.message ?? String(err);
      this._status = 'error';
      this.dispatchEvent(
        new CustomEvent('ag-app-error', {
          detail: { message: this._error },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._router?.stop();
  }

  render() {
    if (this._status === 'error') {
      return html`
        <div class="boot">
          <div>
            <div class="title">No pude cargar el contenido</div>
            <span class="err">✗</span> ${this._error}
          </div>
        </div>
      `;
    }

    if (this._status === 'boot') {
      return html`
        <div class="boot">
          <div>
            <div class="title">portfolio-ag</div>
            <span class="dot">●</span> Inicializando…
          </div>
        </div>
      `;
    }

    return html`<slot name="page"></slot>`;
  }
}

customElements.define('ag-app', AgApp);
