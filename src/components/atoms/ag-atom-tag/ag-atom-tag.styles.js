import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    width: fit-content;
    padding: var(--space-1) 0.625rem;
    border: 1px solid var(--line-2);
    border-radius: var(--r-xs);
    background: rgba(255, 255, 255, 0.02);

    font-family: var(--mono);
    font-size: var(--text-xs);
    letter-spacing: 0.04em;
    color: var(--fg-dim);
    white-space: nowrap;
  }

  :host([size="md"]) {
    padding: 0.3125rem 0.6875rem;
  }

  :host([variant="threejs"]) {
    color: var(--blue);
    background: rgba(78, 163, 255, 0.1);
    border-color: rgba(78, 163, 255, 0.25);
  }

  :host([variant="ia"]) {
    color: var(--purple);
    background: rgba(168, 85, 247, 0.1);
    border-color: rgba(168, 85, 247, 0.25);
  }

  :host([variant="tutor"]) {
    color: var(--cyan);
    background: rgba(0, 229, 200, 0.1);
    border-color: rgba(0, 229, 200, 0.3);
  }

  :host([variant="backend"]) {
    color: var(--orange);
    background: rgba(255, 138, 61, 0.1);
    border-color: rgba(255, 138, 61, 0.25);
  }
`;
