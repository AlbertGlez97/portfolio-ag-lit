import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 0 0 rgba(0, 229, 200, 0.6);
    animation: pulse 2s infinite;
    flex-shrink: 0;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0   rgba(0, 229, 200, 0.6); }
    70%  { box-shadow: 0 0 0 10px rgba(0, 229, 200, 0); }
    100% { box-shadow: 0 0 0 0   rgba(0, 229, 200, 0); }
  }
`;
