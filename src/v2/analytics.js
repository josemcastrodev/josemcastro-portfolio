// Analítica y aviso de privacidad: mismo comportamiento y misma clave que la web anterior.
const ID = 'G-SZ5B1NE58P';
const KEY = 'portfolio-analytics-consent-v1';
const SRC = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
let started = false;

function readConsent() {
  try { return JSON.parse(localStorage.getItem(KEY))?.choice || null; } catch { return null; }
}

export function track(name, parameters = {}) {
  if (window.gtag) window.gtag('event', name, parameters);
}

function enable() {
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  if (started) return;
  started = true;
  if (document.querySelector(`script[src="${SRC}"]`)) return;
  window.gtag('js', new Date());
  window.gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = SRC;
  document.head.appendChild(script);
}

export function initAnalytics() {
  const panel = document.querySelector('.consent');
  enable();

  const close = () => { panel.hidden = true; };
  const open = () => { panel.hidden = false; };
  if (!readConsent()) open();

  panel.querySelector('.consent-close').addEventListener('click', close);
  panel.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      try { localStorage.setItem(KEY, JSON.stringify({ choice: button.dataset.choice, date: new Date().toISOString() })); } catch { /* sin almacenamiento */ }
      enable();
      close();
    });
  });
  window.addEventListener('portfolio:open-privacy-settings', open);

  document.addEventListener('click', (event) => {
    const href = event.target.closest('a')?.getAttribute('href') || '';
    if (href.startsWith('mailto:')) track('contact_click', { method: 'email' });
    else if (href.includes('linkedin.com')) track('contact_click', { method: 'linkedin' });
    else if (href.endsWith('.pdf')) track('cv_download');
  });
}
