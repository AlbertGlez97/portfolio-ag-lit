import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  .wrap {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
  }

  /* ---------- Header ---------- */
  .header {
    padding: 8.75rem 0 var(--space-10);
    position: relative;
    overflow: hidden;
  }

  .header::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, var(--line) 1px, transparent 1px),
      linear-gradient(to bottom, var(--line) 1px, transparent 1px);
    background-size: 4.5rem 4.5rem;
    mask-image: radial-gradient(ellipse 60% 60% at 15% 40%, #000 10%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse 60% 60% at 15% 40%, #000 10%, transparent 75%);
    opacity: 0.7;
    z-index: 0;
    pointer-events: none;
  }

  .header-inner {
    position: relative;
    z-index: 1;
  }

  .header ag-molecule-breadcrumb {
    margin-bottom: var(--space-8);
  }

  .header ag-atom-tag {
    margin-bottom: var(--space-6);
  }

  .header ag-atom-heading {
    margin-bottom: 2.25rem;
    max-width: 38rem;
  }

  .header ag-molecule-byline {
    margin-top: 1.375rem;
  }

  .header .divider {
    height: 1px;
    background: var(--line);
    margin-top: 3rem;
  }

  /* ---------- Layout: TOC + content ---------- */
  .layout {
    display: grid;
    grid-template-columns: 15rem 1fr;
    gap: 5rem;
    padding: 4rem 0 6.25rem;
  }

  /* ---------- TOC ---------- */
  .toc {
    position: sticky;
    top: 6.25rem;
    align-self: start;
    max-height: calc(100vh - 8.75rem);
    overflow-y: auto;
  }

  .toc::-webkit-scrollbar {
    width: 0.25rem;
  }
  .toc::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.06);
    border-radius: var(--r-xs);
  }

  .toc-title {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 1.125rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .toc-title::before {
    content: "";
    width: var(--space-4);
    height: 1px;
    background: var(--cyan);
    flex-shrink: 0;
  }

  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .toc-list li {
    position: relative;
  }

  .toc-list a {
    display: block;
    padding: var(--space-2) 0.875rem var(--space-2) var(--space-4);
    font-family: var(--mono);
    font-size: 0.78125rem;
    line-height: 1.45;
    color: var(--fg-dimmer);
    border-left: 1px solid var(--line);
    text-decoration: none;
    transition:
      color 0.2s,
      border-color 0.2s,
      padding-left 0.2s;
  }

  .toc-list a:hover {
    color: var(--fg-dim);
    border-left-color: var(--line-2);
  }

  .toc-list a.active {
    color: var(--cyan);
    border-left-color: var(--cyan);
    padding-left: 1.25rem;
  }

  /* ---------- Content ---------- */
  .content {
    max-width: 45rem;
  }

  .content > section {
    scroll-margin-top: 6.25rem;
  }

  /* Drop cap para el lede del artículo */
  .content .drop-cap {
    font-family: var(--serif);
    font-size: 3.75rem;
    font-weight: 500;
    color: var(--cyan);
    display: inline-block;
    line-height: 0.8;
    vertical-align: bottom;
    margin-right: 0.05em;
  }

  /* Spacing entre bloques (body atoms no tienen margin propio) */
  .content ag-atom-text[variant="body"],
  .content ag-atom-text[variant="lede"] {
    display: block;
    margin: 0 0 1.375rem;
  }

  .content ag-molecule-code-block,
  .content ag-molecule-figure,
  .content ag-molecule-callout,
  .content ag-atom-quote {
    display: block;
    margin: var(--space-8) 0;
  }

  /* Mobile: TOC se vuelve bloque normal arriba del content */
  @media (max-width: 60rem) {
    .layout {
      grid-template-columns: 1fr;
      gap: var(--space-10);
    }
    .toc {
      position: relative;
      top: auto;
      max-height: none;
      border: 1px solid var(--line-2);
      border-radius: var(--r-lg);
      padding: 1.25rem 1.125rem;
      background: rgba(13, 17, 23, 0.5);
    }
  }

  /* ---------- Terminal Quest ---------- */
  .content ag-organism-terminal-quest {
    display: block;
    margin: var(--space-10) 0;
  }

  /* ---------- Tabla de comandos ---------- */
  .content .cmd-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin: 0;
  }

  .content .cmd-table th {
    text-align: left;
    padding: 0.625rem 1rem;
    color: var(--cyan);
    border-bottom: 1px solid var(--line-2);
    font-size: var(--text-xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .content .cmd-table td {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--line);
    color: var(--fg-2);
    vertical-align: middle;
    line-height: 1.5;
  }

  .content .cmd-table td:first-child {
    color: var(--fg);
    white-space: nowrap;
  }

  .content .cmd-table td code {
    background: rgba(0, 229, 200, 0.08);
    color: var(--cyan);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  .content .cmd-table tbody tr:hover td {
    background: rgba(255, 255, 255, 0.025);
  }

  .content .cmd-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Wrapper con borde estilo terminal */
  .content ag-atom-text[variant="body"]:has(.cmd-table) {
    border: 1px solid var(--line-2);
    border-radius: var(--r-lg);
    overflow: hidden;
    display: block;
    margin: var(--space-8) 0;
  }

  @media (max-width: 45rem) {
    .wrap {
      padding: 0 var(--wrap-pad-sm);
    }
    .header {
      padding: 7rem 0 var(--space-8);
    }

    .content .cmd-table th,
    .content .cmd-table td {
      padding: 0.5rem 0.625rem;
    }

    .content .cmd-table th:last-child,
    .content .cmd-table td:last-child {
      display: none;
    }
  }
`;
