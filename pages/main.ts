import pages from './pages.json';
import guides from './guides.json';

type Guide = {
  slug: string;
  title: string;
  icon: string;
  accent: string;
  section: string;
  desc: string;
};

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

const guidesStack = document.querySelector<HTMLDivElement>('#guides-stack');
if (guidesStack) {
  const sections = (guides as Guide[]).reduce<Record<string, Guide[]>>((acc, g) => {
    (acc[g.section] ||= []).push(g);
    return acc;
  }, {});

  guidesStack.innerHTML = Object.entries(sections)
    .map(([section, items]) => `
      <div class="guides-group">
        <div class="guides-group-head">
          <span class="guides-group-title">${section}</span>
          <span class="guides-group-line"></span>
        </div>
        <div class="guides-grid">
          ${items.map((g) => `
            <a href="/${g.slug}/" class="guide-card" style="--accent:${g.accent}">
              <span class="guide-icon">${g.icon}</span>
              <div class="guide-body">
                <span class="guide-title">${g.title}</span>
                <span class="guide-slug">${g.slug}</span>
                <span class="guide-desc">${g.desc}</span>
              </div>
              <span class="guide-arr">→</span>
            </a>`).join('')}
        </div>
      </div>`)
    .join('');
}
