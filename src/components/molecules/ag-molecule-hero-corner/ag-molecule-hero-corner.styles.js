import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
  }

  .page {
    color: var(--fg-dim);
    font-size: var(--text-sm);
    letter-spacing: 0.1em;
  }

  @media (max-width: 720px) {
    :host {
      display: none;
    }
  }
`;
