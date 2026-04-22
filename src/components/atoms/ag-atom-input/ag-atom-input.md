# ag-atom-input

> Input de texto o email con estado de error. Variante de formulario (fondo oscuro, borde, radius, focus cian). No se usa para el search box del laboratorio.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| type | String | 'text' | `text` · `email` |
| value | String | '' | Valor actual |
| placeholder | String | '' | Texto placeholder |
| name | String | '' | Nombre del campo (para formularios) |
| required | Boolean | false | Marca el input como requerido |
| error | Boolean | false | Activa el estado de error (borde naranja) |
| disabled | Boolean | false | Deshabilita el input |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-input | `{ value }` | Al tipear cada carácter |
| ag-change | `{ value }` | Al perder el foco o submit |

## Uso

```html
<ag-atom-input
  type="email"
  name="email"
  placeholder="tu@correo.com"
  ?error=${this.emailError}
  @ag-input=${(e) => (this.email = e.detail.value)}
></ag-atom-input>
```

## Notas

- **Form submission con shadow DOM**: los valores NO fluyen al `FormData` nativo si el input vive en shadow. El organismo del contact form debe leer `.value` de cada átomo o suscribirse a `ag-input`/`ag-change`.
- **`.value` binding**: uso `.value=${this.value}` (dot prefix) para setear la propiedad, no el atributo. Esencial para que el input refleje cambios externos.
- **`caret-color: var(--cyan)`**: el cursor es cian dentro del input, coherente con el resto del diseño.
