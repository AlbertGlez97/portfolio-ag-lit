import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    margin: var(--space-8) 0;
    max-width: 48rem;
  }

  /* Contenedor principal — hereda la paleta de --term-* (design-tokens.css) */
  .term {
    background: var(--term-bg);
    border: 1px solid var(--term-border);
    border-radius: var(--r-xs);
    overflow: hidden;
    box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.6);
    font-family: var(--mono);
    display: flex;
    flex-direction: column;
    min-height: 22rem;
    cursor: text;
    transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  }

  /* Estado game over: el host recibe .game-over desde el JS */
  :host(.game-over) .term {
    border-color: var(--orange);
    background-color: rgba(255, 138, 61, 0.08);
    box-shadow:
      0 20px 60px -30px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 138, 61, 0.35) inset;
  }

  /* ---------- Barra superior ---------- */
  .term-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.85rem;
    background: var(--term-bg-bar);
    border-bottom: 1px solid var(--term-border-bar);
    color: var(--term-dim);
    font-size: var(--text-2sm);
    flex-wrap: wrap;
  }
  .term-bar .sep {
    color: var(--term-dimmer);
  }
  .term-bar .glyph {
    color: var(--cyan);
  }

  /* ---------- Body ---------- */
  .term-body {
    flex: 1;
    padding: 0.9rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    color: var(--fg);
    font-size: var(--text-md);
    line-height: 1.55;
    overflow-y: auto;
    word-break: break-word;
  }

  .term-body::-webkit-scrollbar {
    width: 0.5rem;
  }
  .term-body::-webkit-scrollbar-thumb {
    background: var(--term-dimmer);
    border-radius: var(--r-full);
  }

  /* ---------- Líneas ---------- */
  .term-line {
    white-space: pre-wrap;
  }
  .term-line.cmd {
    color: var(--fg);
  }
  .term-line.cmd .lb,
  .term-line.cmd .rb {
    color: var(--term-dim);
  }
  .term-line.cmd .usr {
    color: var(--cyan);
  }
  .term-line.cmd .host {
    color: var(--fg);
  }
  .term-line.cmd .path {
    color: var(--term-blue);
    margin-left: 0.3rem;
  }
  .term-line.cmd .dollar {
    color: var(--cyan);
    margin-right: 0.35rem;
  }
  .term-line.spc {
    height: 0.2rem;
  }

  /* spans de output (inyectados por los handlers) */
  .term-line.out .k {
    color: var(--cyan);
  }
  .term-line.out .v {
    color: var(--fg);
  }
  .term-line.out .warn {
    color: var(--orange);
  }
  .term-line.out .danger {
    color: var(--orange);
    font-weight: 500;
  }
  .term-line.out .path {
    color: var(--term-blue);
  }
  .term-line.out .dim {
    color: var(--term-dim);
  }

  /* ---------- Input ---------- */
  .term-input {
    display: flex;
    align-items: center;
    padding: 0.55rem 1.1rem 0.35rem;
    border-top: 1px solid var(--term-border-bar);
    font-size: var(--text-md);
    color: var(--fg);
    position: relative;
    cursor: text;
    background: var(--term-bg);
  }
  .term-input .lb,
  .term-input .rb {
    color: var(--term-dim);
  }
  .term-input .usr {
    color: var(--cyan);
  }
  .term-input .host {
    color: var(--fg);
  }
  .term-input .path {
    color: var(--term-blue);
    margin-left: 0.3rem;
  }
  .term-input .dollar {
    color: var(--cyan);
    margin: 0;
  }

  /* Mirror: span visible + caret que sigue al texto */
  .term-mirror {
    display: inline-flex;
    align-items: center;
    flex: 1;
    margin-left: 0.3rem;
    min-width: 0;
  }
  .term-typed {
    white-space: pre;
    color: var(--fg);
  }

  /* Input nativo: invisible pero captura teclado */
  .term-native {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    color: transparent;
    caret-color: transparent;
    font: inherit;
    outline: none;
    cursor: text;
  }
  .term-native::selection {
    background: transparent;
  }

  /* Hint debajo del input — se desvanece al hacer focus */
  .term-hint {
    display: block;
    padding: 0.1rem 1.1rem 0.7rem;
    color: var(--term-dim);
    font-size: var(--text-2sm);
    font-family: var(--mono);
    background: var(--term-bg);
    opacity: 1;
    transition: opacity 0.2s ease;
    user-select: none;
  }
  .term-input:focus-within ~ .term-hint {
    opacity: 0.4;
  }
  :host(.game-over) .term-hint {
    color: var(--orange);
    opacity: 0.9;
  }
`;
