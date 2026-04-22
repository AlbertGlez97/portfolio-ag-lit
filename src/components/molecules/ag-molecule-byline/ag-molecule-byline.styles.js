import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    flex-wrap: wrap;
    font-family: var(--mono);
    font-size: var(--text-2sm);
    color: var(--fg-dim);
  }

  .author {
    color: var(--fg);
    font-weight: 500;
  }

  .bullet {
    color: var(--fg-dimmer);
    font-size: 0.5rem;
  }

  .updated {
    color: var(--cyan);
  }
`;
