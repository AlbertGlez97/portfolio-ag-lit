import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  input {
    width: 100%;
    font-family: var(--display);
    font-size: var(--text-semi);
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    color: var(--fg);
    padding: var(--space-3) 0.875rem;
    outline: 0;
    transition:
      border-color 0.2s,
      background 0.2s,
      box-shadow 0.2s;
    caret-color: var(--cyan);
  }

  input::placeholder {
    color: var(--fg-dimmer);
  }

  input:focus {
    border-color: var(--cyan);
    background: rgba(0, 229, 200, 0.04);
    box-shadow: 0 0 0 3px rgba(0, 229, 200, 0.12);
  }

  :host([error]) input {
    border-color: var(--orange);
  }

  :host([disabled]) input {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
