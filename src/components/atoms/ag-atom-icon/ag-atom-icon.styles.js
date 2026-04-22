import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--_ag-icon-size, 1rem);
    height: var(--_ag-icon-size, 1rem);
    color: currentColor;
    flex-shrink: 0;
  }

  ::slotted(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
