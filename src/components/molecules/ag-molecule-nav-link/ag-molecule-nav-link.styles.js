import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
  }

  a {
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) 0.875rem;
    color: var(--fg-dim);
    border-radius: var(--r-sm);
    font-family: var(--mono);
    font-size: var(--text-2sm);
    text-decoration: none;
    transition:
      color 0.2s,
      background 0.2s;
  }

  a:hover {
    color: var(--fg);
    background: rgba(255, 255, 255, 0.04);
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  :host([active]) a {
    color: var(--cyan);
  }

  .idx {
    color: var(--fg-dimmer);
    margin-right: 0.375rem;
  }

  :host([active]) .idx {
    color: inherit;
  }

  @media (max-width: 720px) {
    :host(:not([keep])) {
      display: none;
    }
  }
`;
