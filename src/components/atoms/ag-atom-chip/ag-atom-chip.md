# ag-atom-chip

> Chip presionable con dos variantes: filtro seleccionable del Laboratorio (con contador opcional) y disparador de comandos del Terminal (con prompt `$`).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| variant | String | 'filter' | `filter` (laboratorio) · `command` (terminal) |
| active | Boolean | false | Solo `variant="filter"` — chip seleccionado. Lo gestiona el organismo padre. |
| count | Number | null | Solo `variant="filter"` — contador opcional (se pinta zero-pad a 2 dígitos). |
| cmd | String | '' | Solo `variant="command"` — nombre del comando a emitir al hacer click. |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Etiqueta del chip (ej: "Three.js", "whoami", "Todos"). |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| ag-chip-select | `{ variant, active }` | Click o Enter/Space en `variant="filter"`. `active` es el estado PRE-click — el padre decide el nuevo. |
| ag-chip-command | `{ cmd }` | Click o Enter/Space en `variant="command"`. |

## Uso

```html
<!-- Filtros del Laboratorio (el organismo padre gestiona qué chip está activo) -->
<ag-atom-chip variant="filter" active count="12">Todos</ag-atom-chip>
<ag-atom-chip variant="filter" count="4">Three.js</ag-atom-chip>
<ag-atom-chip variant="filter" count="3">IA</ag-atom-chip>

<!-- Comandos del Terminal -->
<ag-atom-chip variant="command" cmd="whoami">whoami</ag-atom-chip>
<ag-atom-chip variant="command" cmd="skills">skills</ag-atom-chip>
<ag-atom-chip variant="command" cmd="help">help</ag-atom-chip>
```

### Patrón de consumo típico (filter en organismo)

```js
html`
  ${filters.map((f) => html`
    <ag-atom-chip
      variant="filter"
      ?active=${this.active === f.id}
      count=${f.count}
      @ag-chip-select=${() => this._select(f.id)}
    >${f.label}</ag-atom-chip>
  `)}
`;
```

El organismo cierra sobre `f.id` — el chip no necesita un `value` para identificarse, el closure del handler ya lo sabe.

## Notas

- **El átomo NO hace toggle interno**: en filter, el `active` lo pone el padre. Al emitir `ag-chip-select`, el padre decide qué chip queda seleccionado (mutex, múltiple, inverso, lo que haga falta). El átomo se mantiene dumb; la lógica de selección vive en el organismo.
- **El prompt `$` es del átomo**: en `variant="command"`, NO escribas `$ whoami` en el contenido — el átomo lo antepone con su color dimmer. Pasá solo el nombre del comando en el slot.
- **Zero-pad automático**: `count="4"` se pinta como `04`. Números ≥ 100 se muestran tal cual (`150` → `150`).
- **Accesibilidad**: el chip tiene `role="button"` y `tabindex="0"`. Enter y Space disparan el click. En `variant="filter"` expone `aria-pressed="true|false"` sincronizado con `active`.
- **Foco visible**: el chip dibuja un outline cian vía `:host(:focus-visible)`. El reset global no cruza el shadow DOM, así que el estilo vive dentro del átomo.
- **¿Por qué el detail del select trae `active` si el padre ya lo sabe?**: respeta el contrato documentado. Para mutex puro el dato es redundante, pero para toggles independientes permite derivar el nuevo estado con `!active` sin consultar el target.
