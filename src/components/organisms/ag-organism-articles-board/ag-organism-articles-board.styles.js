import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    padding: 3.5rem 0;
    scroll-margin-top: var(--nav-h);
  }

  .wrap {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
    padding-bottom: var(--space-5);
    border-bottom: 1px solid var(--line);
  }

  .top-bar .filters {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .top-bar .right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .top-bar .sort {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
  }

  ag-molecule-featured-card {
    display: block;
    margin-bottom: 4.5rem;
  }

  .grid-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0 0 var(--space-6);
    gap: var(--space-4);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .empty {
    text-align: center;
    padding: 5rem 1.25rem;
    border: 1px dashed var(--line-2);
    border-radius: var(--r-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  @media (max-width: 47.5rem) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 45rem) {
    .wrap {
      padding: 0 var(--wrap-pad-sm);
    }
    .top-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .top-bar .right {
      flex-direction: column;
      align-items: stretch;
    }
    .top-bar ag-molecule-search-box {
      min-width: 0;
    }
  }
`;
