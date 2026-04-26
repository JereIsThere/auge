import pages from './pages.json';

const stack = document.querySelector<HTMLDivElement>('#links-stack')!;
stack.innerHTML = pages
  .map((name, i) => `
    <a href="/${name}/" class="art-link">
      <span class="l-num">${String(i + 1).padStart(2, '0')}</span>
      <div class="l-div"></div>
      <span class="l-name">${name}</span>
      <span class="l-cyr">${name.toUpperCase()}</span>
      <span class="l-arr">→</span>
    </a>`)
  .join('');
