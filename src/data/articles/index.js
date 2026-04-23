/**
 * src/data/articles/index.js — Barril de artículos del laboratorio.
 *
 * Cada artículo vive en su propio `.json`. Este índice los ensambla en
 * un array `articles` para consumo del `contentService` y como default
 * export para cualquier otro módulo que prefiera importarlo directo.
 *
 * Agregar un artículo nuevo: crear `src/data/articles/<id>.json`,
 * importarlo acá y sumarlo al array.
 */

import diagramasDeFlujo from './diagramas-de-flujo.json';
import operacionTerminal from './operacion-terminal.json';
import javascriptEsencial from './javascript-esencial.json';
import pooPatrones from './poo-patro