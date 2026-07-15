import { describe, it, expect, afterEach } from 'vitest';

import '../ag-molecule-article-card/ag-molecule-article-card.js';
import '../ag-molecule-featured-card/ag-molecule-featured-card.js';
import '../ag-molecule-project-card/ag-molecule-project-card.js';
import '../ag-molecule-related-card/ag-molecule-related-card.js';
import '../ag-molecule-lab-row/ag-molecule-lab-row.js';
import '../ag-molecule-contact-link/ag-molecule-contact-link.js';
import '../ag-molecule-nav-link/ag-molecule-nav-link.js';
import '../ag-molecule-stat/ag-molecule-stat.js';
import '../ag-molecule-byline/ag-molecule-byline.js';
import '../ag-molecule-callout/ag-molecule-callout.js';
import '../ag-molecule-figure/ag-molecule-figure.js';
import '../ag-molecule-hero-corner/ag-molecule-hero-corner.js';
import '../ag-molecule-hero-meta/ag-molecule-hero-meta.js';
import '../ag-molecule-hero-command/ag-molecule-hero-command.js';

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
  'ag-molecule-article-card',
  'ag-molecule-featured-card',
  'ag-molecule-project-card',
  'ag-molecule-related-card',
  'ag-molecule-lab-row',
  'ag-molecule-contact-link',
  'ag-molecule-nav-link',
  'ag-molecule-stat',
  'ag-molecule-byline',
  'ag-molecule-callout',
  'ag-molecule-figure',
  'ag-molecule-hero-corner',
  'ag-molecule-hero-meta',
  'ag-molecule-hero-command',
];

describe('moléculas compositivas — smoke tests', () => {
  it.each(SMOKE_TAGS)('%s se monta sin errores y tiene shadowRoot', async (tag) => {
    const el = track(await mount(tag));
    expect(el.shadowRoot).toBeTruthy();
  });
});
