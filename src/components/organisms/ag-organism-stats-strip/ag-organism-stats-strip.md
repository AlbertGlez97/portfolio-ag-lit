# ag-organism-stats-strip

> Barra horizontal con 4 stats (número + unidad cian + label) entre el hero y la sección de proyectos. Bordes superior e inferior tenues, colapsa a 2 columnas en tablets.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| stats | Array | [] | `[{ id, value, unit, label }]` — entradas del strip |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todos los stats llegan por prop |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Organismo sin eventos |

## Uso

```html
<ag-organism-stats-strip .stats=${[
  { id: 'years',     value: '5',  unit: '+',   label: 'Años de exp.' },
  { id: 'projects',  value: '20', unit: '+',   label: 'Proyectos entregados' },
  { id: 'curiosity', value: '∞',  unit: '',    label: 'Curiosidad' },
  { id: 'coffee',    value: '01', unit: '/h',  label: 'Cafés por hora' },
]}></ag-organism-stats-strip>
```

## Notas

- **Separadores verticales**: los dibuja `ag-molecule-stat` con su `border-left`. El primer stat no lleva borde gracias a `:host(:first-child)` en la molécula — sin cálculos en el organismo.
- **Responsive simple**: grid 4-col en desktop → 2-col en ≤51.25rem (820px) → mismo 2-col con padding reducido en ≤45rem. La molécula ajusta su propio padding interno en los breakpoints.
- **Sin reveal animation**: el strip vive justo debajo del hero, usualmente ya visible al cargar. Si hace falta animación de entrada en el futuro, se agrega con `animation-delay` escalonado a los stats via `:nth-child` (mismo patrón que el hero).
- **`id` en stats no se usa todavía**: es para referencia externa (tracking, testing, analytics). Hoy el organismo solo renderiza.
