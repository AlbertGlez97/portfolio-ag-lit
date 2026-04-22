import { LitElement, html } from 'lit';
import { styles } from './ag-organism-hero.styles.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../../atoms/ag-atom-caret/ag-atom-caret.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';
import '../../atoms/ag-atom-kbd/ag-atom-kbd.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../molecules/ag-molecule-hero-meta/ag-molecule-hero-meta.js';
import '../../molecules/ag-molecule-hero-command/ag-molecule-hero-command.js';
import '../../molecules/ag-molecule-hero-corner/ag-molecule-hero-corner.js';

/**
 * <ag-organism-hero> — Hero del landing.
 *
 * Capas:
 *   - Grid overlay (líneas cruzadas casi invisibles con mask elíptica central)
 *   - Aurora (3 blobs cian/purple/blue con blur 5rem, opacity 0.15, drift 14–18s)
 *   - Contenido: meta + heading display (ALBERTO + gradient GONZÁLEZ con caret hero),
 *     subtitle con barra cian, hero-command con typing loop, CTAs
 *   - Corner absoluto (scroll hint + pagination)
 *
 * El typing loop lo gestiona el organismo: rota `heroPhrases`, tipea carácter por
 * carácter con cadencia aleatoria (38–78ms), pausa 2s al completar, borra en 16ms
 * por char, y pasa a la siguiente. El `_typed` actual se pasa por prop a
 * `ag-molecule-hero-command`.
 *
 * Reveal escalonado en CSS puro (sin IntersectionObserver) — el hero está visible
 * al cargar la página, así que no hace falta observar.
 *
 * @property {string} availability - Texto de disponibilidad (hero-meta).
 * @property {string} coordinates - Coordenadas (hero-meta).
 * @property {string} firstName - Primera línea del heading (plain fg).
 * @property {string} lastName - Segunda línea del heading (gradient).
 * @property {string} subtitle - Subtitle bajo el heading (ej: "Full Stack Developer × IA").
 * @property {string} promptLabel - Prompt del hero-command (ej: "~/alberto").
 * @property {Array<string>} heroPhrases - Frases del typing loop.
 * @property {string} ctaProjectsLabel - Label del CTA primary.
 * @property {string} ctaProjectsHref - Destino del CTA primary. Default `"#proyectos"`.
 * @property {string} ctaTerminalLabel - Label del CTA ghost.
 * @property {string} ctaTerminalHref - Destino del CTA ghost. Default `"#terminal"`.
 * @property {string} cornerHint - Hint del corner (ej: "scroll ↓").
 * @property {string} cornerPagination - Paginación del corner (ej: "01 / 08").
 *
 * @example
 *   <ag-organism-hero
 *     availability="Disponible para proyectos · Q3 2025"
 *     coordinates="40.4168° N · 3.7038° W"
 *     firstName="ALBERTO"
 *     lastName="GONZÁLEZ"
 *     subtitle="Full Stack Developer × IA"
 *     promptLabel="~/alberto"
 *     .heroPhrases=${info.hero_phrases}
 *     ctaProjectsLabel="[ Ver proyectos ]"
 *     ctaTerminalLabel="Acceder al terminal"
 *     cornerHint="scroll ↓"
 *     cornerPagination="01 / 08"
 *   ></ag-organism-hero>
 */
class AgOrganismHero extends LitElement {
  static properties = {
    availability: { type: String },
    coordinates: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    subtitle: { type: String },
    promptLabel: { type: String },
    heroPhrases: { type: Array },
    ctaProjectsLabel: { type: String },
    ctaProjectsHref: { type: String },
    ctaTerminalLabel: { type: String },
    ctaTerminalHref: { type: String },
    cornerHint: { type: String },
    cornerPagination: { type: String },
    _typed: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.availability = '';
    this.coordinates = '';
    this.firstName = '';
    this.lastName = '';
    this.subtitle = '';
    this.promptLabel = '';
    this.heroPhrases = [];
    this.ctaProjectsLabel = '';
    this.ctaProjectsHref = '#proyectos';
    this.ctaTerminalLabel = '';
    this.ctaTerminalHref = '#terminal';
    this.cornerHint = '';
    this.cornerPagination = '';
    this._typed = '';
    this._typingActive = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._typingActive = true;
    this._runTypingLoop();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._typingActive = false;
  }

  async _runTypingLoop() {
    let i = 0;
    while (this._typingActive) {
      const phrases = this.heroPhrases;
      if (!phrases || phrases.length === 0) {
        await this._sleep(500);
        continue;
      }
      const phrase = phrases[i % phrases.length];

      // type
      for (let c = 0; c <= phrase.length; c++) {
        if (!this._typingActive) return;
        this._typed = phrase.slice(0, c);
        await this._sleep(38 + Math.random() * 40);
      }
      if (!this._typingActive) return;
      await this._sleep(2000);

      // delete
      for (let c = phrase.length; c >= 0; c--) {
        if (!this._typingActive) return;
        this._typed = phrase.slice(0, c);
        await this._sleep(16);
      }
      if (!this._typingActive) return;
      await this._sleep(300);
      i++;
    }
  }

  _sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  render() {
    return html`
      <div class="grid" aria-hidden="true"></div>
      <div class="aurora" aria-hidden="true">
        <span class="blob a1"></span>
        <span class="blob a2"></span>
        <span class="blob a3"></span>
      </div>

      <div class="wrap">
        <ag-molecule-hero-meta
          availability=${this.availability}
          coordinates=${this.coordinates}
        ></ag-molecule-hero-meta>

        <ag-atom-heading level="1" variant="display">
          <div>${this.firstName}</div>
          <div>
            <ag-atom-gradient-text>${this.lastName}</ag-atom-gradient-text><ag-atom-caret variant="hero"></ag-atom-caret>
          </div>
        </ag-atom-heading>

        <ag-atom-text variant="hero-sub">${this.subtitle}</ag-atom-text>

        <ag-molecule-hero-command
          prompt=${this.promptLabel}
          typed=${this._typed}
        ></ag-molecule-hero-command>

        <div class="cta">
          <ag-atom-button variant="primary" href=${this.ctaProjectsHref}>
            ${this.ctaProjectsLabel}
          </ag-atom-button>
          <ag-atom-button variant="ghost" href=${this.ctaTerminalHref}>
            <ag-atom-kbd>⌘K</ag-atom-kbd> ${this.ctaTerminalLabel}
          </ag-atom-button>
        </div>
      </div>

      <ag-molecule-hero-corner
        class="corner"
        hint=${this.cornerHint}
        pagination=${this.cornerPagination}
      ></ag-molecule-hero-corner>
    `;
  }
}

customElements.define('ag-organism-hero', AgOrganismHero);
