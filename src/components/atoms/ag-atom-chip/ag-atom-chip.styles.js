import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    border-radius: var(--r-full);
    border: 1px solid var(--line-2);
    background: transparent;
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
    cursor: pointer;
    user-select: none;
    transition:
      color 0.2s,
      border-color 0.2s,
      background 0.2s,
      transform 0.15s,
      box-shadow 0.2s;
  }

  :host(:focus-visible) {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  /* ---------- filter ---------- */

  :host([variant="filter"]) {
    gap: 0.4375rem;
    padding: var(--space-2) 0.875rem;
  }

  :host([variant="filter"]:hover) {
    color: var(--fg);
    border-color: rgba(255, 255, 255, 0.2);
  }

  :host([variant="filter"][active]) {
    background: var(--cyan);
    color: #07090f;
    border-color: var(--cyan);
    box-shadow: 0 6px 20px -6px rgba(0, 229, 200, 0.55);
  }

  .count {
    color: var(--fg-dimmer);
    font-size: var(--text-xs);
  }

  :host([variant="filter"][active]) .count {
    color: rgba(7, 9, 15, 0.55);
  }

  /* ---------- command ---------- */

  :host([variant="command"]) {
    gap: var(--space-1);
    padding: 0.375rem 0.625rem;
    background: rgba(255, 255, 255, 0.02);
  }

  :host([variant="command"]:hover) {
    color: var(--cyan);
    border-color: var(--cyan);
    background: rgba(0, 229, 200, 0.06);
  }

  .prompt {
    color: var(--fg-dimmer);
  }
`;
