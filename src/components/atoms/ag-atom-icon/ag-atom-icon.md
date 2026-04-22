# ag-atom-icon

> Contenedor normalizado para SVG inline. Aplica tamaño y hereda `color` vía `currentColor`.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| size | Number | 16 | Tamaño en píxeles (alto y ancho, siempre cuadrado) |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Un elemento `<svg>` inline. Se recomienda `stroke="currentColor"`. |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<ag-atom-icon size="15" style="color: var(--cyan);">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <path d="m20 20-3.5-3.5"/>
  </svg>
</ag-atom-icon>
```

## Notas

- **Custom property interna `--_ag-icon-size`** — se setea desde `updated()`. El underscore prefijo indica que es privada del átomo; no la sobreescribas desde afuera, usá la prop `size`.
- **`currentColor`** — el icon hereda el color del contenedor. Para colorearlo usá `style="color: ..."` o simplemente dejá que herede.
- **SVG 100% por slotted** — el CSS `::slotted(svg)` fuerza `width: 100%; height: 100%` para que el SVG llene el contenedor sin importar su viewBox.
- No se maneja `aria-label` desde el átomo — el contexto lo da el consumidor (si el icon es decorativo va `aria-hidden="true"` en el consumer; si tiene significado, un `aria-label` adecuado).
