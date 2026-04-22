import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
  }

  .coord {
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;
