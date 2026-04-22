import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
    border-bottom: 1px solid var(--line);
  }

  :host::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--cyan);
    opacity: 0;
    transition: opacity 0.3s;
  }

  a {
    display: grid;
    grid-template-columns: 8.75rem 6.25rem 1fr auto;
    align-items: center;
    gap: 1.75rem;
    padding: 1.625rem var(--space-2);
    text-decoration: none;
    color: inherit;
    transition:
      padding 0.3s,
      background 0.3s;
  }

  a:hover {
    padding-left: 1.375rem;
    background: rgba(255, 255, 255, 0.015);
  }

  :host(:hover)::after {
    opacity: 1;
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: -2px;
  }

  .date {
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dimmer);
  }

  .main ag-atom-heading {
    margin-bottom: var(--space-1);
  }

  a:hover .main ag-atom-heading {
    color: var(--cyan);
  }

  .main ag-atom-text {
    max-width: 40rem;
  }

  .arrow {
    font-family: var(--mono);
    color: var(--fg-dimmer);
    font-size: var(--text-lg);
    transition:
      transform 0.3s,
      color 0.3s;
  }

  a:hover .arrow {
    color: var(--cyan);
    transform: translateX(6px);
  }

  @media (max-width: 820px) {
    a {
      grid-template-columns: auto 1fr;
      grid-template-areas: "tag date" "main main" "arrow arrow";
      gap: 0.625rem;
    }
    .tag-slot { grid-area: tag; }
    .date { grid-area: date; text-align: right; }
    .main { grid-area: main; }
    .arrow { grid-area: arrow; justify-self: end; }
  }
`;
