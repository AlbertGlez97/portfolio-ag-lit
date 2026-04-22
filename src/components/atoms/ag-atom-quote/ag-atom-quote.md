# ag-atom-quote

> Blockquote con borde cian izquierdo, texto display italic, y fuente opcional en mono uppercase.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Átomo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto de la cita |
| cite | Fuente/autor (opcional) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- Con cita -->
<ag-atom-quote>
  Menos dashboards, más herramientas.
  <span slot="cite">Alberto González</span>
</ag-atom-quote>

<!-- Sin cita -->
<ag-atom-quote>La simplicidad se construye; no se encuentra.</ag-atom-quote>
```

## Notas

- **Cite opcional sin render vacío**: el `<slot name="cite">` no proyecta nada si el consumidor no pasa contenido — cero residuo visual. Estilo aplicado vía `::slotted([slot="cite"])`.
- **Tag semántica `<blockquote>`** — accesible y correcta para citas.
- **No tiene variants**: una sola estética por ahora. Si aparece un pull-quote grande o citas secundarias, se agrega variant.
