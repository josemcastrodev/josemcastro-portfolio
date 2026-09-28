import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../work/ssr/prerender.js';

const path = new URL('../dist/index.html', import.meta.url);
const html = await readFile(path, 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('Missing prerender root');
const rendered = render();
if (!rendered.includes('Alcobendas')) throw new Error('Missing profile content');
await writeFile(path, html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`));
console.log('Portfolio HTML prerendered successfully.');
