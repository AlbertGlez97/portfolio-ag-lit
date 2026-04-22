import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: var(--nav-h);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    background: rgba(7, 9, 15, 0.65);
    border-bottom: 1px solid transparent;
    transition:
      border-color 0.25s ease,
      background 0.25s ease;
  }

  :host([scrolled]) {
    border-bottom-color: var(--line);
    background: rgba(7, 9, 15, 0.8);
  }

  .inner {
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: 0 var(--wrap-pad);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .links {
    display: flex;
    gap: 0.375rem;
    align-items: center;
  }

  @media (max-width: 45rem) {
    .inner {
      padding: 0 var(--wrap-pad-sm);
    }
  }
`;
