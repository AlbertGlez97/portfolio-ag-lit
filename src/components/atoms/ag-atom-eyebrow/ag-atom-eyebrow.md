# ag-atom-eyebrow

> Eyebrow de sección — texto corto en mayúsculas precedido por una barra cian de 24px.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Átomo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto del eyebrow (ej: "01 · Proyectos") |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<ag-atom-eyebrow>01 · Proyectos</ag-atom-eyebrow>
<ag-atom-eyebrow>02 · El Laboratorio</ag-atom-eyebrow>
<ag-atom-eyebrow>04 · Contacto</ag-atom-eyebrow>
```

## Notas

- El texto no se transforma a mayúsculas por JS — usa `text-transform: uppercase` en CSS. Pasá el texto en cualquier capitalización, se muestra igual.
- La barra cian es un `::before` del host; no existe en el slot.
- Margin vertical es responsabilidad del contenedor. El átomo solo define su propia caja.
