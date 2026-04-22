import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    margin: var(--space-8) 0;
  }

  blockquote {
    margin: 0;
    padding-left: var(--space-6);
    border-left: 3px solid var(--cyan);
    font-family: var(--display);
    font-size: var(--text-xl);
    line-height: 1.5;
    color: var(--fg);
    font-style: italic;
  }

  ::slotted([slot="cite"]) {
    display: block;
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
    margin-top: var(--space-3);
    font-style: normal;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;
