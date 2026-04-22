import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    min-height: 2.875rem;
    max-width: 45rem;
    padding: 0.875rem 1.125rem;
    background: rgba(13, 17, 23, 0.6);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    font-family: var(--mono);
    font-size: var(--text-2sm);
    color: var(--fg-dim);
  }

  .prompt {
    color: var(--cyan);
  }

  .dollar {
    color: var(--fg-dim);
  }

  .typed {
    color: var(--fg);
  }
`;
