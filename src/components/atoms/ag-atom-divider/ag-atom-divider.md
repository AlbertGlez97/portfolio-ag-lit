# ag-atom-divider

> Separador sólido o dashed, horizontal o vertical. Aplica `role="separator"` automáticamente.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| orientation | String | 'horizontal' | `horizontal` · `vertical` |
| variant | String | 'solid' | `solid` · `dashed` |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<!-- Línea bajo el header del artículo -->
<ag-atom-divider></ag-atom-divider>

<!-- Separador dashed del card-foot -->
<ag-atom-divider variant="dashed"></ag-atom-divider>

<!-- Separador vertical entre hero-meta items -->
<ag-atom-divider orientation="vertical"></ag-atom-divider>
```

## Notas

- **Vertical default 14px** — replica el `.hero-meta .sep` de la maqueta. Para otras alturas, usa `style="height: ..."` en el consumidor.
- **`role="separator"`** se aplica en `connectedCallback`; se puede sobreescribir pasando `role="presentation"` si el divider es puramente decorativo.
- **Sin slots ni contenido** — el átomo es CSS puro, render vacío.
