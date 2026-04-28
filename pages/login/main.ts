import { login, isAuthenticated } from '../auth';

// Bereits eingeloggt → Weiterleitung
if (isAuthenticated()) {
  const next = new URLSearchParams(location.search).get('next') || '/admin/';
  location.replace(next);
}

const form    = document.getElementById('login-form')    as HTMLFormElement;
const input   = document.getElementById('password')      as HTMLInputElement;
const errEl   = document.getElementById('login-error')   as HTMLDivElement;
const btnText = document.getElementById('btn-text')      as HTMLSpanElement;
const spinner = document.getElementById('btn-spinner')   as HTMLSpanElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.hidden = true;

  btnText.textContent = 'Prüfe…';
  spinner.hidden = false;
  input.disabled = true;

  const ok = await login(input.value);

  if (ok) {
    const next = new URLSearchParams(location.search).get('next') || '/admin/';
    location.replace(next);
  } else {
    btnText.textContent = 'Einloggen';
    spinner.hidden = true;
    input.disabled = false;
    input.value = '';
    input.focus();
    errEl.textContent = 'Falsches Passwort.';
    errEl.hidden = false;
  }
});
