import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    flex-shrink: 0;
  }

  :host([orientation="horizontal"]) {
    width: 100%;
    height: 1px;
    background: var(--line);
  }

  :host([orientation="vertical"]) {
    width: 1px;
    height: 0.875rem;
    background: var(--line-2);
  }

  :host([variant="dashed"][orientation="horizontal"]) {
    height: 0;
    background: transparent;
    border-top: 1px dashed var(--line);
  }

  :host([variant="dashed"][orientation="vertical"]) {
    width: 0;
    background: transparent;
    border-left: 1px dashed var(--line);
  }
`;
