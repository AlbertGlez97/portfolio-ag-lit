import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    margin: var(--space-10) 0;
    max-width: 45rem;
  }

  .visual {
    border: 1px solid var(--line-2);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: #0a0d14;
  }

  ::slotted(svg) {
    display: block;
    width: 100%;
    height: auto;
  }

  figcaption {
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dimmer);
    margin-top: var(--space-3);
    line-height: 1.55;
    padding-left: 0.875rem;
    border-left: 1px solid var(--line);
  }

  .num {
    color: var(--cyan);
    margin-right: var(--space-2);
  }
`;
