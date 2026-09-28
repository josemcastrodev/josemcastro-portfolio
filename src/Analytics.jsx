import React, { useEffect, useState } from 'react';

const ID = 'G-SZ5B1NE58P';
const KEY = 'portfolio-analytics-consent-v1';
let started = false;
function readConsent() {
  try { return JSON.parse(localStorage.getItem(KEY))?.choice || null; } catch { return null; }
}
export function track(name, parameters = {}) {
  if (readConsent() === 'accepted' && window.gtag) window.gtag('event', name, parameters);
}
function enable() {
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (started) { window.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
  started = true;
  window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  window.gtag('js', new Date());
  window.gtag('config', ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  window.gtag('event', 'page_view', { page_location: location.origin + location.pathname, page_title: document.title });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(script);
}
export default function Analytics({ lang, section }) {
  const [open, setOpen] = useState(false);
  const es = lang === 'es';
  useEffect(() => { const choice = readConsent(); setOpen(!choice); if (choice === 'accepted') enable(); }, []);
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
    if (choice === 'accepted') { enable(); track('section_view', { section_name: section, language: lang }); }
    else {
      window[`ga-disable-${ID}`] = true;
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (!name.startsWith('_ga')) continue;
        for (const domain of ['', location.hostname, '.' + location.hostname]) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
      }
    }
    setOpen(false);
  }
  return <><button className="privacy-control" onClick={() => setOpen(true)}>{es ? 'Privacidad' : 'Privacy'}</button>{open && <aside className="consent-panel" aria-label={es ? 'Cookies analíticas' : 'Analytics cookies'}><h2>{es ? 'Tu privacidad' : 'Your privacy'}</h2><p>{es ? 'Con tu permiso, usamos Google Analytics para medir visitas e interacciones. Puedes rechazarlo y navegar igual.' : 'With your permission, we use Google Analytics to measure visits and interactions. You can reject it and browse normally.'}</p><a href="/privacidad.html" target="_blank" rel="noreferrer">{es ? 'Información de privacidad y cookies' : 'Privacy and cookie information'}</a><div><button onClick={() => choose('rejected')}>{es ? 'Rechazar' : 'Reject'}</button><button onClick={() => choose('accepted')}>{es ? 'Aceptar analíticas' : 'Accept analytics'}</button></div></aside>}</>;
}
