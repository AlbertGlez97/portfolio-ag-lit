# ag-organism-hero

> Hero del landing: aurora animada (3 blobs), grid overlay, heading display con gradient + caret, subtitle, command con typing loop, CTAs y corner absoluto.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| availability | String | '' | Texto de disponibilidad (hero-meta) |
| coordinates | String | '' | Coordenadas (hero-meta) |
| firstName | String | '' | Primera línea del heading (plain fg) |
| lastName | String | '' | Segunda línea del heading (gradient cyan→purple) |
| subtitle | String | '' | Texto bajo el heading (ej: "Full Stack Developer × IA") |
| promptLabel | String | '' | Prompt del hero-command (ej: "~/alberto") |
| heroPhrases | Array | [] | Frases del typing loop |
| ctaProjectsLabel | String | '' | Label del CTA primary |
| ctaProjectsHref | String | '#proyectos' | Destino del CTA primary |
| ctaTerminalLabel | String | '' | Label del CTA ghost |
| ctaTerminalHref | String | '#terminal' | Destino del CTA ghost |
| cornerHint | String | '' | Hint del corner (ej: "scroll ↓") |
| cornerPagination | String | '' | Paginación del corner (ej: "01 / 08") |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo el contenido llega por props |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Los clicks de CTAs los maneja el router global |

## Uso

```html
<ag-organism-hero
  availability="Disponible para proyectos · Q3 2025"
  coordinates="40.4168° N · 3.7038° W"
  firstName="ALBERTO"
  lastName="GONZÁLEZ"
  subtitle="Full Stack Developer × IA"
  promptLabel="~/alberto"
  .heroPhrases=${[
    'npx create-portfolio@next --flavor=ai',
    'git commit -m "shipping calm, powerful software"',
    'nvim ~/ideas/next-big-thing.md',
    'pnpm run ship',
  ]}
  ctaProjectsLabel="[ Ver proyectos ]"
  ctaTerminalLabel="Acceder al terminal"
  cornerHint="scroll ↓"
  cornerPagination="01 / 08"
></ag-organism-hero>
```

## Notas

- **Aurora simplificada**: 3 blobs (cian, purple, blue) con `filter: blur(5rem)` y `opacity: 0.15` cada uno. Más sutil que la maqueta original (que usaba radial-gradient + saturación + 0.55 aurora-opacity). Drift de 14/16/18s con `translate + scale` en `alternate`.
- **Grid overlay**: doble linear-gradient con color `rgba(255,255,255,0.015)` (casi invisible), tamaño 4.5rem × 4.5rem, máscara radial elíptica central para fade en bordes.
- **Typing loop es organism-level**: el organismo mantiene `_typed` como state, rota `heroPhrases`, y pasa el frame actual a `ag-molecule-hero-command`. Cadencia: 38–78ms por carácter al tipear, 16ms al borrar, 2s pausa al completar, 300ms entre frases. Se detiene limpio en `disconnectedCallback` vía flag `_typingActive`.
- **Reveal escalonado CSS puro**: cada hijo directo de `.wrap` tiene `animation: hero-reveal 0.7s ease-out both` con `animation-delay` de 0 / 120 / 240 / 360 / 480ms. Sin IntersectionObserver — el hero siempre está visible al cargar.
- **Heading display con dos líneas**: se logra metiendo dos `<div>` adentro del `<ag-atom-heading>`. El `display: -webkit-box` interno del heading con `-webkit-box-orient: vertical` los stackea. La gradient-text + caret hero viven en el segundo div.
- **Subtitle no usa `ag-atom-text`**: tiene tipografía propia (display 1.375rem / 22px, fg, weight 500) con una barra cian previa. No encaja en ninguna variant de text; se deja como `<div>` con styling local.
- **`×` en el subtitle**: llega como parte del string. Si se quiere pintar el separador más dim, el consumer puede usar HTML inline en `subtitle` (pero eso rompería el contrato String).
