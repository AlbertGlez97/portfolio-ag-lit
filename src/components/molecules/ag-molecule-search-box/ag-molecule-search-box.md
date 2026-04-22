# ag-molecule-search-box

> Caja de búsqueda del laboratorio: lupa cian + input transparente + kbd hint. Expone `focus()` para atajos globales.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| value | String | '' | Valor del input |
| placeholder | String | '' | Placeholder |
| kbdHint | String | '/' | Tecla mostrada a la derecha (vacío → no se muestra) |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Molécula sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-input | `{ value }` | Al tipear |

## Uso

```html
<ag-molecule-search-box
  placeholder="Buscar artículo..."
  @ag-input=${(e) => (this.query = e.detail.value)}
></ag-molecule-search-box>
```

## Notas

- **NO usa `ag-atom-input`** — los estilos son incompatibles (bg transparente, sin borde/padding propio). Documentado desde el átomo.
- **Método `focus()` público**: el organismo registra la tecla `/` globalmente y llama `searchBox.focus()` al dispararse.
- **SVG lupa hardcoded**: es parte del semántico del componente (no configurable).
- Usa `ag-atom-icon` (size 15, color cian) y `ag-atom-kbd`.
