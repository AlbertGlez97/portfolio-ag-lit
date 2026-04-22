# ag-organism-footer

> Footer del sitio: barra con borde-top, dos slots (left / right) y layout flex con wrap responsive.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Organismo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| left | Contenido izquierdo (copyright) |
| right | Contenido derecho (tagline con acento cian) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Organismo sin eventos |

## Uso

```html
<ag-organism-footer>
  <ag-atom-text slot="left" variant="meta">
    Diseñado y construido por Alberto González — 2025
  </ag-atom-text>
  <ag-atom-text slot="right" variant="meta">
    Hecho con <span style="color: var(--cyan)">♥</span> y demasiado café
  </ag-atom-text>
</ag-organism-footer>
```

## Notas

- **Slots, no props**: el footer acepta slots en lugar de strings como props para permitir rich content (ej: el corazón cian en el tagline). El consumer decide el markup.
- **`role="contentinfo"`** aplicado automáticamente en el host — landmark semántico correcto para un footer del sitio.
- **Layout responsive automático**: flex con `space-between` en desktop, `wrap` con `gap` cuando no caben en la misma fila. Padding del wrapper se reduce en ≤45rem.
- **Estilado del corazón**: el consumer aplica `style="color: var(--cyan)"` inline sobre el `<span>` del corazón. Los estilos inline cruzan el shadow DOM sin problema (son del elemento mismo, no del contexto).
- **Border-top tenue**: usa `var(--line)` para dibujar la línea separadora. Misma intensidad que el nav al hacer scroll.
