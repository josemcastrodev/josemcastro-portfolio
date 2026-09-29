import React, { useEffect, useState } from 'react';

const ID = 'G-SZ5B1NE58P';
const KEY = 'portfolio-analytics-consent-v1';
let started = false;
function readConsent() {
  try { return JSON.parse(localStorage.getItem(KEY))?.choice || null; } catch { return null; }
}
const SRC = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
export function track(name, parameters = {}) {
  if (window.gtag) window.gtag('event', name, parameters);
}
function enable() {
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
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
export default function Analytics({ lang, section }) {
  const [open, setOpen] = useState(false);
  const es = lang === 'es';
  useEffect(() => { setOpen(!readConsent()); enable(); }, []);
  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener('portfolio:open-privacy-settings', reopen);
    return () => window.removeEventListener('portfolio:open-privacy-settings', reopen);
  }, []);
  useEffect(() => { track('section_view', { section_name: section, language: lang }); }, [section, lang]);
  useEffect(() => {
    const click = event => {
      const href = event.target.closest('a')?.getAttribute('href') || '';
      if (href.startsWith('mailto:')) track('contact_click', { method: 'email' });
      else if (href.includes('linkedin.com')) track('contact_click', { method: 'linkedin' });
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
  function choose(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice, date: new Date().toISOString() })); } catch { setOpen(false); return; }
    enable();
    if (choice === 'accepted') track('section_view', { section_name: section, language: lang });
    setOpen(false);
  }
  return <>{open && <aside className="consent-panel" aria-label={es ? 'Cookies analíticas' : 'Analytics cookies'}><button className="consent-close" type="button" aria-label={es ? 'Cerrar' : 'Close'} onClick={() => setOpen(false)}>×</button><h2>{es ? 'Tu privacidad' : 'Your privacy'}</h2><p>{es ? 'Usamos Google Analytics para medir visitas e interacciones. La medición sigue activa aunque pulses rechazar.' : 'We use Google Analytics to measure visits and interactions. Measurement stays on even if you reject this notice.'}</p><a href="/privacidad.html" target="_blank" rel="noreferrer">{es ? 'Información de privacidad y cookies' : 'Privacy and cookie information'}</a><div><button onClick={() => choose('rejected')}>{es ? 'Rechazar' : 'Reject'}</button><button onClick={() => choose('accepted')}>{es ? 'Aceptar analíticas' : 'Accept analytics'}</button></div></aside>}</>;
}
