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
if (import.meta.env.DEV) window.gsap = gsap;

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;
const PORTRAIT_SRC = '/v2/retrato.webp';
const ACCENT = '#ff3120';
const BONE = '#efe9dd';
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
// En táctil, los efectos ligados al scroll llevan algo de inercia para que no tiemblen
const SCRUB = coarse ? 0.6 : true;
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------
   Retrato: debajo de la foto hay una versión escrita en código.
   El cursor abre una lente que la deja ver.
------------------------------------------------------------------- */
const CODE = [
  'app.MapGet("/api/stock/{id}", async (int id, StockDb db) =>',
  'await db.Products.FindAsync(id) is Product p ? Results.Ok(p) : Results.NotFound());',
  'public record Alert(int ProductId, string Email, decimal MaxPrice);',
  'builder.Services.AddDbContext<StockDb>(o => o.UseSqlServer(connection));',
  'export function useAlerts(userId: string) {',
  'const [alerts, setAlerts] = useState<Alert[]>([]);',
  'useEffect(() => { fetch(`/api/alerts/${userId}`).then(r => r.json()).then(setAlerts); }, [userId]);',
  'return alerts; }',
  'SELECT p.Name, s.Price FROM Stock s JOIN Products p ON p.Id = s.ProductId WHERE s.Available = 1 ORDER BY s.Price;',
  'const reply = await claude.messages.create({ model, max_tokens: 1024, messages });',
  'if (!ModelState.IsValid) return BadRequest(ModelState);',
  'await hub.Clients.Group(tenantId).SendAsync("stockChanged", product);',
].join(' ');
function initPortrait() {
  const canvas = document.querySelector('.portrait-canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const alt = document.createElement('canvas');
  const fade = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, ready = false;

  // Tres puntos que se persiguen: juntos forman una mancha orgánica.
  const blob = [0, 1, 2].map(() => ({ x: 0, y: 0 }));
  const target = { x: 0, y: 0, r: 0 };
  let radius = 0;
  let userActive = false;
  let lastMove = 0;

  function buildAlt() {
    alt.width = canvas.width; alt.height = canvas.height;
    const a = alt.getContext('2d');
    a.clearRect(0, 0, alt.width, alt.height);
    // Silueta oscura
    a.drawImage(img, 0, 0, alt.width, alt.height);
    a.globalCompositeOperation = 'source-in';
    a.fillStyle = cssVar('--lens') || '#0a0908';
    a.fillRect(0, 0, alt.width, alt.height);
    a.globalCompositeOperation = 'source-over';

    // El código dibuja el retrato: cada letra toma el tono de la foto en ese punto.
    // Luces en hueso, medios tonos en rojo y sombras casi apagadas, para que se lean
    // la cabeza, las cejas, los ojos, la nariz y los labios.
    const fontPx = Math.max(6.5, Math.min(8, w / 125));
    const cellH = fontPx * 1.24;
    const font = (weight) => `${weight} ${fontPx * dpr}px "JetBrains Mono Variable", Consolas, monospace`;
    a.textBaseline = 'top';
    a.font = font(700);
    const cellW = a.measureText('M').width / dpr;
    const cols = Math.ceil(w / cellW), rows = Math.ceil(h / cellH);
    const tiny = document.createElement('canvas');
    tiny.width = cols; tiny.height = rows;
    const t = tiny.getContext('2d', { willReadFrequently: true });
    t.drawImage(img, 0, 0, cols, rows);
    const data = t.getImageData(0, 0, cols, rows).data;
    const n = cols * rows;
    const lum = new Float32Array(n);
    const inside = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      inside[i] = data[i * 4 + 3] > 120 ? 1 : 0;
      lum[i] = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
    }
    // Contraste local: lo que separa un labio o una ceja de la piel que lo rodea
    const R = Math.max(3, Math.round(cols / 38));
    const tone = new Float32Array(n);
    // La cabeza y la ropa se ecualizan por separado: si no, la sobrecamisa clara
    // se lleva todos los tonos altos y la cara queda plana.
    const split = Math.round(rows * 0.5);
    const band = Math.max(2, Math.round(rows * 0.05));
    const head = [], body = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (!inside[i]) continue;
        let sum = 0, count = 0;
        for (let yy = Math.max(0, y - R); yy <= Math.min(rows - 1, y + R); yy++) {
          for (let xx = Math.max(0, x - R); xx <= Math.min(cols - 1, x + R); xx++) {
            const k = yy * cols + xx;
            if (inside[k]) { sum += lum[k]; count++; }
          }
        }
        tone[i] = lum[i] + 1.5 * (lum[i] - sum / count);
        if (y < split + band) head.push(tone[i]);
        if (y >= split - band) body.push(tone[i]);
      }
    }
    head.sort((p, q) => p - q); body.sort((p, q) => p - q);
    // Posición del tono dentro de su zona (0 = lo más oscuro, 1 = lo más claro)
    const rank = (sorted, value) => {
      let lo = 0, hi = sorted.length;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (sorted[mid] < value) lo = mid + 1; else hi = mid; }
      return sorted.length ? lo / sorted.length : 0;
    };
    const level = (i, y) => {
      if (y < split - band) return rank(head, tone[i]);
      if (y >= split + band) return rank(body, tone[i]);
      const m = (y - (split - band)) / (band * 2);
      return rank(head, tone[i]) * (1 - m) + rank(body, tone[i]) * m;
    };
    const A = [255, 49, 32], B = [239, 233, 221];
    // Dos pasadas: trazo fino para las sombras, grueso para las luces
    for (const heavy of [false, true]) {
      a.font = font(heavy ? 700 : 400);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (!inside[i]) continue;
          const v = level(i, y);
          if ((v > 0.55) !== heavy) continue;
          const ch = CODE[i % CODE.length];
          if (ch === ' ') continue;
          if (v < 0.2) { a.fillStyle = ACCENT; a.globalAlpha = 0.1; }
          else if (v < 0.62) { a.fillStyle = ACCENT; a.globalAlpha = 0.28 + ((v - 0.2) / 0.42) * 0.72; }
          else {
            const m = Math.pow((v - 0.62) / 0.38, 0.8);
            a.fillStyle = `rgb(${Math.round(A[0] + (B[0] - A[0]) * m)}, ${Math.round(A[1] + (B[1] - A[1]) * m)}, ${Math.round(A[2] + (B[2] - A[2]) * m)})`;
            a.globalAlpha = 1;
          }
          a.fillText(ch, x * cellW * dpr, y * cellH * dpr);
        }
      }
    }
    a.globalAlpha = 1;
  }

  // Si la foto toca los bordes, los hombros se funden con el fondo; la cabeza queda intacta.
  function buildFade() {
    fade.width = canvas.width; fade.height = canvas.height;
    const f = fade.getContext('2d');
    const W = fade.width, H = fade.height;
    const side = f.createLinearGradient(0, 0, W, 0);
    side.addColorStop(0, 'rgba(0,0,0,0)'); side.addColorStop(0.035, 'rgba(0,0,0,.5)');
    side.addColorStop(0.1, '#000'); side.addColorStop(0.9, '#000');
    side.addColorStop(0.965, 'rgba(0,0,0,.5)'); side.addColorStop(1, 'rgba(0,0,0,0)');
    f.fillStyle = side; f.fillRect(0, 0, W, H);
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    w = box.width; h = box.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    if (ready) { buildAlt(); buildFade(); }
  }

  function draw(time) {
    if (!ready) return;
    // Sin ratón (o en móvil) la lente se pasea sola por la cara.
    if (!userActive || time - lastMove > 4000) {
      const s = time / 1000;
      const cycle = (s % 9) / 9;
      const on = cycle < 0.45 ? Math.sin((cycle / 0.45) * Math.PI) : 0;
      target.x = w * (0.5 + 0.09 * Math.sin(s * 0.9));
      target.y = h * (0.27 + 0.06 * Math.sin(s * 1.3 + 1));
      target.r = Math.min(w, h) * 0.2 * Math.min(1, on * 1.7);
    }
    const speeds = [0.2, 0.11, 0.065];
    blob.forEach((p, i) => {
      const to = i === 0 ? target : blob[i - 1];
      p.x += (to.x - p.x) * speeds[i];
      p.y += (to.y - p.y) * speeds[i];
    });
    radius += (target.r - radius) * 0.1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    if (radius > 1) {
      ctx.save();
      ctx.beginPath();
      blob.forEach((p, i) => {
        const r = radius * (1 - i * 0.2);
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      });
      ctx.clip();
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(alt, 0, 0, w, h);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(fade, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }

  canvas.addEventListener('pointermove', (e) => {
    const box = canvas.getBoundingClientRect();
    target.x = e.clientX - box.left; target.y = e.clientY - box.top;
    target.r = Math.min(w, h) * 0.25;
    userActive = true; lastMove = performance.now();
  });
  canvas.addEventListener('pointerleave', () => { target.r = 0; });

  img.onload = async () => {
    try { await document.fonts.load('700 12px "JetBrains Mono Variable"'); } catch (_) { /* seguimos con la de reserva */ }
    const stage = document.querySelector('.portrait');
    stage.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    ready = true;
    resize();
    blob.forEach((p) => { p.x = w / 2; p.y = h / 3; });
    let visible = true;
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);
    gsap.ticker.add((t) => { if (visible) draw(t * 1000); });
  };
  img.src = PORTRAIT_SRC;
  window.addEventListener('resize', resize);
}

