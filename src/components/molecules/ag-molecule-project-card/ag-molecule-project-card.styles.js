import { css } from 'lit';

export const styles = css`
  :host {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: 1.75rem 1.625rem 1.625rem;
    min-height: 21.25rem;
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
    transform: translateY(-4px);
    border-color: var(--line-2);
    background: linear-gradient(180deg, rgba(0, 229, 200, 0.03), rgba(255, 255, 255, 0));
  }

  :host(:hover)::before {
    transform: scaleX(1);
  }

  .num {
    position: absolute;
    top: var(--space-5);
    right: var(--space-5);
    font-family: var(--mono);
    font-size: var(--text-xs);
    color: var(--fg-dimmer);
    letter-spacing: 0.1em;
  }

  .icon {
    width: var(--space-12);
    height: var(--space-12);
    border-radius: var(--r-lg);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--line-2);
    display: grid;
    place-items: center;
    color: var(--cyan);
    font-family: var(--mono);
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .description {
    flex: 1;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .card-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.875rem;
    border-top: 1px dashed var(--line);
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
  }

  .card-foot .arrow {
    color: var(--fg-dim);
    text-decoration: none;
    transition:
      color 0.2s,
      transform 0.2s;
  }

  :host(:hover) .card-foot .arrow {
    color: var(--cyan);
    transform: translateX(4px);
  }
`;
