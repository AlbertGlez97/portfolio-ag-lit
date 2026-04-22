import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
  }

  :host([variant="meta"]),
  :host([variant="caption"]),
  :host([variant="mono"]) {
    display: inline;
  }

  :host([variant="lede"]) { color: var(--ag-text-color, var(--fg)); }
  :host([variant="body"]) { color: var(--ag-text-color, var(--fg-dim)); }
  :host([variant="hero-sub"]) {
    color: var(--ag-text-color, var(--fg));
    display: flex;
    align-items: center;
    gap: 1.125rem;
  }
  :host([variant="hero-sub"])::before {
    content: "";
    width: 2.75rem;
    height: 1px;
    background: var(--cyan);
    flex-shrink: 0;
  }
  :host([variant="caption"]) { color: var(--ag-text-color, var(--fg-dimmer)); }
  :host([variant="meta"]) { color: var(--ag-text-color, var(--fg-dim)); }
  :host([variant="mono"]) { color: var(--ag-text-color, var(--cyan)); }

  p, span, code {
    margin: 0;
    color: inherit;
    transition: color 0.2s;
  }

  /* Block variants (lede, body) soportan clamp vía --ag-text-clamp */
  :host([variant="lede"]) p,
  :host([variant="body"]) p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--ag-text-clamp, none);
    overflow: hidden;
  }

  /* ---------- lede ---------- */
  :host([variant="lede"]) p {
    font-family: var(--display);
    font-size: var(--ag-text-size, var(--text-xl));
    line-height: 1.6;
    font-weight: 400;
  }

  /* ---------- body ---------- */
  :host([variant="body"]) p {
    font-family: var(--display);
    font-size: var(--ag-text-size, var(--text-plus));
    line-height: 1.75;
    max-width: 42.5rem;
  }

  /* ---------- caption ---------- */
  :host([variant="caption"]) span {
    font-family: var(--mono);
    font-size: var(--ag-text-size, var(--text-sm));
    line-height: 1.55;
  }

  /* ---------- meta ---------- */
  :host([variant="meta"]) span {
    font-family: var(--mono);
    font-size: var(--ag-text-size, var(--text-sm));
    letter-spacing: 0.02em;
  }

  /* ---------- hero-sub (subtitle del hero con barra cian) ---------- */
  :host([variant="hero-sub"]) p {
    font-family: var(--display);
    font-size: var(--ag-text-size, 1.375rem);
    font-weight: 500;
    line-height: 1.4;
  }

  /* ---------- mono (inline code) ---------- */
  :host([variant="mono"]) code {
    font-family: var(--mono);
    font-size: var(--ag-text-size, var(--text-md));
    background: rgba(0, 229, 200, 0.08);
    padding: 0.125rem 0.375rem;
    border-radius: var(--r-xs);
    border: 1px solid rgba(0, 229, 200, 0.15);
  }
`;
