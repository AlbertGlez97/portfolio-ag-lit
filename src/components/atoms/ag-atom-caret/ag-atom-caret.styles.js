import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    width: 0.5rem;
    height: 0.875rem;
    background: var(--cyan);
    vertical-align: middle;
    animation: blink 1s steps(2) infinite;
  }

  :host([variant="hero"]) {
    width: 0.09em;
    height: 0.82em;
    margin-left: 0.04em;
    transform: translateY(0.06em);
  }

  :host([variant="terminal"]) {
    width: 0.5em;
    height: 1.1em;
    vertical-align: middle;
    margin-left: 0.05em;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }
`;
