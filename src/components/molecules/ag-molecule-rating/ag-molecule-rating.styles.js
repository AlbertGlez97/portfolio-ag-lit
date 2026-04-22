import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 1.125rem;
    flex-wrap: wrap;
    font-family: var(--display);
  }

  .question {
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--fg);
  }

  .btns {
    display: flex;
    gap: 0.625rem;
  }

  .count {
    color: var(--fg-dimmer);
    margin-left: var(--space-1);
  }

  .thanks {
    font-family: var(--mono);
    font-size: 0.78125rem;
    color: var(--cyan);
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  .check {
    color: var(--cyan);
  }
`;
