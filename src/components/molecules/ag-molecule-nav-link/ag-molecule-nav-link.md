# ag-molecule-nav-link

> Link del nav con número prefijo, hover tenue, estado active cian y visibility responsive. Se oculta en mobile salvo que lleve `keep`.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| href | String | '' | Destino del link (el router global intercepta) |
| idx | String | '' | Número o prefijo (ej: "01", "02") |
| active | Boolean | false | Estado seleccionado; lo pone el organismo nav |
| keep | Boolean | false | Si true, mantiene visible en viewports ≤ 720px |

## Slots

| Slot | Descripción |
|------|-------------|
| (default) | Texto del link (ej: "Proyectos", "Laboratorio") |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | El click lo intercepta el router; la molécula no emite eventos |

## Uso

```html
<ag-molecule-nav-link href="/" idx="01" ?active=${route === '/'}>
  Proyectos
</ag-molecule-nav-link>

<ag-molecule-nav-link href="/laboratorio" idx="02" ?active=${route.startsWith('/laboratorio')}>
  Laboratorio
</ag-molecule-nav-link>

<ag-molecule-nav-link href="/#contacto" idx="04" keep>
  Contacto
</ag-molecule-nav-link>
```

## Notas

- **No usa átomos internos**. El sistema de nav-link (color dim, hover bg blanco translúcido, idx prefijo) difiere del `ag-atom-link` (underline cian del cuerpo del artículo). Son dos sistemas distintos — atomic design permite moléculas con estilo propio cuando los átomos no encajan.
- **Controlled by parent**: el `active` lo setea el organismo nav según la ruta o el scroll position. La molécula no calcula nada.
- **Visibility responsive vive acá**: `@media (max-width: 720px) :host(:not([keep])) { display: none; }`. Cada link decide si se oculta; el organismo nav no tiene que gestionar responsive por link.
- **`aria-current="page"`** sincronizado con `active` — los lectores de pantalla anuncian la ruta activa sin trabajo extra del organismo.
