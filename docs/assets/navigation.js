(() => {
  'use strict';
  const apps = [['ASF','Hub'],['ASF-visualizer','Visualizer'],['ASF-analytics','Analytics']];
  const current = document.body.dataset.app;
  const nav = document.getElementById('navigation');
  for (const [repo, label] of apps) {
    const a = document.createElement('a'); a.href = '/' + repo + '/'; a.textContent = label;
    if (repo === current) a.setAttribute('aria-current','page');
    nav.append(a);
  }
  const source = document.getElementById('source');
  if (source) source.href = 'https://github.com/sauravnrai/' + current;
})();
