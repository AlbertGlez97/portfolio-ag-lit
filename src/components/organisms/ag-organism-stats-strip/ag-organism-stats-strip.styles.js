import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 2.25rem 0;
  }

  .grid {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 51.25rem) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.75rem 0;
    }
  }

  @media (max-width: 45rem) {
    .grid {
      padding: 0 var(--wrap-pad-sm);
    }
  }
`;
