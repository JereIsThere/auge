// Aktiven Menüpunkt markieren
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('nav.menu a').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });

  // Smooth-scroll für #-Anker
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });
});
