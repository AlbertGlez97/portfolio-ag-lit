# ag-molecule-mermaid

> Renderiza un diagrama mermaid como SVG inline. Lazy-load de la librería (~600 KB solo si hay diagramas). Tema `dark` configurado para la paleta del portfolio. Embebible en artículos vía bloque `mermaid`.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| code | String | `''` | Sintaxis mermaid (flowchart, sequenceDiagram, etc.). Soporta `\n` para saltos de línea |
| caption | String | `''` | Texto descriptivo debajo del diagrama |
| num | String | `''` | Número de figura. Se renderiza como `Fig. {num}` antes del caption |

## Estados internos

| State | Tipo | Descripción |
|-------|------|-------------|
| `_svg` | String | SVG renderizado (trusted, inyectado con `unsafeHTML`) |
| `_loading` | Boolean | Mientras baja `mermaid` o renderiza |
| `_error` | String \| null | Mensaje si la sintaxis es inválida o el import falla |

## Slots

| Slot | Descripción |
|------|-------------|
| — | La molécula no usa slots. El código del diagrama va por prop `code` |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | No emite eventos |

## Uso

```html
<ag-molecule-mermaid
  num="3"
  caption="Decisión IF/ELSE: el rombo siempre tiene dos salidas"
  code="flowchart TD
    A([INICIO])
    B[/Leer edad/]
    C{edad >= 18?}
    D[/Mostrar Mayor/]
    E[/Mostrar Menor/]
    F([FIN])
    A --> B --> C
    C -->|SI| D --> F
    C -->|NO| E --> F"
></ag-molecule-mermaid>
```

```json
// Dentro de article.body en content.json
{
  "type": "mermaid",
  "num": "3",
  "caption": "...",
  "code": "flowchart TD\n  A --> B"
}
```

## Notas

- **Lazy load**: la librería pesa ~600 KB. `loadMermaid()` usa `import()` dinámico y cachea el módulo en variables module-scope. El primer diagrama de la página paga el costo; los siguientes renderizan sin latencia.
- **`mermaid.initialize()` es singleton**: guardamos el flag `_mermaidInitialized` fuera de la clase. Si dos instancias de la molécula aparecen en la página, solo la primera inicializa.
- **Tema**: `dark` con `themeVariables` custom para matchear `--bg-2`, `--fg`, `--cyan`, `--purple`, etc. Si cambian los tokens, actualizar acá.
- **Tipografía del SVG**: `JetBrains Mono` (misma que code-block). Definida en `themeVariables.fontFamily`.
- **IDs únicos**: `mermaid.render(id, code)` requiere un id único por render. Combinamos un contador monótono + random suffix para evitar colisiones si dos componentes renderizan en el mismo tick.
- **`securityLevel: 'loose'`**: necesario para que mermaid acepte algunos caracteres especiales en labels. El `code` viene de content.json (trusted), así que el riesgo es cero.
- **Error handling**: si el parser falla, se muestra el mensaje en naranja. No tumba el artículo — el resto del body sigue renderizando.
- **Responsive**: `svg { max-width: 100%; height: auto }` sobreescribe los atributos fijos que mete mermaid. `overflow-x: auto` en `.diagram` evita que los diagramas muy anchos rompan el layout.
- **Shadow DOM**: el SVG vive en el shadow root. Mermaid mete estilos `<style>` inline dentro del `<svg>`, así que no se filtran al documento.
