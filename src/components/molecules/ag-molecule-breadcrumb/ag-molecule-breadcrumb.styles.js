import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: var(--mono);
    font-size: 0.71875rem;
    color: var(--fg-dimmer);
    letter-spacing: 0.06em;
  }

  a {
    color: var(--fg-dim);
    text-decoration: none;
    transition: color 0.2s;
  }

  a:hover {
    color: var(--cyan);
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
    border-radius: 0.125rem;
  }

  .sep {
    color: var(--fg-dimmer);
    margin: 0 0.625rem;
  }

  .current {
    color: var(--blue);
  }
`;
