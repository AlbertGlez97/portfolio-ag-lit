import { css } from 'lit';

export const styles = css`
  :host {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 100vh;
    padding-top: var(--nav-h);
    overflow: hidden;
    isolation: isolate;
  }

  /* ---------- Grid overlay ---------- */
  .grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
    background-size: 4.5rem 4.5rem;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 85%);
    -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 40%, transparent 85%);
    z-index: -2;
    pointer-events: none;
  }

  /* ---------- Aurora (3 blobs) ---------- */
  .aurora {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(5rem);
    opacity: 0.15;
    will-change: transform;
  }

  .blob.a1 {
    width: 38.75rem;
    height: 38.75rem;
    background: var(--cyan);
    top: 8%;
    left: -6%;
    animation: drift1 14s ease-in-out infinite alternate;
  }

  .blob.a2 {
    width: 35rem;
    height: 35rem;
    background: var(--purple);
    top: 30%;
    right: -8%;
    animation: drift2 16s ease-in-out infinite alternate;
  }

  .blob.a3 {
    width: 30rem;
    height: 30rem;
    background: var(--blue);
    bottom: -10%;
    left: 35%;
    animation: drift3 18s ease-in-out infinite alternate;
  }

  @keyframes drift1 {
    0%   { transform: translate3d(0, 0, 0) scale(1); }
    100% { transform: translate3d(7.5rem, 5rem, 0) scale(1.15); }
  }

  @keyframes drift2 {
    0%   { transform: translate3d(0, 0, 0) scale(1.05); }
    100% { transform: translate3d(-5.625rem, 7.5rem, 0) scale(0.95); }
  }

  @keyframes drift3 {
    0%   { transform: translate3d(0, 0, 0) scale(0.95); }
    100% { transform: translate3d(-8.75rem, -3.75rem, 0) scale(1.1); }
  }

  /* ---------- Contenido ---------- */
  .wrap {
    width: 100%;
    max-width: var(--wrap-max);
    margin: 0 auto;
    padding: var(--space-10) var(--wrap-pad) var(--space-20);
  }

  ag-atom-heading {
    margin-top: 1.75rem;
  }

  ag-atom-text[variant="hero-sub"] {
    margin-top: var(--space-8);
  }

  ag-molecule-hero-command {
    margin-top: var(--space-10);
  }

  .cta {
    margin-top: 2.75rem;
    display: flex;
    gap: 0.875rem;
    flex-wrap: wrap;
  }

  .corner {
    position: absolute;
    bottom: var(--space-8);
    right: var(--wrap-pad);
  }

  /* ---------- Reveal escalonado (CSS puro, sin observer) ---------- */
  @keyframes hero-reveal {
    from { opacity: 0; transform: translateY(0.75rem); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .wrap > * {
    animation: hero-reveal 0.7s ease-out both;
  }

  .wrap > :nth-child(1) { animation-delay: 0.00s; }
  .wrap > :nth-child(2) { animation-delay: 0.12s; }
  .wrap > :nth-child(3) { animation-delay: 0.24s; }
  .wrap > :nth-child(4) { animation-delay: 0.36s; }
  .wrap > :nth-child(5) { animation-delay: 0.48s; }

  /* ---------- Responsive ---------- */
  @media (max-width: 45rem) {
    .wrap {
      padding-left: var(--wrap-pad-sm);
      padding-right: var(--wrap-pad-sm);
    }
    .corner {
      right: var(--wrap-pad-sm);
    }
  }
`;
