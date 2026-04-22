import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
  }

  select {
    font-family: var(--mono);
    font-size: var(--text-sm);
    background: transparent;
    border: 1px solid var(--line-2);
    color: var(--fg);
    padding: 0.375rem 0.625rem;
    border-radius: var(--r-sm);
    cursor: pointer;
    outline: 0;
    transition: border-color 0.2s;
  }

  select:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }

  select:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  option {
    background: var(--bg-2);
    color: var(--fg);
  }

  :host([disabled]) select {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
