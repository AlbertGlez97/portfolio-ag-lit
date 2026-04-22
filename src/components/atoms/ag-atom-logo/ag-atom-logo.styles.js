import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
  }

  a {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    color: var(--fg);
    font-family: var(--mono);
    font-weight: 600;
    letter-spacing: -0.01em;
    font-size: var(--text-semi);
    text-decoration: none;
  }

  .mark {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.125rem;
    background: var(--grad);
    display: inline-block;
    margin-right: 0.625rem;
    transform: translateY(1px);
    box-shadow: 0 0 16px rgba(0, 229, 200, 0.55);
  }

  .dot {
    color: var(--cyan);
  }

  .ext {
    color: var(--fg-dim);
    font-weight: 500;
  }
`;
