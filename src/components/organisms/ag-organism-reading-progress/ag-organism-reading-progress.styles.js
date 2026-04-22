import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 60;
    pointer-events: none;
    background: transparent;
  }

  .bar {
    height: 100%;
    width: 100%;
    background: var(--grad);
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
    box-shadow: 0 0 0.75rem rgba(0, 229, 200, 0.5);
  }
`;
