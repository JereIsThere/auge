// Smooth scroll für interne Anker-Links
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href')!);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Aktiven Abschnitt im Nav hervorheben
const sections = document.querySelectorAll<HTMLElement>('.wiki-section');
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.topic-nav a');

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
    }
  }
}, { rootMargin: '-20% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));
