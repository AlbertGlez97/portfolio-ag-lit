# ag-molecule-byline

> Firma del artículo: avatar gradient + autor + fecha + read time + update opcional.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| initial | String | 'A' | Letra del avatar |
| author | String | '' | Nombre del autor |
| date | String | '' | Fecha ya formateada (la molécula no formatea) |
| readTime | String | '' | Texto completo (ej: "8 min de lectura") |
| updated | String | '' | Update opcional; si está vacío no se renderiza |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Molécula sin eventos |

## Uso

```html
<ag-molecule-byline
  author="Alberto González"
  date="12 Abr 2025"
  readTime="8 min de lectura"
  updated="actualizado hace 3 días"
></ag-molecule-byline>
```

## Notas

- **Strings ya localizados**: la molécula no formatea `readMinutes → "X min de lectura"` ni fechas. El caller (página) hace la i18n y pasa las strings finales. Mantiene la molécula presentacional y agnóstica de locale.
- Usa `ag-atom-avatar` para la inicial.
- `updated` se omite si está vacío — no aparece el bullet ni el texto.
