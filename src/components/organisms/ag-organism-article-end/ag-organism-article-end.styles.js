import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    margin-top: 5rem;
    padding-top: 3rem;
    border-top: 1px solid var(--line);
    max-width: 45rem;
  }

  ag-molecule-rating {
    margin-bottom: 3.5rem;
  }

  ag-atom-eyebrow {
    margin-bottom: var(--space-5);
  }

  .related-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.875rem;
    margin-bottom: 3.5rem;
  }

  @media (max-width: 42.5rem) {
    .related-grid {
      grid-template-columns: 1fr;
    }
  }
`;