/* ------------------------------------------------------------------
   Botones con imán
------------------------------------------------------------------- */
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

/* ------------------------------------------------------------------
   Reloj de Madrid
------------------------------------------------------------------- */
function initClock() {
  const el = document.querySelector('.clock');
  const fmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick(); setInterval(tick, 20000);
}

/* ------------------------------------------------------------------
   Entrada: cortina roja, el logo se dibuja y el nombre sube
------------------------------------------------------------------- */
function strokeSetup(paths) {
  paths.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
}

function intro() {
  const words = gsap.utils.toArray('.hero .word > span');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (reduced) return tl;

  const loaderPaths = gsap.utils.toArray('.mark--loader path');
  strokeSetup(loaderPaths);
  const counter = { v: 0 };
  const countEl = document.querySelector('.loader-count');

  // Sin scroll mientras dura la cortina
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.paused(true); else document.documentElement.style.overflow = 'hidden';
  const unlock = () => { if (smoother) smoother.paused(false); else document.documentElement.style.overflow = ''; };

  gsap.set(words, { yPercent: 115 });
  gsap.set('.portrait', { yPercent: 12, opacity: 0, scale: 1.06, transformOrigin: '50% 100%' });
  gsap.set('.fade-ui, .nav > *', { opacity: 0, y: 14 });
  gsap.set('.mark--loader .mark-dot', { scale: 0, transformOrigin: '50% 50%' });

  tl.to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = Math.round(counter.v); } }, 0)
    .to(loaderPaths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.25, ease: 'power3.inOut' }, 0.1)
    .to('.mark--loader .mark-dot', { scale: 1, duration: 0.35, ease: 'back.out(3)' }, 1.25)
    .to('.loader', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, 1.7)
    .to('.portrait', { yPercent: 0, opacity: 1, scale: 1, duration: 1.5 }, 2.05)
    .to(words, { yPercent: 0, duration: 1.25, stagger: 0.09 }, 2.15)
    .to('.nav > *, .fade-ui', { opacity: 1, y: 0, duration: 0.9, stagger: 0.06 }, 2.75)
    .set('.loader', { display: 'none' })
    .add(unlock, 2.6);
  return tl;
}

