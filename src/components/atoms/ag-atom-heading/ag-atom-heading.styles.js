import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    color: var(--ag-heading-color, var(--fg));
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    color: inherit;
    transition: color 0.2s;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--ag-heading-clamp, none);
    overflow: hidden;
  }

  /* ---------- display (hero) ---------- */
  :host([variant="display"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 700;
    font-size: var(--ag-heading-size, var(--text-hero));
    line-height: 0.9;
    letter-spacing: -0.045em;
  }

  /* ---------- section ---------- */
  :host([variant="section"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--ag-heading-size, var(--text-5xl));
    line-height: 1;
    letter-spacing: -0.035em;
  }

  /* ---------- card-sm (article-card, lab-row, related-card) ---------- */
  :host([variant="card-sm"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--ag-heading-size, var(--text-lg));
    line-height: 1.3;
    letter-spacing: -0.015em;
  }

  /* ---------- card (project-card) ---------- */
  :host([variant="card"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--ag-heading-size, var(--text-2xl));
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  /* ---------- card-lg (featured-card) — responsive built-in ---------- */
  :host([variant="card-lg"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--ag-heading-size, clamp(1.75rem, 5vw, 2.25rem));
    line-height: 1.08;
    letter-spacing: -0.025em;
  }

  /* ---------- article (h2 del cuerpo del artículo) ---------- */
  :host([variant="article"]) :is(h1, h2, h3, h4, h5, h6) {
    font-family: var(--display);
    font-weight: 600;
    font-size: var(--ag-heading-size, var(--text-3xl));
    line-height: 1.2;
    letter-spacing: -0.025em;
    display: flex;
    align-items: baseline;
    gap: 0.875rem;
    overflow: visible;
  }

  :host([variant="article"]) :is(h1, h2, h3, h4, h5, h6)[data-n]::before {
    content: attr(data-n);
    font-family: var(--mono);
    font-size: 0.8125rem;
    color: var(--cyan);
    font-weight: 400;
    letter-spacing: 0.1em;
    padding-top: var(--space-1);
    flex-shrink: 0;
  }
`;
