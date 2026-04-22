/**
 * Escapa caracteres HTML especiales para evitar inyección en contextos que
 * aceptan HTML bruto (como `unsafeHTML` de Lit). Úsalo sobre CUALQUIER string
 * que provenga de input del usuario antes de embedderla en un template.
 *
 * @param {*} s
 * @returns {string}
 */
export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}
