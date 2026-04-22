# ag-atom-logo

> Logo del nav: cuadrado gradient cian→purple con glow + texto "AG.dev" en mono. Todo dentro de un link al home.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| href | String | '/' | Destino del logo (el router intercepta el click) |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots (el contenido "AG.dev" es fijo) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos propios (el click lo maneja el router) |

## Uso

```html
<ag-atom-logo></ag-atom-logo>
<ag-atom-logo href="/"></ag-atom-logo>
```

## Notas

- **Contenido fijo**: "AG" + "." + "dev" son literales. El color del punto y del sufijo vienen del CSS. Si en el futuro hiciera falta cambiar el texto (rebrand), se agrega una prop `name` — por ahora YAGNI.
- **El cuadrado gradient está dentro del `<a>`**, no como `::before` del host. Esto garantiza que todo el logo sea clickeable.
- **`aria-hidden` en el cuadrado** porque es puramente decorativo. El `aria-label` del anchor describe el link.
