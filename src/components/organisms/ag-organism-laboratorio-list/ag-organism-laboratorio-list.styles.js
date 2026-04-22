import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 5rem 0;
    scroll-margin-top: var(--nav-h);
  }

  .wrap {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
  }

  .head ag-atom-heading {
    margin-top: var(--space-5);
  }

  .head ag-atom-text {
    margin-top: var(--space-6);
    max-width: 35rem;
  }

  .list {
    margin-top: var(--space-12);
    border-top: 1px solid var(--line);
  }

  .cta {
    margin-top: var(--space-10);
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .cta::before {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  @media (max-width: 45rem) {
    .wrap {
      padding: 0 var(--wrap-pad-sm);
    }
  }
`;
