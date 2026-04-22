const STORAGE_KEY = 'ag.locale';

/**
 * Servicio de internacionalización.
 *
 * Mantiene el idioma actual y notifica cambios a suscriptores.
 * Persiste la elección en `localStorage` para que sobreviva al reload.
 *
 * Resolución del idioma inicial (en `init()`):
 *   1. Valor guardado en localStorage, si es válido.
 *   2. `navigator.language` recortado a 2 letras, si está en `available`.
 *   3. `fallback` pasado a `init()`.
 *   4. Primer idioma de `available`.
 *
 * Instancia singleton exportada como `i18nService`.
 *
 * @example
 *   import { i18nService } from './i18n.service.js';
 *   i18nService.init(['es', 'en'], 'es');
 *   i18nService.subscribe((locale) => console.log('cambió a', locale));
 *   i18nService.set('en');
 */
class I18nService {
  constructor() {
    this._current = null;
    this._available = [];
    this._fallback = null;
    this._subs = new Set();
  }

  /**
   * Inicializa el servicio con los idiomas disponibles.
   * @param {string[]} available
   * @param {string} [fallback]
   */
  init(available, fallback) {
    if (!Array.isArray(available) || available.length === 0) {
      throw new Error('[i18n] init() requiere al menos un idioma');
    }
    this._available = available;
    this._fallback = fallback ?? available[0];

    const stored = this._readStored();
    const browser = this._browserLocale();
    const resolved =
      [stored, browser, this._fallback].find((l) => l && available.includes(l)) ?? available[0];

    this._current = resolved;
    document.documentElement.lang = this._current;
  }

  /** @returns {string} */
  get current() {
    return this._current;
  }

  /** @returns {string[]} */
  get available() {
    return [...this._available];
  }

  /**
   * Cambia el idioma actual. Ignora si no está en `available` o es el actual.
   * @param {string} locale
   */
  set(locale) {
    if (!this._available.includes(locale)) return;
    if (this._current === locale) return;
    this._current = locale;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (_err) {
      // localStorage puede estar deshabilitado (modo privado, cuota, etc.)
    }
    this._subs.forEach((fn) => fn(locale));
  }

  /**
   * Se suscribe a cambios de idioma.
   * @param {(locale: string) => void} fn
   * @returns {() => void} unsubscribe
   */
  subscribe(fn) {
    this._subs.add(fn);
    return () => this._subs.delete(fn);
  }

  _readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_err) {
      return null;
    }
  }

  _browserLocale() {
    const l = navigator.language ?? '';
    return l.split('-')[0] || null;
  }
}

export const i18nService = new I18nService();
