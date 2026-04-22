import { LitElement, html } from 'lit';
import { styles } from './ag-organism-contact-form.styles.js';
import '../../atoms/ag-atom-input/ag-atom-input.js';
import '../../atoms/ag-atom-textarea/ag-atom-textarea.js';
import '../../atoms/ag-atom-button/ag-atom-button.js';
import '../../atoms/ag-atom-heading/ag-atom-heading.js';
import '../../atoms/ag-atom-gradient-text/ag-atom-gradient-text.js';
import '../../atoms/ag-atom-text/ag-atom-text.js';
import '../../molecules/ag-molecule-form-field/ag-molecule-form-field.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * <ag-organism-contact-form> — Formulario de contacto.
 *
 * 3 campos (name, email, message) con validación cliente al submit, estado
 * de envío (loading), estado de éxito (reemplaza el form por un mensaje),
 * y estado de error de red (inline; el form se preserva para reintentar).
 *
 * Arquitectura del submit:
 *   - El organismo NO hace fetch real. Si se pasa `submitFn` como prop,
 *     la llama con `{ name, email, message }` y espera su promesa.
 *   - Si NO se pasa `submitFn`, cae en `_defaultSubmit` que simula éxito
 *     tras 800ms (placeholder con TODO donde conectar el backend).
 *   - Emite `ag-contact-submitted` tras éxito con los datos enviados.
 *
 * Validación mínima (al submit):
 *   - name: no vacío tras trim
 *   - email: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`
 *   - message: >= 10 caracteres tras trim
 *
 * @property {string} formHeadFile - "new_message.txt" o similar.
 * @property {string} formHeadStatus - "conexión segura" o similar.
 * @property {string} nameLabel - Label del campo nombre.
 * @property {string} namePlaceholder
 * @property {string} nameErrorMsg
 * @property {string} emailLabel
 * @property {string} emailPlaceholder
 * @property {string} emailErrorMsg
 * @property {string} messageLabel
 * @property {string} messagePlaceholder
 * @property {string} messageErrorMsg
 * @property {number} maxChars - Máximo del textarea. Default 1000.
 * @property {string} submitLabel
 * @property {string} submittingLabel - Label mientras se envía. Default "Enviando…".
 * @property {string} successTitle - Título del estado success. Default "Mensaje enviado".
 * @property {string} successSuffix - Sufijo antes del nombre en success. Default "Te respondo pronto,".
 * @property {string} successFallbackName - Nombre por defecto si no se detecta. Default "amig@".
 * @property {string} networkErrorMsg - Mensaje cuando falla el submit.
 * @property {Function} submitFn - Async function `(data) => Promise` — si no se pasa, usa placeholder.
 *
 * @fires ag-contact-submitted - Tras éxito. Detail: `{ name, email, message }`.
 *
 * @example
 *   <ag-organism-contact-form
 *     formHeadFile="new_message.txt"
 *     formHeadStatus="conexión segura"
 *     nameLabel="Nombre"
 *     namePlaceholder="Cómo te llamas"
 *     nameErrorMsg="Necesito saber con quién hablo."
 *     emailLabel="Email"
 *     emailPlaceholder="tu@correo.com"
 *     emailErrorMsg="Ese email no se ve muy bien."
 *     messageLabel="Mensaje"
 *     messagePlaceholder="Cuéntame en qué estás pensando..."
 *     messageErrorMsg="Cuéntame algo, aunque sea un párrafo."
 *     submitLabel="[ Enviar mensaje ]"
 *     successTitle="Mensaje enviado"
 *     successSuffix="Te respondo pronto,"
 *     .submitFn=${async (data) => { await api.sendContact(data); }}
 *   ></ag-organism-contact-form>
 */
class AgOrganismContactForm extends LitElement {
  static properties = {
    formHeadFile: { type: String },
    formHeadStatus: { type: String },
    nameLabel: { type: String },
    namePlaceholder: { type: String },
    nameErrorMsg: { type: String },
    emailLabel: { type: String },
    emailPlaceholder: { type: String },
    emailErrorMsg: { type: String },
    messageLabel: { type: String },
    messagePlaceholder: { type: String },
    messageErrorMsg: { type: String },
    maxChars: { type: Number },
    submitLabel: { type: String },
    submittingLabel: { type: String },
    successTitle: { type: String },
    successSuffix: { type: String },
    successFallbackName: { type: String },
    networkErrorMsg: { type: String },
    submitFn: { attribute: false },
    _name: { state: true },
    _email: { state: true },
    _message: { state: true },
    _nameError: { state: true },
    _emailError: { state: true },
    _messageError: { state: true },
    _status: { state: true },
    _networkErrorText: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this.formHeadFile = '';
    this.formHeadStatus = '';
    this.nameLabel = '';
    this.namePlaceholder = '';
    this.nameErrorMsg = '';
    this.emailLabel = '';
    this.emailPlaceholder = '';
    this.emailErrorMsg = '';
    this.messageLabel = '';
    this.messagePlaceholder = '';
    this.messageErrorMsg = '';
    this.maxChars = 1000;
    this.submitLabel = '';
    this.submittingLabel = 'Enviando…';
    this.successTitle = 'Mensaje enviado';
    this.successSuffix = 'Te respondo pronto,';
    this.successFallbackName = 'amig@';
    this.networkErrorMsg = 'No pude enviar el mensaje. Intentá de nuevo en un momento.';
    this.submitFn = null;
    this._name = '';
    this._email = '';
    this._message = '';
    this._nameError = false;
    this._emailError = false;
    this._messageError = false;
    this._status = 'idle';
    this._networkErrorText = '';
  }

  /* ---------- Validation ---------- */

  _validate() {
    const nameOk = this._name.trim().length > 0;
    const emailOk = EMAIL_REGEX.test(this._email.trim());
    const messageOk = this._message.trim().length >= 10;
    this._nameError = !nameOk;
    this._emailError = !emailOk;
    this._messageError = !messageOk;
    return nameOk && emailOk && messageOk;
  }

  /* ---------- Submit ---------- */

  async _handleSubmit() {
    if (this._status === 'submitting') return;
    if (!this._validate()) return;

    this._status = 'submitting';
    this._networkErrorText = '';

    const payload = {
      name: this._name.trim(),
      email: this._email.trim(),
      message: this._message.trim(),
    };

    try {
      const fn = this.submitFn || this._defaultSubmit;
      await fn(payload);
      this._status = 'success';
      this.dispatchEvent(
        new CustomEvent('ag-contact-submitted', {
          detail: payload,
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this._status = 'network-error';
      this._networkErrorText = err?.message || this.networkErrorMsg;
    }
  }

  /**
   * Placeholder de envío. Se usa SOLO si no se pasa `submitFn`.
   *
   * TODO (backend): reemplazar este método por una llamada real al endpoint
   * de contacto. Ejemplo:
   *
   *   async _defaultSubmit(data) {
   *     const res = await fetch('/api/contact', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify(data),
   *     });
   *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
   *     return res.json();
   *   }
   *
   * Alternativamente, la consumer page puede pasar `submitFn` sin tocar
   * este organismo.
   */
  async _defaultSubmit(_data) {
    // TODO: conectar al endpoint real cuando el backend esté listo
    return new Promise((resolve) => setTimeout(resolve, 800));
  }

  /* ---------- Field handlers ---------- */

  _onNameInput(e) {
    this._name = e.detail.value;
    if (this._nameError) this._nameError = false;
  }

  _onEmailInput(e) {
    this._email = e.detail.value;
    if (this._emailError) this._emailError = false;
  }

  _onMessageInput(e) {
    this._message = e.detail.value;
    if (this._messageError) this._messageError = false;
  }

  _onClickSubmit() {
    this._handleSubmit();
  }

  /* ---------- Render ---------- */

  render() {
    if (this._status === 'success') return this._renderSuccess();
    return this._renderForm();
  }

  _renderForm() {
    const submitting = this._status === 'submitting';
    return html`
      <div class="head">
        <span>${this.formHeadFile}</span>
        <span class="head-status">${this.formHeadStatus}</span>
      </div>

      <ag-molecule-form-field
        label=${this.nameLabel}
        required
        ?error=${this._nameError}
        errorMsg=${this.nameErrorMsg}
      >
        <ag-atom-input
          type="text"
          name="name"
          placeholder=${this.namePlaceholder}
          required
          ?error=${this._nameError}
          .value=${this._name}
          @ag-input=${this._onNameInput}
        ></ag-atom-input>
      </ag-molecule-form-field>

      <ag-molecule-form-field
        label=${this.emailLabel}
        required
        ?error=${this._emailError}
        errorMsg=${this.emailErrorMsg}
      >
        <ag-atom-input
          type="email"
          name="email"
          placeholder=${this.emailPlaceholder}
          required
          ?error=${this._emailError}
          .value=${this._email}
          @ag-input=${this._onEmailInput}
        ></ag-atom-input>
      </ag-molecule-form-field>

      <ag-molecule-form-field
        label=${this.messageLabel}
        required
        ?error=${this._messageError}
        errorMsg=${this.messageErrorMsg}
      >
        <ag-atom-textarea
          name="message"
          placeholder=${this.messagePlaceholder}
          required
          maxlength=${this.maxChars}
          ?error=${this._messageError}
          .value=${this._message}
          @ag-input=${this._onMessageInput}
        ></ag-atom-textarea>
      </ag-molecule-form-field>

      ${this._status === 'network-error'
        ? html`<div class="error-banner" role="alert">${this._networkErrorText}</div>`
        : ''}

      <div class="foot">
        <span class="count">${this._message.length} / ${this.maxChars}</span>
        <ag-atom-button
          variant="send"
          type="button"
          ?disabled=${submitting}
          @ag-click=${this._onClickSubmit}
        >
          ${submitting ? this.submittingLabel : this.submitLabel}
        </ag-atom-button>
      </div>
    `;
  }

  _renderSuccess() {
    const firstName = (this._name.trim().split(/\s+/)[0]) || this.successFallbackName;
    return html`
      <div class="success">
        <div class="check" aria-hidden="true">✓</div>
        <ag-atom-heading level="3" variant="card" style="--ag-heading-size: 1.75rem">
          <ag-atom-gradient-text>${this.successTitle}</ag-atom-gradient-text>
        </ag-atom-heading>
        <ag-atom-text
          variant="meta"
          style="--ag-text-size: var(--text-md); --ag-text-color: var(--cyan)"
        >
          ${this.successSuffix} ${firstName}.
        </ag-atom-text>
      </div>
    `;
  }
}

customElements.define('ag-organism-contact-form', AgOrganismContactForm);
