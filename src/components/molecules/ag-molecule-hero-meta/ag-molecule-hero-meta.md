# ag-molecule-hero-meta

> Línea superior del hero: pulse cian + disponibilidad + divider vertical + coordenadas.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| availability | String | '' | Texto de disponibilidad (ya localizado) |
| coordinates | String | '' | Coordenadas / ubicación en formato libre |

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
<ag-molecule-hero-meta
  availability="Disponible para proyectos · Q3 2025"
  coordinates="40.4168° N · 3.7038° W"
></ag-molecule-hero-meta>
```

## Notas

- Usa `ag-atom-pulse` y `ag-atom-divider` (orientación vertical).
- Las coordenadas están en mayúsculas vía `text-transform: uppercase`.
