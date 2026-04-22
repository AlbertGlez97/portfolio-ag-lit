/**
 * Utilidades de formato de fecha para los textos del portafolio.
 * NO pasan por `Intl.DateTimeFormat` — el formato de la maqueta no calza
 * con ningún locale estándar ("28 · MAR · 2025" con mes corto en mayúsculas,
 * separadores con puntos), así que se formatea a mano.
 */

const MONTHS_SHORT = {
  es: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
};

const MONTHS_TITLE = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/**
 * `"2025-04-28"` → `"28 · ABR · 2025"` — formato lab-row / article-card.
 * @param {string} iso
 * @param {string} locale
 */
export function formatDateDots(iso, locale = 'es') {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const months = MONTHS_SHORT[locale] || MONTHS_SHORT.es;
  return `${day} · ${months[d.getMonth()]} · ${d.getFullYear()}`;
}

/**
 * `"2025-04-12"` → `"12 Abr 2025"` — formato byline del artículo.
 * @param {string} iso
 * @param {string} locale
 */
export function formatDateLong(iso, locale = 'es') {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const months = MONTHS_TITLE[locale] || MONTHS_TITLE.es;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
