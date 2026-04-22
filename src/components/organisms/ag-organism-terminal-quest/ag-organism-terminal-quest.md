# ag-organism-terminal-quest

> Terminal interactiva embebida en artículos del laboratorio. Quest con FS simulado, state machine de stages y tres desenlaces para `rm`: limpiar la trampa (correcto), `rm -rf` (game over dramático con reset), o borrar `mapaTesoro.txt` (depende de si hay backup).

## Propiedades

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| stage | String | `'intro'` | Stage actual. Reflecting. Valores: `intro`, `found_secret`, `in_tools`, `read_map`, `backed_up`, `trap_cleared`, `key_made`, `treasure_found` |

## Estado interno

| State | Tipo | Descripción |
|-------|------|-------------|
| `_cwd` | String | Directorio actual. Arranca en `/home/agente` |
| `_fs` | Object | Filesystem simulado — ver `quest-filesystem.js` |
| `_lines` | Array | Histórico de líneas (cmd / out / spc) |
| `_input` | String | Input actual del mirror |
| `_backedUp` | Boolean | Usuario hizo `cp mapaTesoro.txt mapaTesoro.bak` |
| `_mapDeleted` | Boolean | Usuario borró `mapaTesoro.txt` (pero puede recuperar si había backup) |
| `_keyMoved` | Boolean | Usuario movió `llave_maestra.key` con `mv` |
| `_gameOver` | Boolean | Durante la secuencia dramática de reset |
| `_createdDirs` | Array | Paths de dirs creados con `mkdir` |
| `_createdFiles` | Array | Paths de archivos creados con `touch` |

## Slots

| Slot | Descripción |
|------|-------------|
| — | Sin slots — el contenido es 100% interactivo |

## Eventos

| Evento | Detalle | Cuándo se dispara |
|--------|---------|-------------------|
| `stage-change` | `{ stage: string }` | En cada transición de `stage` |

## Comandos soportados

| Comando | Descripción |
|---------|-------------|
| `help` | Ayuda contextual — muestra una pista según el stage |
| `pwd` | Imprime `_cwd` |
| `ls` / `ls -la` | Lista el directorio actual. `-la` incluye ocultos |
| `cat <file>` | Muestra un archivo del `_cwd` |
| `cd <dir>` | Cambia de directorio. Soporta `..`, `~`, rutas absolutas y relativas |
| `cp <src> <dst>` | Copia. Caso especial: `cp mapaTesoro.txt *.bak` setea `_backedUp` |
| `mv <src> <dst>` | Mueve/renombra. Caso especial: `llave_maestra.key` setea `_keyMoved` |
| `mkdir <name>` | Crea directorio |
| `touch <name>` | Crea archivo vacío. Soporta paths (`dir/file`) |
| `rm [flags] <target>` | El comando estrella — ver abajo |
| `grep "patrón" <file>` | Busca + highlight del match |
| `ip a` | Simula `ip a` (loopback + wlan0 inventado) |
| `man <cmd>` | Manual simulado |
| `echo <text>` | Echo |
| `clear` | Limpia `_lines` |

## Los 3 casos de `rm`

| Caso | Comando | Resultado |
|------|---------|-----------|
| 1 | `rm trampa_virus.sh` | Limpia la trampa — avanza a `trap_cleared` |
| 2 | `rm -rf .` · `rm -rf *` · `rm -f *` · `rm -f .` | **GAME OVER**: fs del `_cwd` se vacía, secuencia dramática, countdown 5→1, reset total del componente |
| 3a | `rm mapaTesoro.txt` con `_backedUp === true` | El usuario puede recuperar con `cp mapaTesoro.bak mapaTesoro.txt` |
| 3b | `rm mapaTesoro.txt` con `_backedUp === false` | Tras dos líneas dramáticas, cae al flujo de game over |

## FS inicial

```
/home/agente/
├── .mensaje_secreto      ← pista al stage 2 (cd herramientas)
├── misiones.txt          ← checklist
├── herramientas/
│   ├── mapaTesoro.txt    ← instrucciones completas del quest
│   └── trampa_virus.sh   ← el archivo que debe eliminar
└── archivos_secretos/
    └── boveda/
        └── TESORO.md     ← el final del quest
```

## Uso

```html
<!-- Embebido como block 'terminal-quest' dentro de un artículo -->
<ag-organism-terminal-quest></ag-organism-terminal-quest>
```

```js
// Reaccionar desde la page al progreso del quest
const term = document.querySelector('ag-organism-terminal-quest');
term.addEventListener('stage-change', (e) => {
  if (e.detail.stage === 'treasure_found') {
    // celebrar, emitir evento al content.service, etc.
  }
});
```

## Notas

- **Patrón mirror idéntico al terminal principal**: input nativo invisible para capturar teclado + span visible + `ag-atom-caret variant="terminal"` que sigue al texto.
- **Tokens de color reusados**: `--term-bg`, `--term-bg-bar`, `--term-border`, `--term-border-bar`, `--term-dim`, `--term-dimmer`, `--term-blue`. Se tokenizaron al aparecer acá porque ya son el segundo uso (el primero es el terminal del landing). Cualquier terminal futura tiene que consumirlos.
- **Game over**: clase `.game-over` sobre el host (vía `this.classList.toggle`) — el CSS pinta borde y fondo en `--orange`. El `<input>` queda `disabled` para evitar entradas durante la secuencia.
- **Reset = reboot**: `_reset()` reconstruye el `_fs` desde `buildInitialFs()` y vuelve a correr `_runBoot()`. Es total — no conserva historial ni progreso.
- **Stage transitions son idempotentes y chequean el stage previo** antes de avanzar: evitamos retrocesos accidentales si el usuario re-cat archivos.
- **`_createdDirs` / `_createdFiles`** exponen qué hizo el jugador. No los usa el quest hoy, pero sirven si se quiere validar "el usuario llegó acá creando X" desde afuera.
- **Seguridad**: todos los argumentos del usuario pasan por `escapeHtml` antes de ir a `unsafeHTML`. Los spans con clases (`<span class="k">`, etc.) los inyectan los handlers a mano — nunca viene del input.
- **Escalabilidad**: si crece el set de comandos, separar en `quest-commands.js` (factory function que recibe el elemento y devuelve el dict de handlers). Por ahora cabe como métodos del organismo sin que se sienta pesado.
