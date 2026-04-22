import { LitElement, html } from 'lit';
import { styles } from './ag-organism-reading-progress.styles.js';

/**
 * <ag-organism-reading-progress> — Barra de progreso de lectura.
 *
 * Barra fina de 2px fija en top, encima del nav (z-index 60). Usa `scaleX`
 * con `transform-origin: left` para animar sin triggerear layout. Color:
 * gradient cyan→purple con un halo cian tenue.
 *
 * El update se hace con `requestAnimationFrame` desde el scroll listener
 * (no re-renderiza Lit — escribe directo al style del `.bar` para máxima
 * performance).
 *
 * Fórmula: `scrollY / (documentElement.scrollHeight - innerHeight)`,
 * clamped a `[0, 1]`.
 *
 * @example
 *   <!-- Típicamente al inicio del body de la page del artículo -->
 *   <ag-organism-reading-progress></ag-organism-reading-progress>
 */
class AgOrganismReadingProgress extends LitElement {
  static styles = styles;

  constructor() {
    super();
    this._onScroll = this._onScroll.bind(this);
    this._rafId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onScroll, { passive: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onScroll);
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  firstUpdated() {
    this._updateBar();
  }

  _onScroll() {
    if (this._rafId) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      this._updateBar();
    });
  }

  _updateBar() {
    const bar = this.renderRoot?.querySelector('.bar');
    if (!bar) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    bar.style.transform = `scaleX(${p})`;
  }

  render() {
    return html`<div class="bar" aria-hidden="true"></div>`;
  }
}

customElements.define('ag-organism-reading-progress', AgOrganismReadingProgress);