/* ------------------------------------------------------------------
   Utilidades de animación
------------------------------------------------------------------- */
function splitWords(el) {
  const out = [];
  const walk = (node, parent) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.textContent = part;
          parent.appendChild(s); out.push(s);
        });
      } else {
        const clone = child.cloneNode(false);
        parent.appendChild(clone);
        walk(child, clone);
      }
    });
  };
  const frag = document.createDocumentFragment();
  walk(el, frag);
  el.textContent = '';
  el.appendChild(frag);
  return out;
}

// Texto que sube desde detrás de una máscara, letra a letra o palabra a palabra
function riseText(el, { by = 'words', start = 'top 88%', stagger = 0.045, duration = 1.1, delay = 0 } = {}) {
  const split = SplitText.create(el, { type: by === 'chars' ? 'words,chars' : 'lines,words', mask: by === 'chars' ? 'words' : 'lines', linesClass: 'ln', wordsClass: 'wd', charsClass: 'ch' });
  const parts = by === 'chars' ? split.chars : split.words;
  gsap.from(parts, { yPercent: 115, duration, ease: 'expo.out', stagger, delay, scrollTrigger: { trigger: el, start } });
}

// Línea que se dibuja de izquierda a derecha
function drawRules(selector, start = 'top 92%') {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start } });
  });
}

