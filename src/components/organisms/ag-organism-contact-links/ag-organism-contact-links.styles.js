import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  ag-atom-text {
    margin-top: var(--space-5);
    max-width: 27.5rem;
  }

  .links {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-10);
    border-top: 1px solid var(--line);
  }
`;
