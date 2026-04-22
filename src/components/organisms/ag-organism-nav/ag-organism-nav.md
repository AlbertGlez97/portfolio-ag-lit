# ag-organism-nav

> Nav principal fixed al top: logo + links con active scroll-based via IntersectionObserver. Backdrop blur + opacity shift al hacer scroll.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| links | Array | [] | `[{ href, sectionId, idx, label, keep? }]` — entradas del nav |
| scrolled | Boolean | false | Auto-gestionado por scroll (>16px). NO setear manualmente. |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Los clicks de los nav-links los maneja el router global |

## Métodos públicos

| Método | Descripción |
|--------|-------------|
| `refreshObserver()` | Re-escanea el DOM buscando los `sectionId` y reinicia el IntersectionObserver. Llamar tras navegación entre páginas. |

## Uso

```html
<ag-organism-nav .links=${[
  { href: '/#proyectos',   sectionId: 'proyectos',   idx: '01', label: 'Proyectos' },
  { href: '/laboratorio',  sectionId: 'laboratorio', idx: '02', label: 'Laboratorio' },
  { href: '/#terminal',    sectionId: 'terminal',    idx: '03', label: 'Terminal' },
  { href: '/#contacto',    sectionId: 'contacto',    idx: '04', label: 'Contacto', keep: true },
]}></ag-organism-nav>
```

## Requisito de las páginas consumidoras

Las pages que alberguen los sections configurados (`#proyectos`, `#terminal`, `#laboratorio`, `#contacto`) **deben renderizar en light DOM**, no en shadow. Esto se consigue overrideando `createRenderRoot` en cada page:

```js
class AgPageLanding extends LitElement {
  createRenderRoot() { return this; }
  // ...
}
```

De esta forma los `id` de los sections viven en el DOM global del documento y `document.getElementById` del nav los encuentra sin magia extra (sin MutationObserver, sin listeners custom, sin pasar refs manualmente).

Aplica a: `ag-page-landing`, `ag-page-laboratorio`, `ag-page-article`.

Tradeoff aceptado: los estilos CSS de las pages no quedarían encapsulados. Se mitiga dejando que las pages SOLO compongan organismos (que sí encapsulan) — sin estilos propios en su `styles.js` (o directamente sin `.styles.js` en el caso de las pages).

## Notas

- **Active link NO es route-based, es scroll-based**: usa IntersectionObserver con `rootMargin: -40% 0px -40% 0px` — la sección queda activa cuando cruza la franja central del viewport. En rutas sin sections configuradas (ej: `/laboratorio` standalone), ningún link está activo — comportamiento esperado.
- **Sections en light DOM**: requisito obligatorio (ver sección anterior).
- **Fallback de scroll**: si `links` se setea antes de que las sections existan en DOM, la setup se reintenta al primer scroll. También se puede forzar con `refreshObserver()` (útil tras cambio de página).
- **Atributo `scrolled` en el host**: se gestiona solo vía `window.scrollY > 16`. El CSS `:host([scrolled])` activa borde inferior y background opaco.
- **Logo siempre a `/`**: hardcodeado. Si se necesitase otro destino, se expone una prop — por ahora YAGNI.
- **Gap entre links**: 0.375rem (6px). Menor que el espacio habitual para que los nav-links se sientan como un grupo compacto.
