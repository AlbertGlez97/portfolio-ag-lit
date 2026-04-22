import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    width: fit-content;
  }

  button,
  a {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--mono);
    font-size: var(--text-md);
    padding: 0.875rem 1.375rem;
    border-radius: var(--r-lg);
    border: 1px solid transparent;
    background: transparent;
    color: var(--fg);
    text-decoration: none;
    cursor: pointer;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      background 0.2s,
      border-color 0.2s,
      color 0.2s;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  :host([disabled]) button,
  :host([disabled]) a {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ---------- primary ---------- */
  :host([variant="primary"]) button,
  :host([variant="primary"]) a {
    border-color: rgba(0, 229, 200, 0.5);
    color: var(--cyan);
    background: rgba(0, 229, 200, 0.04);
  }
  :host([variant="primary"]) button:hover,
  :host([variant="primary"]) a:hover {
    border-color: var(--cyan);
    background: rgba(0, 229, 200, 0.12);
    box-shadow:
      0 10px 30px -10px rgba(0, 229, 200, 0.5),
      inset 0 0 0 1px rgba(0, 229, 200, 0.2);
    transform: translateY(-2px);
  }

  /* ---------- ghost ---------- */
  :host([variant="ghost"]) button,
  :host([variant="ghost"]) a {
    border-color: var(--line-2);
    color: var(--fg-dim);
  }
  :host([variant="ghost"]) button:hover,
  :host([variant="ghost"]) a:hover {
    color: var(--fg);
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.03);
  }

  /* ---------- send ---------- */
  :host([variant="send"]) button {
    background: var(--cyan);
    color: var(--bg);
    border-color: var(--cyan);
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  :host([variant="send"]) button:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px -12px rgba(0, 229, 200, 0.6);
  }

  /* ---------- back ---------- */
  :host([variant="back"]) button,
  :host([variant="back"]) a {
    font-size: var(--text-2sm);
    border-color: var(--line-2);
    color: var(--fg-dim);
  }
  :host([variant="back"]) button:hover,
  :host([variant="back"]) a:hover {
    color: var(--cyan);
    border-color: rgba(0, 229, 200, 0.4);
    background: rgba(0, 229, 200, 0.04);
    transform: translateX(-4px);
  }

  /* ---------- read ---------- */
  :host([variant="read"]) button,
  :host([variant="read"]) a {
    font-size: var(--text-2sm);
    padding: var(--space-3) 1.375rem;
    color: var(--cyan);
    border-color: rgba(0, 229, 200, 0.5);
    background: rgba(0, 229, 200, 0.04);
  }
  :host([variant="read"]) button:hover,
  :host([variant="read"]) a:hover {
    transform: translateY(-2px);
    background: rgba(0, 229, 200, 0.12);
    border-color: var(--cyan);
    box-shadow: 0 10px 30px -10px rgba(0, 229, 200, 0.5);
  }

  /* ---------- rate ---------- */
  :host([variant="rate"]) button {
    font-size: var(--text-2sm);
    padding: 0.625rem 1.125rem;
    border-radius: var(--r-full);
    border-color: var(--line-2);
    color: var(--fg-dim);
  }
  :host([variant="rate"]) button:hover {
    color: var(--fg);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  :host([variant="rate"][picked]) button {
    color: var(--cyan);
    border-color: var(--cyan);
    background: rgba(0, 229, 200, 0.06);
  }
`;
