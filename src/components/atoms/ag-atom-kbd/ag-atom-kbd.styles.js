import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    font-family: var(--mono);
    font-size: var(--text-xs);
    padding: 0.125rem 0.375rem;
    border: 1px solid var(--line-2);
    border-radius: var(--r-xs);
    color: var(--fg-dim);
    line-height: 1.3;
  }
`;
