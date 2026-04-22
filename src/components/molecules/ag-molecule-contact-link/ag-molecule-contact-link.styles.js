import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    border-bottom: 1px solid var(--line);
  }

  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-5) var(--space-1);
    font-family: var(--mono);
    font-size: var(--text-md);
    color: var(--fg);
    text-decoration: none;
    transition:
      padding 0.3s,
      color 0.3s;
  }

  a:hover {
    padding-left: 0.875rem;
    color: var(--cyan);
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  .lbl {
    color: var(--fg-dimmer);
    font-size: var(--text-xs);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .val {
    flex: 1;
    text-align: right;
    margin-right: 0.875rem;
  }

  .arrow {
    color: var(--fg-dimmer);
    transition:
      transform 0.3s,
      color 0.3s;
  }

  a:hover .arrow {
    color: var(--cyan);
    transform: translate(4px, -4px);
  }
`;
