import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: var(--space-3) var(--space-4);
    background: rgba(13, 17, 23, 0.6);
    border: 1px solid rgba(0, 229, 200, 0.4);
    border-radius: var(--r-lg);
    font-family: var(--mono);
    font-size: var(--text-2sm);
    min-width: 20rem;
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      background 0.2s;
  }

  :host(:focus-within) {
    border-color: var(--cyan);
    box-shadow: 0 0 0 3px rgba(0, 229, 200, 0.12);
    background: rgba(0, 229, 200, 0.03);
  }

  input {
    flex: 1;
    border: 0;
    background: transparent;
    outline: 0;
    color: var(--fg);
    font: inherit;
    caret-color: var(--cyan);
    min-width: 0;
  }

  input::placeholder {
    color: var(--fg-dimmer);
  }
`;
