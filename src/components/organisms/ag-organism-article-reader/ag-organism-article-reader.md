# ag-organism-article-reader

> Lector de artículo individual: header (breadcrumb + tags + título + byline) + layout TOC sticky 240px / content 720px con renderizado tipado de bloques.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| article | Object | null | Datos completos del artículo (ver shape abajo) |
| tocLabel | String | 'En este artículo' | Título del TOC |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo por la prop `article` |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | TOC click hace scroll interno (sin evento propio) |

## Shape de `article`

```js
{
  breadcrumb: [{ label, href? }],
  tags: ['threejs', 'shaders'],  // array de tag IDs; se renderizan como chips
  tagsLabels: {                  // mapa id → label (fallback al id si falta)
    threejs: 'Three.js',
    shaders: 'Shaders',
  },
  title: '...',               // texto del h1 (plain fg)
  titleAccent: 'GPU',         // opcional — parte con gradient cyan→purple
  byline: {
    initial, author, date, readTime, updated
  },
  toc: [{ id, label }],       // precomputado para la sidebar
  body: [Block, Block, ...],  // secuencia de bloques
}
```

## Tipos de bloque soportados en `body[]`

```js
{ type: 'h2', id, n, text }
{ type: 'lede', text }      // primer letra se wrappea en drop-cap Fraunces
{ type: 'p', text }         // text puede incluir <strong>, <em>, <code>, <a>
{ type: 'code', lang, file, lines: [] }
{ type: 'figure', num, svg, caption }
{ type: 'callout', title, text }
{ type: 'quote', text, cite? }
```

## Uso

```html
<ag-organism-article-reader .article=${articleData}></ag-organism-article-reader>
```

## Notas

- **Agrupación en `<section>` por h2**: `_groupBySections` camina el array de bloques; cada `h2` inicia una section nueva incluyendo sus bloques hermanos hasta el próximo h2. Las sections llevan `id` del h2 para anclaje y observer.
- **IntersectionObserver en las sections**: mismo patrón que el nav — `rootMargin: -40% 0px -40% 0px`. La section que cruza la franja central queda `active` en el TOC. Observer se reconecta en cada cambio de `article`.
- **Click en TOC item hace `scrollIntoView({ behavior: 'smooth' })`**: scroll-margin-top 6.25rem respeta el nav y deja aire.
- **Drop-cap de lede**: el organismo wrappea la primera letra del `lede.text` en un `<span class="drop-cap">` y el resto pasa por `unsafeHTML`. El span lleva font serif (Fraunces) 3.75rem, float left, color cian.
- **`unsafeHTML` para body / lede / callout / quote**: el texto viene de content.json (trusted) y puede tener markup inline (`<strong>`, `<code>`, `<a>`). Si content.json se llena desde un CMS público en el futuro, hay que sanitizar antes.
- **TOC sidebar colapsa a bloque en ≤60rem (960px)**: se vuelve un card con borde + bg translúcido arriba del content. Deja de ser sticky (no tiene sentido en stack vertical).
- **Header con grid de fondo + mask radial**: repite el tratamiento del hero a menor escala. Elipse centrada en 15%/40% para dar depth sin distraer del título.
- **TOC auto-oculto si vacío**: si `article.toc` está vacío, se renderiza un `<div></div>` placeholder en la primera columna del grid (mantiene el layout). Si preferís que el content tome todo el ancho, habría que hacer grid condicional — pendiente.
- **Shadow + anchors**: los section ids viven en shadow DOM del organismo. No son accesibles por URL hash (`#intro` en la URL no va a scrollear automáticamente). Si se necesita deep-linking por hash, el organismo debe leer `location.hash` en `firstUpdated` y hacer scroll manualmente.
