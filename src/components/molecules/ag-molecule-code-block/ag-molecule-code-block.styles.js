import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    max-width: 45rem;
    margin: var(--space-8) 0;
    background: #0d1117;
    border: 1px solid var(--line-2);
    border-radius: var(--r-lg);
    overflow: hidden;
    font-family: var(--mono);
    font-size: 0.84375rem;
    line-height: 1.65;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 0.875rem 0.625rem var(--space-4);
    background: var(--bg-3);
    border-bottom: 1px solid var(--line);
    font-family: var(--mono);
    font-size: 0.71875rem;
    color: var(--fg-dim);
    letter-spacing: 0.04em;
  }

  .lang {
    color: var(--cyan);
  }

  .copy {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dim);
    background: transparent;
    border: 1px solid var(--line-2);
    padding: var(--space-1) 0.625rem;
    border-radius: var(--r-xs);
    cursor: pointer;
    transition:
      color 0.2s,
      border-color 0.2s;
  }

  .copy:hover {
    color: var(--cyan);
    border-color: rgba(0, 229, 200, 0.4);
  }

  .copy.copied {
    color: var(--cyan);
    border-color: rgba(0, 229, 200, 0.4);
  }

  .body {
    display: grid;
    grid-template-columns: auto 1fr;
    overflow-x: auto;
  }

  .gutter {
    padding: var(--space-4) 0.625rem var(--space-4) var(--space-4);
    color: var(--fg-dimmer);
    font-size: 0.78125rem;
    text-align: right;
    user-select: none;
    border-right: 1px solid var(--line);
    background: rgba(0, 0, 0, 0.2);
  }

  .gutter div {
    line-height: 1.65;
  }

  pre {
    margin: 0;
    padding: var(--space-4) 1.125rem;
    white-space: pre;
    color: var(--fg);
    overflow-x: auto;
  }
`;
