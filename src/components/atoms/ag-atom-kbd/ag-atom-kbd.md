# ag-atom-kbd

> Tecla o atajo de teclado en una caja pequeña con borde tenue.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| — | — | — | Átomo sin propiedades |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Símbolo o texto de la tecla |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<ag-atom-kbd>⌘K</ag-atom-kbd>
<ag-atom-kbd>/</ag-atom-kbd>
<ag-atom-kbd>Esc</ag-atom-kbd>
```

## Notas

- Tamaño fijo 11px — la maqueta tiene también 10px en el search box pero la diferencia es imperceptible. Se unificó en 11px.
- El kbd NO captura teclado — es solo visual. La lógica del atajo vive en el organismo que lo muestra (`ag-organism-terminal` registra `⌘K`, `ag-organism-articles-board` registra `/`).
