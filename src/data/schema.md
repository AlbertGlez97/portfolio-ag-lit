# content.json — Schema

Fuente única de verdad del contenido del portafolio. Multilenguaje (`es`, `en`), con shape
pensado para migrar a una API REST sin tocar el cliente — solo cambia la URL en
`content.service.js`.

## Reglas generales

- **Keys en inglés** (`published_at`, `read_minutes`) — reflejan un endpoint REST.
- **Traducciones anidadas** bajo `translations.<locale>` dentro de cada entidad.
- **IDs únicos** por entidad. Slugs URL-safe en artículos.
- **Fechas en ISO-8601** (`YYYY-MM-DD`).
- **Ordenables** — los arrays relevantes incluyen `order` o `published_at`.

## Entidades

### `meta`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `available_locales` | `string[]` | Idiomas soportados. Orden importa (el primero es fallback). |
| `default_locale` | `string` | Idioma inicial al arrancar la app. |

### `personal_info.<locale>`

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `name` | `string` | "Alberto González" |
| `role` | `string` | "Full Stack Developer × IA" |
| `location` | `string` | "Madrid, ES" |
| `coordinates` | `string` | "40.4168° N · 3.7038° W" |
| `availability` | `string` | "Disponible para proyectos · Q3 2025" |
| `bio_short` | `string` | 1–3 frases sobre quién sos. |
| `hero_phrases` | `string[]` | Frases que rotan en el typing loop del hero. |

### `stats[]`

Contadores de la barra de stats del landing.

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `id` | `string` | `"years"` |
| `value` | `string` | `"5"` (string para admitir "∞", "01") |
| `unit` | `string` | `"+"`, `"/h"`, o `""` |
| `translations.<locale>.label` | `string` | "Años de exp." / "Years exp." |

### `projects[]`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único. |
| `order` | `number` | Posición en el grid. |
| `icon` | `string` | Glifo — ej: `"◐"`, `"◇"`, `"⎔"`. |
| `year` | `number` | Año del proyecto. |
| `type` | `string` | `"producto"`, `"open source"`, `"infra"`. |
| `cta_label` | `string` | `"live"`, `"code"`, `"case"`. |
| `cta_url` | `string` | URL del CTA. |
| `tags` | `string[]` | Stack tecnológico (no traducir — nombres propios). |
| `translations.<locale>.title` | `string` | Título localizado. |
| `translations.<locale>.description` | `string` | 1–2 frases. |

### `articles[]`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | Identificador único. |
| `slug` | `string` | URL-safe. La ruta será `/laboratorio/<slug>`. |
| `category` | `"threejs" \| "ia" \| "tutor" \| "backend"` | Define el color del tag. |
| `published_at` | `string` | ISO-8601. |
| `updated_at` | `string` | ISO-8601 o `""` si nunca se actualizó. |
| `read_minutes` | `number` | Tiempo estimado de lectura. |
| `featured` | `boolean` | Si `true` aparece como destacado en `/laboratorio`. |
| `related_ids` | `string[]` | IDs de artículos relacionados. |
| `translations.<locale>.title` | `string` | Título localizado. |
| `translations.<locale>.excerpt` | `string` | Resumen de 1–2 frases. |
| `translations.<locale>.toc` | `{ id, label }[]` | Tabla de contenidos precomputada. |
| `translations.<locale>.body` | `Block[]` | Ver tipos de bloque abajo. |

#### Tipos de bloque (`body[]`)

```jsonc
// Párrafo normal
{ "type": "p", "text": "...", "html": false }

// Lede — primer párrafo con drop-cap en serif
{ "type": "lede", "text": "..." }

// Heading de sección (genera anchor por `id`)
{ "type": "h2", "id": "intro", "n": "01", "text": "Introducción" }

// Bloque de código con gutter y botón copiar
{
  "type": "code",
  "lang": "glsl",
  "file": "vertex.glsl",
  "lines": ["uniform float uTime;", "void main() { ... }"]
}

// Figura con SVG inline
{
  "type": "figure",
  "num": "01",
  "svg": "<svg>...</svg>",
  "caption": "Descripción de la figura."
}

// Callout destacado
{
  "type": "callout",
  "kind": "note",
  "title": "Nota importante",
  "text": "..."
}
```

### `skills[]`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | `"frontend"`, `"backend"`, `"ia"`, `"infra"`, `"design"`. |
| `level` | `number` | 0–10 para la barra visual del terminal. |
| `items` | `string[]` | Tecnologías — ej: `["React", "Next", "Three.js"]`. |
| `translations.<locale>.label` | `string` | "Frontend" / "Frontend". |

### `social_links[]`

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `id` | `string` | `"github"`, `"linkedin"`, `"email"`. |
| `label` | `string` | "GitHub". |
| `value` | `string` | "@albertogonzalez". |
| `url` | `string` | URL completa. |

### `contact`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `email` | `string` | Email principal. |
| `response_time_hours` | `number` | Texto tipo "respondo en menos de 24h". |
| `translations.<locale>.intro` | `string` | Párrafo sobre el formulario. |
| `translations.<locale>.form_placeholders` | `{ name, email, message }` | Placeholders del form. |

### `terminal`

Datos que alimentan el organismo `ag-organism-terminal` del landing. NO se localiza — todos los valores son técnicos (identifiers de sistema, nombres de herramientas, comandos). Si se quisiera localizar "cafés por hora" u otros textos del `now`, se lleva a `translations.<locale>` en esa sub-entidad.

| Campo | Tipo | Ejemplo |
|-------|------|---------|
| `neofetch.os` | `string` | `"Arch Linux x86_64"` |
| `neofetch.kernel` | `string` | `"6.8.9-arch1-1"` |
| `neofetch.wm` | `string` | `"Hyprland"` |
| `neofetch.shell` | `string` | `"zsh 5.9"` |
| `neofetch.terminal` | `string` | `"kitty"` |
| `neofetch.editor` | `string` | `"Neovim"` |
| `neofetch.cpu` | `string` | `"AMD Ryzen 7 7840U"` |
| `neofetch.memory` | `string` | `"14.2 GiB / 32 GiB"` |
| `stack_items[]` | `{ label, value }[]` | `{ "label": "editor", "value": "Neovim + Zed" }` |
| `now_items[]` | `string[]` | Líneas sueltas del comando `now` |
| `readme_content` | `string` | Texto multilinea para `cat readme.md` (usar `\n` para saltos) |

El ASCII art del logo Arch vive hardcoded en `ag-organism-terminal` — no es contenido editable.
