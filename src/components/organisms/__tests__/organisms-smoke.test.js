import { describe, it, expect, afterEach } from 'vitest';

import '../ag-organism-hero/ag-organism-hero.js';
import '../ag-organism-footer/ag-organism-footer.js';
import '../ag-organism-stats-strip/ag-organism-stats-strip.js';
import '../ag-organism-projects-grid/ag-organism-projects-grid.js';
import '../ag-organism-laboratorio-list/ag-organism-laboratorio-list.js';
import '../ag-organism-contact-links/ag-organism-contact-links.js';
import '../ag-organism-article-end/ag-organism-article-end.js';
import '../ag-organism-terminal/ag-organism-terminal.js';
import '../ag-organism-article-reader/ag-organism-article-reader.js';

async function mount(tag, props = {}) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) el[k] = v;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const collected = [];
afterEach(() => { collected.forEach((el) => el.remove()); collected.length = 0; });
const track = (el) => { collected.push(el); return el; };

const SMOKE_TAGS = [
  'ag-organism-hero',
  'ag-organism-footer',
  'ag-organism-stats-strip',
  'ag-organism-projects-grid',
  'ag-organism-laboratorio-list',
  'ag-organism-contact-links',
  'ag-organism-article-end',
  'ag-organism-terminal',
  'ag-organism-article-reader',
];

describe('organisms visuales y complejos — smoke tests', () => {
  it.each(SMOKE_TAGS)('%s se monta sin errores y tiene shadowRoot', async (tag) => {
    const el = track(await mount(tag));
    expect(el.shadowRoot).toBeTruthy();
  });
});
