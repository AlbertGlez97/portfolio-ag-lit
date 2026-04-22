import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.125rem;
    position: relative;
  }

  label {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dim);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: var(--space-2);
  }

  .req {
    color: var(--orange);
  }

  .err {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--orange);
    margin-top: 0.375rem;
  }
`;
