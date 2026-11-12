// Página de desarrollo web (ES/EN): mismas piezas de movimiento que la portada, sin el retrato.
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { initAnalytics } from './analytics.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const lang = document.body.dataset.lang || 'es';
const SCRUB = coarse ? 0.6 : true;
const CL = { linesClass: 'ln', wordsClass: 'wd', charsClass: 'ch' };
ScrollTrigger.config({ ignoreMobileResize: true });

const TEXT = {
  es: {
    invalid: 'Revisa el nombre, el email, el mensaje (mínimo 10 caracteres) y la casilla de privacidad.',
    sending: 'Enviando… ', send: 'Enviar mensaje ',
    error: 'No se pudo enviar. Inténtalo de nuevo o escríbeme a jose1911castro@gmail.com.',
  },
  en: {
    invalid: 'Please check your name, email, message (at least 10 characters) and the privacy box.',
    sending: 'Sending… ', send: 'Send message ',
    error: 'The message could not be sent. Try again or email jose1911castro@gmail.com.',
  },
}[lang];

function riseText(el, { start = 'top 88%', delay = 0, immediate = false } = {}) {
  const split = SplitText.create(el, { type: 'lines,words', mask: 'lines', ...CL });
  const vars = { yPercent: 115, duration: 1.15, ease: 'expo.out', stagger: 0.05, delay };
  if (!immediate) vars.scrollTrigger = { trigger: el, start };
  gsap.from(split.words, vars);
}

function initMagnetic() {
  if (coarse) return;
  document.querySelectorAll('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect();
      xTo((e.clientX - (b.left + b.width / 2)) * 0.35);
      yTo((e.clientY - (b.top + b.height / 2)) * 0.35);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

function initLinks() {
  document.querySelectorAll('a[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.scrollTo(target, true, 'top top');
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

function initForm() {
  const form = document.querySelector('.form');
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const label = button.firstChild;
  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    status.textContent = ''; status.classList.remove('error');
    if (!form.checkValidity()) {
      status.classList.add('error');
      status.textContent = TEXT.invalid;
      form.querySelector(':invalid')?.focus();
      return;
    }
    sending = true; button.disabled = true; label.textContent = TEXT.sending;
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'send');
      window.gtag?.('event', 'generate_lead', { method: 'contact_form', language: lang });
      window.location.assign(document.body.dataset.sent);
    } catch (error) {
      status.classList.add('error');
      status.textContent = TEXT.error;
    } finally {
      sending = false; button.disabled = false; label.textContent = TEXT.send;
    }
  });
}

function initScroll() {
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // Portada: el título sube al cargar; el resto entra detrás
  if (!reduced) {
    riseText(document.querySelector('.l-title'), { immediate: true, delay: 0.15 });
    gsap.from('.l-in', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.55 });
    gsap.from('.l-seal', { scale: 0.4, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', delay: 0.7 });
    gsap.from('.nav > *', { y: -16, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, delay: 0.2 });
  }
  gsap.to('.l-title', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.l-hero', start: 'top top', end: 'bottom top', scrub: SCRUB } });
  gsap.to('.l-seal', { rotate: 220, ease: 'none', scrollTrigger: { trigger: '.l-hero', start: 'top top', end: 'bottom top', scrub: SCRUB } });

  gsap.utils.toArray('.tape-row').forEach((row) => {
    const dir = Number(row.dataset.dir);
    gsap.fromTo(row.firstElementChild,
      { xPercent: dir < 0 ? 0 : -28 },
      { xPercent: dir < 0 ? -28 : 0, ease: 'none', scrollTrigger: { trigger: '.tape', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
  });

  gsap.utils.toArray('.h-xl').forEach((el) => riseText(el));
  gsap.utils.toArray('.eyebrow:not(.l-in)').forEach((el) => {
    gsap.from(el, { x: -24, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  gsap.utils.toArray('.rule').forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // Servicios: el nombre sube letra a letra
  gsap.utils.toArray('.more-list li').forEach((li) => {
    const split = SplitText.create(li.querySelector('.more-name'), { type: 'words,chars', mask: 'words', ...CL });
    gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 90%' } })
      .from(split.chars, { yPercent: 115, duration: 0.9, ease: 'expo.out', stagger: 0.02 }, 0)
      .from(li.querySelectorAll('.more-n, .more-type, .more-go'), { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.25);
  });
  gsap.from('.l-support > *', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.l-support', start: 'top 90%' } });

  // Proceso: los tres pasos entran escalonados y girados
  gsap.from('.l-steps .panel', {
    y: 90, rotate: 4, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.14,
    scrollTrigger: { trigger: '.l-steps', start: 'top 82%' },
  });

  gsap.from('.l-faq-list details', { y: 34, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '.l-faq-list', start: 'top 86%' } });

  gsap.from('.l-client-links li', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.l-client-links', start: 'top 88%' } });
  gsap.fromTo('.ribbon span', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.free', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });

  gsap.from('.contact-side p, .contact-links li', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' } });
  gsap.from('.form > *', { y: 34, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '.form', start: 'top 85%' } });

  const nav = document.querySelector('.nav');
  gsap.utils.toArray('[data-nav]').forEach((sec) => {
    const theme = sec.dataset.nav;
    const apply = (self) => {
      if (self.isActive) nav.dataset.theme = theme;
      else if (nav.dataset.theme === theme) delete nav.dataset.theme;
    };
    ScrollTrigger.create({ trigger: sec, start: 'top 60px', end: 'bottom 60px', onToggle: apply, onRefresh: apply });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (!reduced && !coarse) {
  ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15, effects: false });
}
initMagnetic();
initLinks();
initForm();
initAnalytics();
const fontsReady = document.fonts?.ready ?? Promise.resolve();
Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(() => {
  document.body.classList.add('ready');
  initScroll();
  ScrollTrigger.refresh();
});
