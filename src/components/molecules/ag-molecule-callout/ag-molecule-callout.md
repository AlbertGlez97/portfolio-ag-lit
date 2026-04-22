# ag-molecule-callout

> Callout destacado del artículo: borde cyan izquierdo + fondo cyan suave + icon redondo + título uppercase + contenido por slot.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| title | String | '' | Título uppercase |
| icon | String | '!' | Glyph del icon central |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Párrafo(s) del callout |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Molécula sin eventos |

## Uso

```html
<ag-molecule-callout title="Nota importante">
  <p>Esto solo funciona bien en <strong>WebGL 2.0</strong>. En WebGL 1 el bucle <code>for</code> debe tener un límite constante...</p>
</ag-molecule-callout>
```

## Notas

- **Párrafo por slot**: el consumidor pasa un `<p>` con rich content (strong, code, etc.). El `::slotted(p)` normaliza margin/color/size para que encaje.
- **Una sola variante cyan** por ahora. Si aparece un callout "warning" (naranja) o "error", se agrega una prop `kind`.
- El título se omite si está vacío — útil para callouts informativos sin headline.
