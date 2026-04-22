import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    background: rgba(13, 17, 23, 0.5);
    border: 1px solid var(--line-2);
    border-radius: var(--r-xl);
    padding: var(--space-8);
    backdrop-filter: blur(0.5rem);
    -webkit-backdrop-filter: blur(0.5rem);
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dim);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: var(--space-6);
    padding-bottom: 0.875rem;
    border-bottom: 1px dashed var(--line);
  }

  .head-status {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--cyan);
  }

  .head-status::before {
    content: "";
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 0.5rem var(--cyan);
  }

  .error-banner {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--orange);
    background: rgba(255, 138, 61, 0.06);
    border: 1px solid rgba(255, 138, 61, 0.25);
    border-radius: var(--r-md);
    padding: var(--space-3);
    margin-top: var(--space-4);
  }

  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--space-6);
  }

  .foot .count {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
    letter-spacing: 0.12em;
  }

  /* ---------- Success state ---------- */
  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-5) 0;
    text-align: center;
    gap: var(--space-2);
  }

  .success .check {
    font-size: 2.625rem;
    color: var(--cyan);
    line-height: 1;
  }

  .success ag-atom-heading {
    margin: 0.875rem 0 var(--space-2);
  }
`;
