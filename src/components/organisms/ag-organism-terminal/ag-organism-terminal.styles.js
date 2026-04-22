import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  .wrap {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 4.5rem;
    align-items: center;
  }

  @media (max-width: 56.25rem) {
    .wrap {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  @media (max-width: 45rem) {
    .wrap {
      padding: 0 var(--wrap-pad-sm);
    }
  }

  /* ---------- Copy izquierdo ---------- */
  .copy ag-atom-heading {
    margin-top: var(--space-5);
  }

  .copy ag-atom-text {
    margin-top: var(--space-6);
    max-width: 26.25rem;
  }

  .copy .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: 1.75rem;
  }

  /* ---------- Terminal box ---------- */
  .term {
    background: var(--term-bg);
    border: 1px solid var(--term-border);
    border-radius: var(--r-xs);
    overflow: hidden;
    box-shadow: 0 20px 60px -30px rgba(0, 0, 0, 0.6);
    font-family: var(--mono);
    display: flex;
    flex-direction: column;
    min-height: 27.5rem;
    position: relative;
  }

  .term-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.375rem;
    padding: 0 0.625rem;
    background: var(--term-bg-bar);
    border-bottom: 1px solid var(--term-border-bar);
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--term-dim);
    letter-spacing: 0.02em;
    user-select: none;
  }

  .term-bar .sep {
    color: var(--term-dimmer);
    margin: 0 0.375rem;
  }

  .term-body {
    flex: 1;
    padding: 0.875rem var(--space-4) 0.625rem;
    font-size: var(--text-2sm);
    line-height: 1.55;
    color: var(--fg);
    overflow-y: auto;
    max-height: 28.75rem;
  }

  .term-body::-webkit-scrollbar {
    width: 0.375rem;
  }
  .term-body::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0;
  }

  .term-line {
    white-space: pre;
    word-break: normal;
  }
  .term-line.cmd {
    color: var(--fg);
    white-space: pre-wrap;
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
  }
  .term-line.cmd .dollar {
    color: var(--term-dim);
    margin: 0;
  }
  .term-line.out {
    color: var(--fg-dim);
    white-space: pre-wrap;
  }
  .term-line.out .k { color: var(--cyan); }
  .term-line.out .v { color: var(--fg); }
  .term-line.out .warn { color: var(--orange); }
  .term-line.out .acc { color: var(--purple); }
  .term-line.out .lbl { color: var(--cyan); }
  .term-line.spc {
    height: 0.5rem;
  }

  /* ---------- Neofetch panel ---------- */
  .neofetch {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1.25rem;
    font-family: var(--mono);
    font-size: 0.78125rem;
    line-height: 1.3;
    margin: 0.125rem 0 0.375rem;
  }

  .neofetch pre {
    margin: 0;
    color: var(--cyan);
    font-family: var(--mono);
    font-size: var(--text-xs);
    line-height: 1.15;
    white-space: pre;
    text-shadow: 0 0 0.75rem rgba(0, 229, 200, 0.25);
  }

  .neofetch .nf-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding-top: 0.125rem;
  }

  .neofetch .nf-id { color: var(--cyan); margin-bottom: 0.25rem; }
  .neofetch .nf-id .at { color: var(--fg); }
  .neofetch .nf-sep { color: var(--term-sep); letter-spacing: -0.0625rem; margin-bottom: 0.25rem; }
  .neofetch .nf-row { color: var(--fg); }
  .neofetch .nf-row .lbl {
    color: var(--cyan);
    display: inline-block;
    min-width: 4.5rem;
  }

  .neofetch .nf-swatches {
    display: flex;
    gap: 0;
    margin-top: 0.375rem;
  }
  .neofetch .nf-swatches span {
    width: 0.875rem;
    height: 0.75rem;
    display: block;
  }

  /* ---------- Input form (mirror pattern) ---------- */
  .term-input {
    display: flex;
    align-items: center;
    padding: 0.25rem var(--space-4) 0.875rem;
    background: transparent;
    font-family: var(--mono);
    font-size: var(--text-2sm);
    cursor: text;
    position: relative;
  }

  .term-input .lb,
  .term-input .rb {
    color: var(--term-dim);
  }
  .term-input .usr { color: var(--cyan); }
  .term-input .host { color: var(--fg); }
  .term-input .path {
    color: var(--term-blue);
    margin-left: 0.25rem;
  }
  .term-input .dollar {
    color: var(--term-dim);
    margin: 0;
  }

  /* Mirror visible — muestra el texto tipeado + caret pegado al final */
  .term-mirror {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    margin-left: 0.3rem;
    color: var(--fg);
  }

  .term-typed {
    white-space: pre;
    letter-spacing: inherit;
  }

  /* Input nativo invisible — captura teclado y focus; cubre toda la form */
  .term-native {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border: 0;
    outline: 0;
    color: transparent;
    caret-color: transparent;
    font: inherit;
    opacity: 0;
    cursor: text;
    box-sizing: border-box;
  }

  /* ---------- Input hint ---------- */
  .term-hint {
    display: block;
    padding: 0 var(--space-4) 0.625rem;
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
    transition: opacity 0.2s;
    user-select: none;
    pointer-events: none;
  }

  .term-input:focus-within ~ .term-hint {
    opacity: 0;
  }
`;
