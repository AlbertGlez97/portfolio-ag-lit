import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  textarea {
    width: 100%;
    font-family: var(--mono);
    font-size: 0.84375rem;
    line-height: 1.55;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    color: var(--fg);
    padding: var(--space-3) 0.875rem;
    outline: 0;
    resize: vertical;
    min-height: 8.125rem;
    transition:
      border-color 0.2s,
      background 0.2s,
      box-shadow 0.2s;
    caret-color: var(--cyan);
  }

  textarea::placeholder {
    color: var(--fg-dimmer);
  }

  textarea:focus {
    border-color: var(--cyan);
    background: rgba(0, 229, 200, 0.04);
    box-shadow: 0 0 0 3px rgba(0, 229, 200, 0.12);
  }

  :host([error]) textarea {
    border-color: var(--orange);
  }

  :host([disabled]) textarea {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
