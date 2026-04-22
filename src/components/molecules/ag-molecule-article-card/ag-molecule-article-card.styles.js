import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
    border: 1px solid var(--line);
    border-radius: var(--r-xl);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0));
    overflow: hidden;
    transition:
      transform 0.3s,
      border-color 0.3s,
      background 0.3s;
  }

  :host::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--grad);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  :host(:hover) {
    transform: translateY(-3px);
    border-color: var(--line-2);
    background: linear-gradient(180deg, rgba(0, 229, 200, 0.025), rgba(255, 255, 255, 0));
  }

  :host(:hover)::before {
    transform: scaleX(1);
  }

  a {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1.75rem 1.625rem var(--space-6);
    min-height: 13.75rem;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: -2px;
    border-radius: var(--r-xl);
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.875rem;
  }

  .date {
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
    letter-spacing: 0.06em;
  }

  a:hover ag-atom-heading {
    color: var(--cyan);
  }

  .excerpt {
    flex: 1;
    --ag-text-clamp: 1;
  }

  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.875rem;
    border-top: 1px dashed var(--line);
    font-family: var(--mono);
    font-size: 0.71875rem;
    color: var(--fg-dim);
  }

  .read-time {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .read-time::before {
    content: "";
    width: var(--space-1);
    height: var(--space-1);
    border-radius: 50%;
    background: var(--fg-dimmer);
  }

  .arrow {
    color: var(--fg-dim);
    font-family: var(--mono);
    transition:
      color 0.2s,
      transform 0.2s;
  }

  a:hover .arrow {
    color: var(--cyan);
    transform: translateX(6px);
  }
`;
