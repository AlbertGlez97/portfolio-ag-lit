import contentData from '../data/index.js';

/**
 * Servicio de contenido — solo español (es).
 *
 * Encapsula el acceso al catálogo del portafolio. Por defecto consume el
 * bundle importado desde `../data/index.js` (combinación modular de
 * meta.json, personal.json, projects.json, articles.json, skills.json y
 * terminal.json). Cuando esté disponible un endpoint REST real, llamar
 * `configure({ url })` antes de `load()` para hacer fetch remoto.
 *
 * @example
 *   import { contentService } from './content.service.js';
 *   await contentService.load();
 *   const projects = contentService.getProjects();
 */
class ContentService {
  constructor() {
    this._url = null;
    this._data = null;
    this._inflight = null;
  }

  configure({ url }) {
    if (this._data) throw new Error('[content] configure() debe llamarse antes de load()');
    this._url = url;
  }

  load() {
    if (this._data) return Promise.resolve(this._data);
    if (this._inflight) return this._inflight;

    // Modo API remota: fetch del endpoint configurado
    if (this._url) {
      this._inflight = fetch(this._url, { headers: { Accept: 'application/json' } })
        .then((res) => {
          if (!res.ok) throw new Error(`content → HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          this._data = data;
          this._inflight = null;
          return data;
        })
        .catch((err) => {
          this._inflight = null;
          throw err;
        });
      return this._inflight;
    }

    // Modo bundle: datos ya resueltos desde los módulos JSON
    this._data = contentData;
    return Promise.resolve(this._data);
  }

  _require() {
    if (!this._data) throw new Error('[content] llama a load() primero');
    return this._data;
  }

  getPersonalInfo() {
    return this._require().personal_info ?? null;
  }

  getStats() {
    return this._require().stats ?? [];
  }

  getProjects() {
    return [...(this._require().projects ?? [])].sort((a, b) => a.order - b.order);
  }

  getArticles() {
    return this._require().articles ?? [];
  }

  getArticleBySlug(slug) {
    return (this._require().articles ?? []).find((a) => a.slug === slug) ?? null;
  }

  getSkills() {
    return this._require().skills ?? [];
  }

  getSocialLinks() {
    return this._require().social_links ?? [];
  }

  getContact() {
    return this._require().contact ?? {};
  }

  getTerminal() {
    const t = this._require().terminal || {};
    return {
      neofetch: t.neofetch || {},
      stack_items: t.stack_items || [],
      now_items: t.now_items || [],
      readme_content: t.readme_content || '',
    };
  }
}

export const contentService = new ContentService();
