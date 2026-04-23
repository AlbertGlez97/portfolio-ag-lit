import { LitElement, html } from 'lit';
import { contentService } from '../../../services/content.service.js';
import { formatDateDots } from '../../../utils/format-date.js';
import '../../atoms/ag-atom-eyebrow/ag-atom-eyebrow.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../organisms/ag-organism-nav/ag-organism-nav.js';
import '../../organisms/ag-organism-hero/ag-organism-hero.js';
import '../../organisms/ag-organism-stats-strip/ag-organism-stats-strip.js';
import '../../organisms/ag-organism-terminal/ag-organism-terminal.js';
import '../../organisms/ag-organism-projects-grid/ag-organism-projects-grid.js';
import '../../organisms/ag-organism-laboratorio-list/ag-organism-laboratorio-list.js';
import '../../organisms/ag-organism-contact-links/ag-organism-contact-links.js';
import '../../organisms/ag-organism-contact-form/ag-organism-contact-form.js';
import '../../organisms/ag-organism-footer/ag-organism-footer.js';

const NAV_LINKS = [
  { href: '#proyectos',   sectionId: 'proyectos',   idx: '01', label: 'Proyectos' },
  { href: '#laboratorio', sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
  { href: '#terminal',    sectionId: 'terminal',    idx: '03', label: 'Terminal' },
  { href: '#contacto',    sectionId: 'contacto',    idx: '04', label: 'Contacto', keep: true },
];

const TERMINAL_CHIPS = [
  { cmd: 'whoami',  label: 'whoami' },
  { cmd: 'skills',  label: 'skills' },
  { cmd: 'stack',   label: 'stack' },
  { cmd: 'now',     label: 'now' },
  { cmd: 'contact', label: 'contact' },
  { cmd: 'help',    label: 'help' },
];

const CATEGORY_LABELS = {
  threejs: 'Three.js',
  ia: 'IA',
  tutor: 'Tutorial',
  backend: 'Backend',
  cs: 'Computación',
};

/**
 * <ag-page-landing> — Page del landing (ruta `/`).
 *
 * Orquesta todos los organismos del landing en Light DOM (requisito del
 * IntersectionObserver del nav). Carga `contentService` en
 * `connectedCallback` y compone los datos de cada organismo desde el content.
 *
 * Los ids de sección (`#proyectos`, `#laboratorio`, `#terminal`, `#contacto`)
 * viven en los hosts de los organismos o en `<section>` wrappers para que
 * el nav los encuentre vía `document.getElementById`.
 */
class AgPageLanding extends LitElement {
  static properties = {
    _loaded: { state: true },
    _error: { state: true },
  };

  constructor() {
    super();
    this._loaded = false;
    this._error = null;
  }

  createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      await contentService.load();
      this._loaded = true;
    } catch (err) {
      this._error = err?.message || String(err);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    if (this._error) return html`<div class="ag-page-error">${this._error}</div>`;
    if (!this._loaded) return html`<div class="ag-page-loading">Cargando…</div>`;

    const info = contentService.getPersonalInfo() || {};
    const projects = contentService.getProjects();
    const articles = contentService.getArticles();
    const skills = contentService.getSkills();
    const socialLinks = contentService.getSocialLinks();
    const stats = contentService.getStats();
    const contact = contentService.getContact();
    const terminal = contentService.getTerminal();

    const labArticles = articles
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((a) => ({
        category: a.category,
        categoryLabel: CATEGORY_LABELS[a.category] || a.category,
        date: formatDateDots(a.published_at),
        title: a.title,
        excerpt: a.excerpt,
        href: a.slug ? `/laboratorio/${a.slug}` : '',
      }));

    const firstName = info.name ? info.name.trim().split(/\s+/)[0] : 'alberto';
    const promptLabel = `~/${firstName.toLowerCase()}`;

    return html`
      <ag-organism-nav .links=${NAV_LINKS}></ag-organism-nav>

      <ag-organism-hero
        id="top"
        availability=${info.availability || ''}
        coordinates=${info.coordinates || ''}
        firstName="ALBERTO"
        lastName="GONZÁLEZ"
        subtitle=${info.role || ''}
        promptLabel=${promptLabel}
        .heroPhrases=${info.hero_phrases || []}
        ctaProjectsLabel="[ Ver proyectos ]"
        ctaTerminalLabel="Acceder al terminal"
        cornerHint="scroll ↓"
        cornerPagination="01 / 08"
      ></ag-organism-hero>

      <ag-organism-stats-strip .stats=${stats}></ag-organism-stats-strip>

      <ag-organism-projects-grid
        id="proyectos"
        eyebrowText="01 · Proyectos"
        titleText="Cosas que he construido."
        kickerText="Una selección de trabajo reciente en producto, IA aplicada y herramientas internas."
        .projects=${projects}
      ></ag-organism-projects-grid>

      <ag-organism-laboratorio-list
        id="laboratorio"
        eyebrowText="02 · El Laboratorio"
        titleText="Ideas, experimentos y proyectos que evolucionan."
        kickerText="Notas técnicas, experimentos y tutoriales. Escribo lo que aprendo."
        .articles=${labArticles}
        ctaLabel="Ver el Laboratorio completo →"
        ctaHref="/laboratorio"
      ></ag-organism-laboratorio-list>

      <section id="terminal" class="ag-page-section">
        <ag-organism-terminal
          eyebrowText="03 · Terminal"
          titleText="¿Quieres saber más de mí?"
          kickerText="Escribe un comando. Soy más cómodo en terminal que en una biografía corporativa."
          .commandChips=${TERMINAL_CHIPS}
          .userInfo=${info}
          .skills=${skills}
          .projects=${projects}
          .socialLinks=${socialLinks}
          .stackItems=${terminal.stack_items}
          .nowItems=${terminal.now_items}
          readmeContent=${terminal.readme_content}
          .neofetchData=${terminal.neofetch}
        ></ag-organism-terminal>
      </section>

      <section id="contacto" class="ag-page-section">
        <div class="ag-page-wrap">
          <div style="margin-bottom: 3rem">
            <ag-atom-eyebrow>04 · Contacto</ag-atom-eyebrow>
          </div>
          <div class="ag-page-contact-grid">
            <ag-organism-contact-links
              titleLine1="Hablemos de tu"
              titleAccent="próximo proyecto."
              intro=${contact.intro || 'Consultoría, contratos fijos o sólo para decir hola.'}
              .links=${socialLinks.map((l) => ({
                label: l.label || '',
                value: l.value || '',
                href: l.url || '',
              }))}
            ></ag-organism-contact-links>
            <ag-organism-contact-form
              formHeadFile="new_message.txt"
              formHeadStatus="conexión segura"
              nameLabel="Nombre"
              namePlaceholder=${contact.form_placeholders?.name || 'Cómo te llamas'}
              nameErrorMsg="Necesito saber con quién hablo."
              emailLabel="Email"
              emailPlaceholder=${contact.form_placeholders?.email || 'tu@correo.com'}
              emailErrorMsg="Ese email no se ve muy bien."
              messageLabel="Mensaje"
              messagePlaceholder=${contact.form_placeholders?.message || 'Cuéntame en qué estás pensando...'}
              messageErrorMsg="Cuéntame algo, aunque sea un párrafo."
              submitLabel="[ Enviar mensaje ]"
              successTitle="Mensaje enviado"
              successSuffix="Te respondo pronto,"
            ></ag-organism-contact-form>
          </div>
        </div>
      </section>

      <ag-organism-footer>
        <ag-atom-text slot="left" variant="meta">
          Diseñado y construido por ${info.name || 'Alberto González'} — ${new Date().getFullYear()}
        </ag-atom-text>
        <ag-atom-text slot="right" variant="meta">
          Hecho con <span style="color: var(--cyan)">♥</span> y demasiado café
        </ag-atom-text>
      </ag-organism-footer>
    `;
  }
}

customElements.define('ag-page-landing', AgPageLanding);
