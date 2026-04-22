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

  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: var(--space-6);
    margin-bottom: 3.5rem;
  }

  .head-left ag-atom-heading {
    margin-top: var(--space-5);
  }

  .head-right {
    text-align: right;
  }

  .archive {
    display: inline-block;
    margin-top: var(--space-3);
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .archive:hover {
    opacity: 0.75;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 61.25rem) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 43.75rem) {
    .grid {
      grid-template-columns: 1fr;
    }
    .head {
      flex-direction: column;
      align-items: flex-start;
    }
    .head-right {
      text-align: left;
    }
  }

  @media (max-width: 45rem) {
    .wrap {
      padding: 0 var(--wrap-pad-sm);
    }
  }
`;
