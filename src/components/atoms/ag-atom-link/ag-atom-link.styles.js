import { css } from 'lit';

export const styles = css`
  :host {
    display: inline;
  }

  a {
    color: var(--cyan);
    border-bottom: 1px solid rgba(0, 229, 200, 0.35);
    transition:
      border-color 0.2s,
      background 0.2s;
    text-decoration: none;
  }

  a:hover {
    border-bottom-color: var(--cyan);
    background: rgba(0, 229, 200, 0.08);
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
    border-radius: 0.125rem;
  }
`;
