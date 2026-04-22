# ag-organism-contact-form

> Formulario de contacto: 3 campos (name, email, message), validación cliente, estados de loading / success / network-error, submit delegado a `submitFn` del consumer (o placeholder con TODO si no se pasa).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| formHeadFile | String | '' | Texto izquierdo del head (ej: "new_message.txt") |
| formHeadStatus | String | '' | Texto derecho del head con dot cian (ej: "conexión segura") |
| nameLabel, namePlaceholder, nameErrorMsg | String | '' | Textos del campo name |
| emailLabel, emailPlaceholder, emailErrorMsg | String | '' | Textos del campo email |
| messageLabel, messagePlaceholder, messageErrorMsg | String | '' | Textos del campo message |
| maxChars | Number | 1000 | Máximo de caracteres del textarea |
| submitLabel | String | '' | Label del botón enviar |
| submittingLabel | String | 'Enviando…' | Label mientras se envía |
| successTitle | String | 'Mensaje enviado' | Título del estado success |
| successSuffix | String | 'Te respondo pronto,' | Texto antes del nombre en success |
| successFallbackName | String | 'amig@' | Nombre si no se detecta primer nombre |
| networkErrorMsg | String | 'No pude enviar el mensaje...' | Mensaje ante error de red |
| submitFn | Function | null | Async function `(data) => Promise` — submit delegado |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-contact-submitted | `{ name, email, message }` | Tras éxito del submit (submitFn resolvió o placeholder completó) |

## Uso

```html
<ag-organism-contact-form
  formHeadFile="new_message.txt"
  formHeadStatus="conexión segura"
  nameLabel="Nombre"
  namePlaceholder="Cómo te llamas"
  nameErrorMsg="Necesito saber con quién hablo."
  emailLabel="Email"
  emailPlaceholder="tu@correo.com"
  emailErrorMsg="Ese email no se ve muy bien."
  messageLabel="Mensaje"
  messagePlaceholder="Cuéntame en qué estás pensando..."
  messageErrorMsg="Cuéntame algo, aunque sea un párrafo."
  submitLabel="[ Enviar mensaje ]"
  .submitFn=${async (data) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }}
></ag-organism-contact-form>
```

## Flujo del submit

1. Usuario clickea el botón `[ Enviar mensaje ]`. El organismo escucha `ag-click` (NO se usa submit nativo del `<form>` — hay razones, ver notas).
2. `_validate()` chequea name no vacío, email con regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`, y message ≥ 10 chars. Si falla, setea los flags de error y retorna sin enviar.
3. `_status = 'submitting'` → el botón queda disabled y cambia al `submittingLabel`.
4. Llama `submitFn(payload)` si viene por prop. Si no, llama `_defaultSubmit` (placeholder que resuelve tras 800ms con TODO).
5. Si resuelve: `_status = 'success'`, emite `ag-contact-submitted`, el render pasa al estado success (reemplaza el form).
6. Si rechaza: `_status = 'network-error'`, muestra banner naranja inline con el `err.message` o el `networkErrorMsg` por defecto. El form se preserva para reintentar.

## TODO: backend real

**El organismo NO hace el fetch real**. Hay dos formas de conectar al endpoint:

**Opción A (recomendada)**: la page pasa `submitFn` como prop:

```js
.submitFn=${async (data) => {
  const res = await fetch('/api/contact', { ... });
  if (!res.ok) throw new Error('...');
}}
```

**Opción B**: editar `_defaultSubmit` dentro de este organismo y reemplazar el `setTimeout` por el fetch real. Hay un `TODO` comment marcado en el código donde va.

Se prefiere Opción A — deja el organismo agnóstico del backend y permite testear el UX con mocks fácilmente.

## Notas

- **No se usa submit nativo del `<form>`**: los inputs viven en el shadow DOM de `ag-atom-input` y el form-find del browser no cruza boundaries sin `ElementInternals` (`formAssociated`). La ruta simple es escuchar `ag-click` del botón send y manejar submit manualmente.
- **Enter no dispara submit** por el mismo motivo (sin `<form>` nativo asociado). Para MVP es aceptable — si se vuelve molesto, se agrega handler `@keydown` en un wrapper con detección de Enter (excluyendo textarea).
- **Validación mínima al submit, no on-input**: errores aparecen solo al intentar enviar. Al tipear en un campo con error, el error se limpia (mejor UX que validar en cada keystroke).
- **`success` reemplaza el form**: `render()` retorna el success template; el form se desmonta del DOM. Si el consumer quisiera permitir enviar otro mensaje, tendría que recrear el organismo (ej: clave de Lit para forzar re-mount). Por ahora, un submit por carga de página es suficiente.
- **`network-error` preserva el form**: el banner naranja aparece arriba del foot, el usuario puede corregir y reintentar. El mensaje viene del `err.message` thrown o del `networkErrorMsg` default.
- **`_name` primer split** para el success: `this._name.trim().split(/\s+/)[0]`. Si está vacío cae al `successFallbackName` ("amig@").
- **`maxlength` nativo** en el textarea más el `count` visible — el browser corta al pasar del límite; el contador actualiza en tiempo real vía `ag-input`.
- **Shadow DOM backdrop-filter**: `:host` tiene `backdrop-filter: blur(0.5rem)` para el efecto glass. Requiere que haya algo pintado detrás (aurora del hero, bg del section, etc.).
