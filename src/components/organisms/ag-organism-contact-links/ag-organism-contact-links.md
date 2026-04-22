# ag-organism-contact-links

> Columna izquierda de contacto: título (con gradient en línea 2) + intro + lista vertical de `ag-molecule-contact-link`.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| titleLine1 | String | '' | Primera línea del título (plain fg) |
| titleAccent | String | '' | Segunda línea (gradient cyan→purple) |
| intro | String | '' | Párrafo intro |
| links | Array | [] | `[{ id, label, value, href }]` |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Los clicks de cada link los maneja el browser (mailto:, https://, tel:) |

## Uso

```html
<ag-organism-contact-links
  titleLine1="Hablemos de tu"
  titleAccent="próximo proyecto."
  intro="Consultoría, contratos fijos o sólo para decir hola. Respondo en menos de 24h."
  .links=${[
    { id: 'email',    label: 'Email',    value: 'hola@albertogonzalez.dev', href: 'mailto:hola@albertogonzalez.dev' },
    { id: 'github',   label: 'GitHub',   value: '@albertogonzalez',         href: 'https://github.com/albertogonzalez' },
    { id: 'linkedin', label: 'LinkedIn', value: 'in/albertogonzalez-dev',   href: 'https://linkedin.com/in/...' },
  ]}
></ag-organism-contact-links>
```

## Notas

- **Eyebrow y grid en la page**: esta columna NO lleva eyebrow interno ("04 · Contacto"). La page renderiza el eyebrow por encima y arma el grid de 2 columnas (este organismo + `ag-organism-contact-form`).
- **Título de 2 líneas**: mismo patrón que el hero (dos `<div>` adentro del slot del heading). La línea 2 va envuelta en `ag-atom-gradient-text` para el efecto cyan→purple.
- **`id` de section**: el `id="contacto"` lo setea la page en el `<section>` wrapper que contiene el eyebrow y el grid, NO en este organismo. Permite que el nav scrollee al principio de la sección (eyebrow) y no al título.
