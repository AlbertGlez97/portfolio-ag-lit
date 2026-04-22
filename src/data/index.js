/**
 * src/data/index.js — Barril del catálogo de contenido.
 *
 * Re-exporta un objeto unificado idéntico al content.json monolítico
 * anterior, y además expone cada módulo por separado como named export
 * para consumo granular.
 *
 * Vite parsea los `.json` como módulos ES directamente — no hace falta
 * el assert `{ type: 'json' }`.
 */

import meta from './meta.json';
import personal from './personal.json';
import projects from './projects.json';
import articles from './articles/index.js';
import skills from './skills.json';
import terminal from './terminal.json';

export default {
  ...meta,
  ...personal,
  projects: projects.projects,
  articles: articles,
  skills: skills.skills,
  ...terminal,
};

// Named exports para consumo granular
export { default as metaData }      from './meta.json';
export { default as personalData }  from './personal.json';
export { default as projectsData }  from './projects.json';
export { default as articlesData }  from './articles/index.js';
export { default as skillsData }    from './skills.json';
export { default as terminalData }  from './terminal.json';
