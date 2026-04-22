import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  a {
    display: flex;
    gap: 0.875rem;
    padding: var(--space-4);
    align-items: center;
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0));
    text-decoration: none;
    color: inherit;
    transition:
      transform 0.25s,
      border-color 0.25s,
      background 0.25s;
  }

  a:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 229, 200, 0.25);
    background: linear-gradient(180deg, rgba(0, 229, 200, 0.025), rgba(255, 255, 255, 0));
  }

  a:focus-visible {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

  .vis {
    flex-shrink: 0;
    width: var(--space-16);
    height: var(--space-16);
    border-radius: var(--r-md);
    display: grid;
    place-items: center;
    font-family: var(--mono);
    font-size: var(--text-xl);
    color: var(--cyan);
    border: 1px solid var(--line-2);
  }

  :host([category="ia"]) .vis {
    color: var(--purple);
    background: rgba(168, 85, 247, 0.08);
    border-color: rgba(168, 85, 247, 0.2);
  }
  :host([category="backend"]) .vis {
    color: var(--orange);
    background: rgba(255, 138, 61, 0.08);
    border-color: rgba(255, 138, 61, 0.2);
  }
  :host([category="threejs"]) .vis {
    color: var(--blue);
    background: rgba(78, 163, 255, 0.08);
    border-color: rgba(78, 163, 255, 0.2);
  }
  :host([category="tutor"]) .vis {
    color: var(--cyan);
    background: rgba(0, 229, 200, 0.08);
    border-color: rgba(0, 229, 200, 0.2);
  }

  .body {
    flex: 1;
    min-width: 0;
  }

  .body ag-atom-heading {
    --ag-heading-clamp: 2;
  }

  .meta {
    font-family: var(--mono);
    font-size: 0.65625rem;
    color: var(--fg-dimmer);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: var(--space-1);
  }

  a:hover ag-atom-heading {
    color: var(--cyan);
  }
`;
