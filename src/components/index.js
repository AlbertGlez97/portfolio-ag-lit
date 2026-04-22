/**
 * src/components/index.js — Barril raíz de componentes.
 *
 * Re-exporta los cuatro niveles de Atomic Design en orden de composición
 * (átomos → moléculas → organismos → pages). Importar este único barril
 * registra los 56 custom elements del proyecto.
 *
 * Niveles:
 *   - ./atoms      (19 componentes)
 *   - ./molecules  (20 componentes)
 *   - ./organisms  (14 componentes)
 *   - ./pages       (3 componentes)
 */

export * from './atoms/index.js';
export * from './molecules/index.js';
export * from './organisms/index.js';
export * from './pages/index.js';
