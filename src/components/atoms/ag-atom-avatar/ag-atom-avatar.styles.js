import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    color: #07090f;
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--text-md);
    letter-spacing: -0.02em;
    box-shadow:
      0 0 0 2px #0b0f17,
      0 0 0 3px rgba(0, 229, 200, 0.3);
    user-select: none;
    flex-shrink: 0;
  }
`;
