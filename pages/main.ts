import pages from './pages.json';

const stack = document.querySelector<HTMLDivElement>('#links-stack')!;
stack.innerHTML = pages
  .map((name, i) => `
    <a href="/${name}/" class="card">
      <div class="card-preview">
        <img src="/${name}/preview.jpg" alt="${name}" onerror="this.style.display='none'">
        <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
      </div>
      <div class="card-body">
        <span class="card-name">${name}</span>
        <span class="card-cyr">${name.toUpperCase()}</span>
        <span class="card-arr">→</span>
      </div>
    </a>`)
  .join('');
