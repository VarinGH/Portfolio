#!/usr/bin/env node
/* Writes "English Content.md" from content.js (every English string, for Varin to edit).
   Run by tools/bump.py on every version bump, so the file always matches the app. */
var fs = require('fs'), path = require('path');
var root = path.dirname(__dirname);
global.window = {};
require(path.join(root, 'content.js'));
var D = window.PORTFOLIO, o = [];
function en(v) { return v == null ? '' : (typeof v === 'string' ? v : (v.en || '')); }
function f(label, v) { if (v != null && en(v) !== '') o.push('**' + label + ':** ' + en(v), ''); }
function list(label, a) { if (!a || !a.length) return; o.push('**' + label + ':**', ''); a.forEach(function (x) { o.push('- ' + en(x)); }); o.push(''); }
function items(pre, a) { (a || []).forEach(function (it, i) { f(pre + ' item ' + (i + 1) + ' name', it.name); f(pre + ' item ' + (i + 1) + ' meta', it.meta); f(pre + ' item ' + (i + 1) + ' text', it.text); }); }
function col(pre, c) { if (!c) return; f(pre + ' heading', c.heading); items(pre, c.items); f(pre + ' listlabel', c.listlabel); list(pre + ' list', c.list);
  if (c.sub) { f(pre + ' lower heading', c.sub.heading); items(pre + ' lower', c.sub.items); list(pre + ' lower list', c.sub.list); } }
o.push('# English Content: Residency Portfolio', '',
  'Edit the text after each bold label. Keep the bold labels and the `## Page` headings as they are.', '',
  '- In a list (Problem, Key solutions, bullet lists) you can add or delete `- ` lines.',
  '- `*italic*` and `**bold**` inside the text are shown in the app as italic and bold.',
  '- `[SQUARE BRACKETS]` are placeholders still to be written.',
  '- Thai text, photos, videos and animations are not in this file and stay as they are.', '',
  'When you are done, hand the file back and it is written into `content.js` and pushed.', '',
  '## Interface', '');
var u = D.ui.en;
f('name', u.name); f('running title', u.running); f('problem', u.problem); f('solution', u.solution); f('fig', u.fig); f('page', u.page); f('of', u.of); f('prev', u.prev); f('next', u.next); f('foot', u.foot);
o.push('## Bottom menu', '');
D.sections.forEach(function (s, i) { f((i + 1) + ' label', s.label); });
D.pages.forEach(function (p, n) {
  o.push('## Page ' + (n + 1) + ': ' + en(p.title), '');
  f('title', p.title);
  if (p.type === 'project') { f('subtitle', p.sub); f('role', p.role); list('problem', p.problem); list('solutions', p.bullets); }
  if (p.type === 'research') { col('left', p.left); col('right', p.right); }
  if (p.type === 'cv') { f('statement', p.statement);
    (p.blocks || []).forEach(function (b, bi) { var pre = 'block ' + (bi + 1); f(pre + ' heading', b.heading);
      (b.entries || []).forEach(function (e, ei) { f(pre + ' entry ' + (ei + 1) + ' line1', e.t); f(pre + ' entry ' + (ei + 1) + ' line2', e.s); f(pre + ' entry ' + (ei + 1) + ' note', e.n); });
      list(pre + ' list', b.list); }); }
  if (p.type === 'gallery') { f('hint', p.hint); (p.items || []).forEach(function (it, i) { f('item ' + (i + 1) + ' caption', it.cap); }); }
  (p.media || []).forEach(function (m, i) { f('media ' + (i + 1) + ' tab', m.tab); f('media ' + (i + 1) + ' caption', m.cap); });
});
fs.writeFileSync(path.join(root, 'English Content.md'), o.join('\n').replace(/\n+$/, '') + '\n', 'utf8');
console.log('English Content.md written');
