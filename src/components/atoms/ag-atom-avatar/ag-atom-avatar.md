# ag-atom-avatar

> Avatar circular 36×36 con fondo gradient cian→purple, inicial centrada, y un ring offset doble en box-shadow.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| initial | String | 'A' | Letra (o caracter) centrado en el avatar |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Átomo sin slots (el contenido viene por `initial`) |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Átomo sin eventos |

## Uso

```html
<ag-atom-avatar initial="A"></ag-atom-avatar>
```

## Notas

- Tamaño fijo 36×36. Si a futuro aparece otro tamaño, se agrega una prop `size` o se expone una custom property `--ag-avatar-size`. Por ahora YAGNI.
- El box-shadow doble (`0 0 0 2px #0b0f17, 0 0 0 3px rgba(0,229,200,0.3)`) crea un anillo con fondo base y halo cian — replica la maqueta exactamente.
- Color del texto es `#07090f` hardcoded en lugar de `var(--bg)` porque semánticamente el avatar usa SIEMPRE el fondo base como contrast color, no el fondo activo del tema.
