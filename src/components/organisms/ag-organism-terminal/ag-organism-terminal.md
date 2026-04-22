# ag-organism-terminal

> REPL interactivo estilo Arch Linux con 14 comandos, history ↑/↓, boot automático (neofetch + whoami), chips disparadores y atajo ⌘K. El organismo estrella del landing.

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| userInfo | Object | {} | `{ name, location, role, bio_short }` — alimenta `whoami` |
| skills | Array | [] | `[{ id, level, items }]` — alimenta `skills` |
| projects | Array | [] | `[{ title, description, type }]` — alimenta `projects` |
| socialLinks | Array | [] | `[{ id, label, value, url }]` — alimenta `contact` |
| stackItems | Array | [] | `[{ label, value }]` — alimenta `stack` |
| nowItems | Array | [] | Líneas del comando `now` |
| readmeContent | String | '' | Texto multilinea para `cat readme.md` |
| neofetchData | Object | {} | `{ os, kernel, wm, shell, terminal, editor, cpu, memory }` |
| eyebrowText | String | '' | Eyebrow izquierdo (ej: "03 · Terminal") |
| titleText | String | '' | Título izquierdo |
| kickerText | String | '' | Párrafo izquierdo |
| commandChips | Array | [] | `[{ cmd, label }]` — chips de atajos |
| promptUser | String | 'alberto' | Usuario del prompt |
| promptHost | String | 'archlinux' | Host del prompt |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Organismo sin slots — todo llega por props |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| — | — | Organismo sin eventos propios; escucha `ag-chip-command` de sus chips internos |

## Uso

```html
<ag-organism-terminal
  .userInfo=${info}
  .skills=${skills}
  .projects=${projects}
  .socialLinks=${socialLinks}
  .stackItems=${stackItems}
  .nowItems=${nowItems}
  readmeContent=${readmeContent}
  .neofetchData=${neofetchData}
  eyebrowText="03 · Terminal"
  titleText="¿Quieres saber más de mí?"
  kickerText="Escribe un comando. Soy más cómodo en terminal que en biografía."
  .commandChips=${[
    { cmd: 'whoami',  label: 'whoami' },
    { cmd: 'skills',  label: 'skills' },
    { cmd: 'stack',   label: 'stack' },
    { cmd: 'now',     label: 'now' },
    { cmd: 'contact', label: 'contact' },
    { cmd: 'help',    label: 'help' },
  ]}
></ag-organism-terminal>
```

## Comandos

| Comando | Qué hace |
|---------|----------|
| `help` | Lista de comandos |
| `whoami` | Nombre · ubicación · rol · bio corta |
| `skills` | Skills con barra ASCII + tecnologías |
| `stack` | Toolbox actual |
| `now` | En qué estoy trabajando |
| `projects` | Top 5 proyectos |
| `contact` | Social links |
| `neofetch` | Panel ASCII art + info del sistema |
| `ls` | Listado falso del "home" |
| `cat readme.md` | Imprime `readmeContent` línea por línea |
| `date` | `new Date().toString()` |
| `echo <args>` | Repite los args (escapados) |
| `clear` | Vacía el body completo |
| `sudo hire` | Joke + scroll a `#contacto` después de 1.2s |

## Notas

- **Comandos vienen de un service externo**: `src/services/terminal-commands.js` — `buildCommands(opts)` es una factory que recibe la data y devuelve el dict. Las clausuras capturan los datos; el organismo la invoca en cada cambio de prop.
- **Return shape**: `{ lines?, clear?, then? }`. `clear: true` vacía el body. `then: Fn` corre tras render (usado por `sudo hire` para scroll).
- **`unsafeHTML` para `out`**: los spans de color (`.k .v .warn .acc .lbl`) los escribimos nosotros en `terminal-commands.js` y llegan como HTML confiable. El único input de usuario que termina en HTML es `echo <args>` — pasa por `escapeHtml` antes.
- **Boot deferido al primer `updated()`**: `_commands` se construye en `updated()` cuando llegan las props. Una vez construido, dispara `_runBoot()` UNA sola vez (guardado por `_bootStarted`). Si el organismo se desmonta a medio boot, `_bootActive` se vuelve false y el loop retorna limpio.
- **Auto-scroll del body**: `updated()` detecta cambios en `_lines` y ajusta `.term-body.scrollTop = scrollHeight`. Sin RAF, sin observers.
- **History ↑/↓**: `_history` crece linealmente. `_historyIdx === _history.length` significa "comando nuevo" (input vacío). Al salir del historial con ↓ después del último, vuelve a input vacío.
- **Chips saltan el input**: el handler `_onChipCommand` llama `_runCommand(cmd)` directo. La línea del comando se pinta en el body y el handler ejecuta. El input queda disponible para refocus.
- **⌘K / Ctrl+K**: listener global de `keydown`. Scroll suave al organismo + focus con 700ms de delay (respeta la animación). Se remueve en `disconnectedCallback`.
- **ASCII art hardcoded**: el logo Arch vive como constante `NEOFETCH_ASCII` en el organismo. No se serializa en content.json — es markup estático de la identidad visual.
- **Colores terminales hardcoded**: `#0b0d12`, `#10131a`, `#1a1e27`, `#6b7184`, `#7aa2f7`, etc. — son tonos "terminal" específicos que no mapean al palette global. Si en el futuro hacen falta en otro organism, se crean tokens `--term-*`.
- **`caret-color: transparent` en el input**: ocultamos el caret nativo porque `ag-atom-caret` dibuja el suyo visible al costado del input.
- **Commands rebuild on prop change**: cualquier cambio en las props de datos (userInfo, skills, etc.) re-construye el dict. Permite hot-swap del contenido sin desmontar el organismo.
