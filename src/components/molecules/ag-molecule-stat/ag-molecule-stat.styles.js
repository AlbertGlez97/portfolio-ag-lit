import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding: 0 var(--space-8);
    border-left: 1px solid var(--line);
  }

  :host(:first-child) {
    border-left: 0;
    padding-left: 0;
  }

  .num {
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(2rem, 4vw, 3rem);
    letter-spacing: -0.03em;
    color: var(--fg);
    line-height: 1;
  }

  .unit {
    color: var(--cyan);
  }

  .lbl {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  @media (max-width: 820px) {
    :host {
      border-left: 0;
      padding: 0 var(--space-4);
    }
    :host(:nth-child(odd)) {
      padding-left: 0;
    }
  }
`;
