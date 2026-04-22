import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    border-top: 1px solid var(--line);
    padding: var(--space-8) 0;
  }

  .row {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  @media (max-width: 45rem) {
    .row {
      padding: 0 var(--wrap-pad-sm);
    }
  }
`;
