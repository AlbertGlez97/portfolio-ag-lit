import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--mono);
    font-size: var(--text-sm);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cyan);
  }

  :host::before {
    content: "";
    width: var(--space-6);
    height: 1px;
    background: var(--cyan);
    flex-shrink: 0;
  }
`;