function countUp(el, start = 'top 85%') {
  const end = Number(el.dataset.count); const prefix = el.dataset.prefix || '';
  const state = { v: 0 };
  gsap.to(state, {
    v: end, duration: 1.8, ease: 'power3.out',
    onUpdate: () => { el.textContent = prefix + Math.round(state.v); },
    scrollTrigger: { trigger: el, start, once: true },
  });
}

/* ------------------------------------------------------------------
   Scroll
------------------------------------------------------------------- */
function initScroll() {
  const mm = gsap.matchMedia();

  // Barra de progreso de lectura
  gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

  // La portada se abre: el nombre se separa y la foto se hunde
  const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: SCRUB } });
  hero.to('.hero .w-jose', { xPercent: -45, ease: 'none' }, 0)
      .to('.hero .w-maria', { xPercent: 45, ease: 'none' }, 0)
      .to('.hero .w-castro', { yPercent: 38, ease: 'none' }, 0)
      .to('.portrait', { yPercent: 14, scale: 1.07, ease: 'none' }, 0)
      .to('.hero-grid', { yPercent: 12, ease: 'none' }, 0)
      .to('.role, .stack, .corner, .hint', { opacity: 0, ease: 'none', duration: 0.35 }, 0);

  // Cinta: dos filas en sentidos opuestos y el logo dibujándose sobre la foto
  gsap.utils.toArray('.tape-row').forEach((row) => {
    const dir = Number(row.dataset.dir);
    gsap.fromTo(row.firstElementChild,
      { xPercent: dir < 0 ? 0 : -28 },
      { xPercent: dir < 0 ? -28 : 0, ease: 'none', scrollTrigger: { trigger: '.tape', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
  });
  const drawPaths = gsap.utils.toArray('.mark--draw path');
  strokeSetup(drawPaths);
  gsap.timeline({ scrollTrigger: { trigger: '.tape-card', start: 'top 78%', end: 'center 42%', scrub: SCRUB } })
    .fromTo('.tape-card', { scale: 0.72, clipPath: 'inset(12% 12% 12% 12%)' }, { scale: 1, clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
    .to(drawPaths, { strokeDashoffset: 0, ease: 'none', stagger: 0.35 }, 0.25);
  gsap.to('.tape-card img', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.tape', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });

  // Declaración: las palabras se encienden al leer
  const words = splitWords(document.querySelector('[data-words]'));
  gsap.to(words, {
    opacity: 1, ease: 'none', stagger: 0.08,
    scrollTrigger: { trigger: '.statement-text', start: 'top 82%', end: 'bottom 55%', scrub: SCRUB },
  });

  // Títulos grandes: suben palabra a palabra desde detrás de una máscara
  gsap.utils.toArray('.h-xl').forEach((el) => riseText(el));
  gsap.utils.toArray('.eyebrow').forEach((el) => {
    gsap.from(el, { x: -24, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });

  // Tipos de proyecto: la sección se queda fija y los paneles pasan de lado
  mm.add('(min-width: 761px)', () => {
    const track = document.querySelector('.work-track');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.work', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    // Cada panel se endereza al entrar por la derecha
    gsap.utils.toArray('.panel').forEach((panel) => {
      gsap.from(panel, {
        rotate: 5, yPercent: 10, scale: 0.92, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 105%', end: 'left 62%', scrub: true },
      });
    });
  });

  // Apps: cada una ocupa la pantalla; la captura se endereza y el nombre corre por detrás
  gsap.utils.toArray('.app').forEach((app) => {
    gsap.to(app.querySelector('.app-bgname span'), {
      xPercent: -22, ease: 'none',
      scrollTrigger: { trigger: app, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
    });
    gsap.fromTo(app.querySelector('.app-shot'),
      { scale: 0.8, rotate: -4, yPercent: 14 },
      { scale: 1, rotate: 0, yPercent: 0, ease: 'none', scrollTrigger: { trigger: app, start: 'top 90%', end: 'top 12%', scrub: SCRUB } });
    const phones = app.querySelector('.app-phones');
    if (phones) gsap.fromTo(phones, { yPercent: 26 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: app, start: 'top 70%', end: 'bottom top', scrub: SCRUB } });
    gsap.from(app.querySelectorAll('.app-copy > *'), {
      y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: app, start: 'top 45%' },
    });
  });
  gsap.utils.toArray('.app [data-count]').forEach((el) => countUp(el, 'top 80%'));
  mm.add('(min-width: 761px)', () => {
    // La segunda app se desliza por encima de la primera
    ScrollTrigger.create({ trigger: '.app--tcg', start: 'top top', end: 'bottom top', pin: true, pinSpacing: false });
  });

  // Más proyectos: la línea se dibuja, el número aparece y el nombre sube letra a letra
  drawRules('.more .rule');
  gsap.utils.toArray('.more-list li').forEach((li) => {
    const name = li.querySelector('.more-name');
    const split = SplitText.create(name, { type: 'words,chars', mask: 'words', linesClass: 'ln', wordsClass: 'wd', charsClass: 'ch' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 90%' } });
    tl.from(split.chars, { yPercent: 115, duration: 0.9, ease: 'expo.out', stagger: 0.022 }, 0)
      .from(li.querySelectorAll('.more-n, .more-type, .more-go'), { opacity: 0, y: 14, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.25);
  });
  // Las filas se desplazan un poco en horizontal mientras bajas, alternando el sentido
  mm.add('(min-width: 761px)', () => {
    gsap.utils.toArray('.more-list li').forEach((li, i) => {
      gsap.fromTo(li.querySelector('a'), { x: i % 2 ? 28 : -28 }, { x: 0, ease: 'none', scrollTrigger: { trigger: li, start: 'top bottom', end: 'top 45%', scrub: true } });
    });
  });

  // Experiencia: la línea del tiempo crece con el scroll y cada etapa entra por piezas
  gsap.from('.exp-line i', { scaleY: 0, transformOrigin: '50% 0', ease: 'none', scrollTrigger: { trigger: '.exp-rows', start: 'top 70%', end: 'bottom 60%', scrub: SCRUB } });
  drawRules('.exp .rule');
  gsap.utils.toArray('.exp-row').forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } });
    const years = SplitText.create(row.querySelector('.exp-years'), { type: 'words', mask: 'words', linesClass: 'ln', wordsClass: 'wd', charsClass: 'ch' });
    tl.from(row.querySelector('.exp-dot'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0)
      .from(row.querySelector('.exp-logo'), { scale: 0.5, rotate: -12, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, 0)
      .from(years.words, { yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.09 }, 0.1)
      .from(row.querySelectorAll('.exp-when .mono, .exp-what h3, .exp-what > p'), { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.2)
      .from(row.querySelectorAll('.exp-list li'), { x: -30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 }, 0.4)
      .from(row.querySelectorAll('.exp-stats li'), { y: 36, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.6)
      .from(row.querySelectorAll('.tags li'), { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.03 }, 0.75);
  });
  gsap.utils.toArray('.exp [data-count]').forEach((el) => countUp(el, 'top 88%'));
  gsap.from('.exp .btn', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.exp .btn', start: 'top 94%' } });

  // IA: el terminal se escribe solo y las tarjetas se despliegan
  initTerminal();
  drawRules('.ai .rule');
  gsap.utils.toArray('.ai-grid article').forEach((card, i) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 86%' } });
    tl.from(card, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.out', delay: (i % 2) * 0.12 }, 0)
      .from(card.querySelectorAll('.mono, h3, p'), { y: 34, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.15 + (i % 2) * 0.12);
  });
  gsap.utils.toArray('.stack-table div').forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 92%' } });
    tl.from(row, { '--line': 0, duration: 1.1, ease: 'expo.out' }, 0)
      .from(row.children, { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.05);
  });

  // Freelance: la cinta de clientes corre con el scroll y el botón aparece con rebote
  gsap.fromTo('.ribbon span', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.free', start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
  gsap.from('.free-row > *', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.free-row', start: 'top 88%' } });

  // Contacto: «¿Hablamos?» sube letra a letra; enlaces y campos entran en cascada
  riseText(document.querySelector('.contact-big'), { by: 'chars', start: 'top 85%', stagger: 0.05, duration: 1.2 });
  gsap.from('.contact-side p, .contact-links li', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.contact-grid', start: 'top 85%' } });
  gsap.from('.form > *', { y: 34, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '.form', start: 'top 85%' } });
  gsap.to('.foot .seal', { rotate: 360, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } });

  // La navegación cambia de color según la sección que tiene debajo
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

/* ------------------------------------------------------------------
   Terminal de la sección de IA: se escribe línea a línea al llegar
------------------------------------------------------------------- */
function initTerminal() {
  const term = document.querySelector('.term-body');
  if (!term) return;
  const lines = gsap.utils.toArray('.term-body p');
  const texts = lines.map((p) => p.textContent);
  if (reduced) return;
  lines.forEach((p) => { p.textContent = ''; p.style.visibility = 'hidden'; });
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.term', start: 'top 75%', once: true } });
  lines.forEach((p, i) => {
    const state = { n: 0 };
    const typed = p.classList.contains('cmd');
    tl.set(p, { visibility: 'visible' })
      .to(state, {
        n: texts[i].length, duration: typed ? texts[i].length * 0.028 : 0.25, ease: 'none',
        onUpdate: () => { p.textContent = texts[i].slice(0, Math.round(state.n)); },
      })
      .to({}, { duration: typed ? 0.35 : 0.3 });
  });
  tl.add(() => term.classList.add('done'));
}

/* ------------------------------------------------------------------
   Lista de proyectos: una miniatura sigue al cursor
------------------------------------------------------------------- */
function initMore() {
  const section = document.querySelector('.more');
  const preview = section.querySelector('.more-preview');
  if (coarse) { preview.remove(); return; }
  const img = preview.querySelector('img');
  const letter = preview.querySelector('b');
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3.out' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3.out' });
  const rTo = gsap.quickTo(preview, 'rotate', { duration: 0.6, ease: 'power3.out' });
  gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 });
  let lastX = 0;
  section.addEventListener('pointermove', (e) => {
    const b = section.getBoundingClientRect();
    xTo(e.clientX - b.left + 190); yTo(e.clientY - b.top);
    rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6)); lastX = e.clientX;
  });
  section.querySelectorAll('.more-list a').forEach((a) => {
    a.addEventListener('pointerenter', () => {
      const src = a.dataset.img;
      img.style.display = src ? 'block' : 'none';
      if (src) img.src = src;
      letter.textContent = src ? '' : a.querySelector('.more-name').textContent.trim()[0];
      gsap.to(preview, { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
    });
    a.addEventListener('pointerleave', () => {
      gsap.to(preview, { scale: 0.5, opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
    });
  });
}

/* ------------------------------------------------------------------
   Menú a pantalla completa y enlaces internos
------------------------------------------------------------------- */
function scrollToTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(target, true, 'top top');
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

function initMenu() {
  const button = document.querySelector('.menu');
  const overlay = document.querySelector('.overlay');
  const items = overlay.querySelectorAll('li');
  let open = false;
  gsap.set(overlay, { clipPath: 'inset(0% 0% 100% 0%)', visibility: 'hidden' });
  const set = (next) => {
    open = next;
    document.body.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    overlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      gsap.set(overlay, { visibility: 'visible' });
      gsap.to(overlay, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' });
      gsap.fromTo(items, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.3 });
    } else {
      gsap.to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(overlay, { visibility: 'hidden' }) });
    }
  };
  button.addEventListener('click', () => set(!open));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
  document.querySelectorAll('a[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (open) set(false);
      scrollToTarget(a.getAttribute('href'));
    });
  });
}

/* ------------------------------------------------------------------
   Formulario: mismo envío que la web actual (/api/contact)
------------------------------------------------------------------- */
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
      status.textContent = 'Revisa el nombre, el email, el mensaje (mínimo 10 caracteres) y la casilla de privacidad.';
      form.querySelector(':invalid')?.focus();
      return;
    }
    sending = true; button.disabled = true; label.textContent = 'Enviando… ';
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'send');
      window.gtag?.('event', 'generate_lead', { method: 'contact_form', language: 'es' });
      window.location.assign('/contacto-enviado');
    } catch (error) {
      status.classList.add('error');
      status.textContent = 'No se pudo enviar. Inténtalo de nuevo o escríbeme a jose1911castro@gmail.com.';
    } finally {
      sending = false; button.disabled = false; label.textContent = 'Enviar mensaje ';
    }
  });
}

/* ------------------------------------------------------------------
   Arranque
------------------------------------------------------------------- */
if (!reduced && !coarse) {
  ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15, effects: false });
}
initPortrait();
initMagnetic();
initClock();
initMenu();
initForm();
initAnalytics();
intro();
// Los textos se parten en líneas y letras: hace falta que las fuentes ya estén cargadas
const fontsReady = document.fonts?.ready ?? Promise.resolve();
Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(() => {
  initScroll();
  initMore();
  ScrollTrigger.refresh();
});
