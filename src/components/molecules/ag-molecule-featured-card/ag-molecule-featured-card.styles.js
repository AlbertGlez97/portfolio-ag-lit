import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: relative;
    border: 1px solid var(--line-2);
    border-radius: var(--r-2xl);
    overflow: hidden;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
    transition:
      transform 0.3s,
      border-color 0.3s;
  }

  :host::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--grad);
    opacity: 0;
    transition: opacity 0.3s;
  }

  :host(:hover) {
    transform: translateY(-2px);
    border-color: rgba(0, 229, 200, 0.3);
  }

  :host(:hover)::before {
    opacity: 1;
  }

  .wrap {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    gap: 0;
    align-items: stretch;
  }

  .badge {
    position: absolute;
    top: var(--space-5);
    right: var(--space-5);
    z-index: 2;
    font-family: var(--mono);
    font-size: var(--text-2xs);
    padding: 0.3125rem 0.625rem;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    border-radius: var(--r-full);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: rgba(0, 229, 200, 0.08);
  }

  .visual {
    position: relative;
    min-height: 26.25rem;
    background: #0b0f18;
    overflow: hidden;
    border-right: 1px solid var(--line-2);
  }

  ::slotted(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }

  .vlabel {
    position: absolute;
    left: var(--space-5);
    bottom: var(--space-4);
    font-family: var(--mono);
    font-size: 0.65625rem;
    color: var(--fg-dimmer);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .body {
    padding: 2.75rem 2.75rem var(--space-10);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.125rem;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    flex-wrap: wrap;
  }

  .date,
  .read {
    font-family: var(--mono);
    font-size: var(--text-sm);
    color: var(--fg-dim);
  }

  .read::before {
    content: "· ";
    color: var(--fg-dimmer);
  }

  :host(:hover) ag-atom-heading {
    color: var(--cyan);
  }

  .excerpt {
    max-width: 56ch;
  }

  @media (max-width: 860px) {
    .wrap {
      grid-template-columns: 1fr;
    }
    .visual {
      min-height: 15rem;
      border-right: 0;
      border-bottom: 1px solid var(--line-2);
    }
    .body {
      padding: 1.75rem;
    }
  }
`;
