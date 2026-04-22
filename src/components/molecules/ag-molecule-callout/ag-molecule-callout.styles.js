import { css } from 'lit';

export const styles = css`
  :host {
    display: flex;
    gap: var(--space-4);
    align-items: flex-start;
    margin: var(--space-8) 0;
    max-width: 45rem;
    padding: var(--space-5) var(--space-6) var(--space-5) 1.375rem;
    background: rgba(0, 229, 200, 0.04);
    border: 1px solid rgba(0, 229, 200, 0.18);
    border-left: 3px solid var(--cyan);
    border-radius: var(--r-md);
  }

  .icon {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: rgba(0, 229, 200, 0.1);
    color: var(--cyan);
    display: grid;
    place-items: center;
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--text-md);
  }

  .body {
    flex: 1;
  }

  .title {
    color: var(--cyan);
    font-family: var(--mono);
    font-size: var(--text-sm);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: var(--space-1);
    font-weight: 600;
  }

  ::slotted(ag-atom-text) {
    --ag-text-size: var(--text-semi);
    --ag-text-color: var(--fg);
  }
`;
