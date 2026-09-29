import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';
import Analytics from './Analytics.jsx';
import ContactForm from './ContactForm.jsx';

const EMAIL = 'jose1911castro@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/josemcastrop/';

const content = {
  es: {
    metaTitle: 'Desarrollador Web Freelance en Alcobendas | José María Castro',
    metaDescription: 'José María Castro, desarrollador web freelance y Senior Full Stack en Alcobendas. Páginas web profesionales, rápidas y con presupuesto ajustado para negocios y autónomos.',
    skip: 'Saltar al contenido', menu: 'Abrir menú', close: 'Cerrar menú',
    nav: [['Proyectos', 'proyectos'], ['Sobre mí', 'sobre-mi'], ['Tecnologías', 'stack'], ['Contacto', 'contacto']],
    role: 'Full Stack Engineer', stackLine: '.NET / React / Node / Next.js',
    heroLine: 'Construyo producto, conecto sistemas y automatizo lo repetitivo.',
    projectsCta: 'Ver proyectos', journeyCta: 'Conocer mi recorrido',
    aboutTitle: 'Código, producto y una curiosidad bastante difícil de apagar.',
    aboutBody: 'Soy Senior Full Stack Developer en Alcobendas, Madrid, especializado en .NET, C# y React. Llevo siete años convirtiendo sistemas complejos en software claro, conectando código, personas y producto.',
    traits: ['Curiosidad', 'Criterio', 'Construcción'],
    workTitle: 'Tecnología real para un impacto tangible.', workHint: 'Explora cada proyecto', openCase: 'Visitar proyecto',
    projects: [
      { name: 'Kron Analytics', domain: 'Analítica e IoT', line: 'Datos físicos. Decisiones operativas.', detail: 'Plataforma para convertir señales de cámaras y dispositivos en información operativa en tiempo real.', href: 'https://kronanalytics.com/', theme: 'network' },
      { name: 'Laboralfy', domain: 'Automatización', line: 'Trámites complejos, resueltos.', detail: 'Automatización con Playwright, validación de datos y gestión de excepciones para procesos laborales.', theme: 'flow' },
      { name: 'Automix', domain: 'Dispositivos y pagos', line: 'Software que sale de la pantalla.', detail: 'Aplicación de dispositivo, backend, panel operativo e integración con TPV para eventos.', theme: 'device' },
      { name: 'BCN Vision', domain: 'Visión industrial', line: 'Hacer usable la visión artificial.', detail: 'Herramientas para definir zonas de inspección y operar procesos visuales especializados.', theme: 'vision' },
    ],
    expTitle: 'De mantener módulos a construir producto completo.',
    babel: { company: 'BABEL', date: '2019 - 2022', text: 'Crecí desde tareas júnior hasta asumir la responsabilidad del módulo CAE de OHS Solutions.', steps: ['Software empresarial', 'Responsabilidad', 'Full stack'], responsibilities: ['Desarrollo y evolución de software empresarial con .NET, C# y SQL Server.', 'Responsabilidad funcional y técnica del módulo de Coordinación de Actividades Empresariales (CAE).', 'Análisis de incidencias, mantenimiento evolutivo e integración dentro de una plataforma de prevención consolidada.'], technologies: ['C#', '.NET', 'SQL Server', 'TFS'] },
    q2b: { company: 'Q2B Studio', date: '2022 - actualidad', text: 'Trabajo de extremo a extremo: requisitos, cliente, decisiones técnicas, desarrollo, integraciones y evolución.', steps: ['Producto', 'Cliente', 'Integraciones', 'IA asistida'], responsibilities: ['Toma de requisitos y comunicación directa con cliente para convertir necesidades en producto.', 'Diseño y desarrollo full stack de aplicaciones, paneles operativos, APIs e integraciones con servicios y dispositivos.', 'Decisiones técnicas, despliegue, mantenimiento evolutivo y automatización de procesos con herramientas de IA.'], technologies: ['.NET', 'React', 'Next.js', 'Node.js', 'Azure', 'Playwright', 'n8n'] },
    aiTitle: 'Más criterio. Menos trabajo repetitivo.',
    aiBody: 'Uso Cursor, agentes y automatizaciones para dedicar más tiempo a arquitectura, producto, decisiones y problemas difíciles.',
    aiStages: ['Filtra', 'Organiza', 'Automatiza'], aiFocus: ['Arquitectura', 'Producto', 'Decisiones'],
    stackTitle: 'Una base sólida. Un stack que evoluciona.', stackBody: 'Tecnología práctica para resolver hoy y construir lo que viene mañana.',
    stackGroups: [['Core', 'C#', '.NET', 'SQL Server', 'REST APIs'], ['Web', 'React', 'Next.js', 'Node.js', 'JavaScript'], ['Delivery', 'Azure', 'Git', 'TFS'], ['AI + automation', 'Cursor', 'Agentes', 'n8n', 'Playwright']],
    breadthTitle: 'Distintos sectores. La misma obsesión por resolver bien.',
    extraProjects: [['Daruma', 'e-commerce'], ['SendTheJoy', 'e-commerce'], ['Nouretol', 'APIs'], ['Kumoba', 'real estate'], ['Oritzó', 'hospitality'], ['Nomad Burger', 'hospitality'], ['Wild Rumble', 'gaming']],
    contactTitle: '¿Construimos tu próxima web?', contactBody: 'Cuéntame tu idea. Te respondo yo, sin intermediarios.', contactCta: 'Enviar mensaje', serviceLink: 'Desarrollo web para negocios en Alcobendas',
    footer: 'Full Stack Engineer', availability: 'Disponible para nuevas oportunidades', portraitAlt: 'Retrato profesional de José María Castro',
  },
  en: {
    metaTitle: 'José María Castro | Senior Full Stack .NET Developer, Madrid',
    metaDescription: 'José María Castro, Senior Full Stack Developer based in Alcobendas, Madrid. .NET, C#, React and Node.js development, software integrations and automation.',
    skip: 'Skip to content', menu: 'Open menu', close: 'Close menu',
    nav: [['Projects', 'proyectos'], ['About', 'sobre-mi'], ['Technologies', 'stack'], ['Contact', 'contacto']],
    role: 'Full Stack Engineer', stackLine: '.NET / React / Node / Next.js',
    heroLine: 'I build products, connect systems and automate repetitive work.',
    projectsCta: 'View projects', journeyCta: 'See my journey',
    aboutTitle: 'Code, product and a curiosity that is quite hard to switch off.',
    aboutBody: 'I am a Senior Full Stack Developer based in Alcobendas, Madrid, specialising in .NET, C# and React. For seven years, I have turned complex systems into clear software, connecting code, people and product.',
    traits: ['Curiosity', 'Judgement', 'Craft'],
    workTitle: 'Real technology with tangible impact.', workHint: 'Explore each project', openCase: 'Visit project',
    projects: [
      { name: 'Kron Analytics', domain: 'Analytics and IoT', line: 'Physical data. Operational decisions.', detail: 'A platform that turns camera and device signals into real-time operational insight.', href: 'https://kronanalytics.com/', theme: 'network' },
      { name: 'Laboralfy', domain: 'Automation', line: 'Complex paperwork, resolved.', detail: 'Playwright automation, data validation and exception handling for employment processes.', theme: 'flow' },
      { name: 'Automix', domain: 'Devices and payments', line: 'Software that leaves the screen.', detail: 'Device app, backend, operations panel and payment terminal integration for events.', theme: 'device' },
      { name: 'BCN Vision', domain: 'Industrial vision', line: 'Making computer vision usable.', detail: 'Tools for defining inspection zones and operating specialised visual processes.', theme: 'vision' },
    ],
    expTitle: 'From maintaining modules to building complete products.',
    babel: { company: 'BABEL', date: '2019 - 2022', text: 'I grew from junior tasks to owning the contractor coordination module in OHS Solutions.', steps: ['Enterprise software', 'Ownership', 'Full stack'], responsibilities: ['Developed and evolved enterprise software with .NET, C# and SQL Server.', 'Took functional and technical ownership of the Contractor Activity Coordination (CAE) module.', 'Analysed incidents, delivered product improvements and integrated them into an established prevention platform.'], technologies: ['C#', '.NET', 'SQL Server', 'TFS'] },
    q2b: { company: 'Q2B Studio', date: '2022 - present', text: 'I work end to end: requirements, client conversations, technical decisions, development, integrations and evolution.', steps: ['Product', 'Client', 'Integrations', 'AI-assisted'], responsibilities: ['Turn client conversations and requirements into concrete product decisions.', 'Design and build full-stack applications, operational dashboards, APIs and integrations with services and devices.', 'Own technical decisions, delivery, product evolution and process automation with AI-assisted tools.'], technologies: ['.NET', 'React', 'Next.js', 'Node.js', 'Azure', 'Playwright', 'n8n'] },
    aiTitle: 'More judgement. Less repetitive work.',
    aiBody: 'I use Cursor, agents and automation to spend more time on architecture, product, decisions and hard problems.',
    aiStages: ['Filter', 'Organise', 'Automate'], aiFocus: ['Architecture', 'Product', 'Decisions'],
    stackTitle: 'A solid foundation. A stack that evolves.', stackBody: 'Practical technology for solving today and building what comes next.',
    stackGroups: [['Core', 'C#', '.NET', 'SQL Server', 'REST APIs'], ['Web', 'React', 'Next.js', 'Node.js', 'JavaScript'], ['Delivery', 'Azure', 'Git', 'TFS'], ['AI + automation', 'Cursor', 'Agents', 'n8n', 'Playwright']],
    breadthTitle: 'Different sectors. The same obsession with solving things well.',
    extraProjects: [['Daruma', 'e-commerce'], ['SendTheJoy', 'e-commerce'], ['Nouretol', 'APIs'], ['Kumoba', 'real estate'], ['Oritzó', 'hospitality'], ['Nomad Burger', 'hospitality'], ['Wild Rumble', 'gaming']],
    contactTitle: 'Shall we build your next website?', contactBody: 'Share your idea. I reply directly, without intermediaries.', contactCta: 'Send message', serviceLink: 'Web development for businesses in Alcobendas',
    footer: 'Full Stack Engineer', availability: 'Open to new opportunities', portraitAlt: 'Professional portrait of José María Castro',
  },
};

function Logo() {
  return <svg className="logo-mark" viewBox="0 0 160 180" aria-hidden="true"><path className="logo-piece logo-white" fill="#f1f0ea" d="M7 89 66 53 66 85 34 104 34 140 7 159Z"/><path className="logo-piece logo-top" fill="#6f9bc7" d="M66 8 154 58 154 107 124 125 124 76 66 43Z"/><path className="logo-piece logo-bottom" fill="#6f9bc7" d="M66 94 96 76 96 121 150 154 119 172 66 136Z"/></svg>;
}
function Artwork({ name, priority = false, alt = '' }) {
  return <><img className="artwork" src={`/art/${name}.webp`} alt={alt} width="1672" height="941" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"/><span className="scene-shade" aria-hidden="true"/></>;
}
function SplitTitle({ text, className = '' }) {
  const split = text.indexOf('. ');
  return <h2 className={className}>{split < 0 ? text : <>{text.slice(0, split + 1)}<br/><span>{text.slice(split + 2)}</span></>}</h2>;
}
function DetailDialog({ detail, close, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!detail) return;
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, [detail]);
  if (!detail) return null;
  return <dialog className="detail-dialog" ref={ref} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <button className="dialog-close" onClick={close} aria-label={lang === 'es' ? 'Cerrar detalle' : 'Close details'}>×</button>
    <p className="eyebrow">{detail.domain || detail.date}</p><h2>{detail.name || detail.company}</h2><p>{detail.detail || detail.text}</p>
    {detail.responsibilities && <div className="dialog-responsibilities"><h3>{lang === 'es' ? 'Responsabilidades' : 'Responsibilities'}</h3><ul>{detail.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>}
    {detail.technologies && <div className="dialog-technologies" aria-label={lang === 'es' ? 'Tecnologías' : 'Technologies'}>{detail.technologies.map(item => <span key={item}>{item}</span>)}</div>}
    {!detail.responsibilities && detail.steps && <ul>{detail.steps.map(step => <li key={step}>{step}</li>)}</ul>}
    {detail.href && <a className="primary-action" href={detail.href} target="_blank" rel="noreferrer">{lang === 'es' ? 'Visitar proyecto' : 'Visit project'} <span>↗</span></a>}
  </dialog>;
}
export default function Portfolio() {
  const [lang, setLang] = useState(() => {
    try { const saved = localStorage.getItem('portfolio-language'); if (saved === 'es' || saved === 'en') return saved; } catch {}
    return 'es';
  });
  const [menu, setMenu] = useState(false);
  const [detail, setDetail] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const navigation = useRef(null);
  const root = useRef(null);
  const t = content[lang];
  const es = lang === 'es';
  const pageIds = ['inicio', 'sobre-mi', 'proyectos', 'experiencia', 'stack', 'sectores', 'contacto'];
  const goToPage = (event, id) => {
    event.preventDefault();
    const index = pageIds.indexOf(id);
    if (index < 0) return;
    setMenu(false);
    navigation.current?.(index);
  };
  const changeLanguage = next => {
    if (next === lang) return;
    const update = () => flushSync(() => setLang(next));
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update);
    else update();
  };
  useEffect(() => {
    document.documentElement.lang = lang; document.title = t.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription);
    try { localStorage.setItem('portfolio-language', lang); } catch {}
  }, [lang, t]);
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  useEffect(() => {
    const scroller = root.current;
    const pages = [...scroller.querySelectorAll('.scene')];
    const desktop = window.matchMedia('(min-width: 761px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = Math.max(0, pageIds.indexOf(location.hash.slice(1)));
    if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
    let busy = false, wheelSum = 0, lastWheel = 0, unlockAt = 0;
    let transition;
    // Animate the absolutely positioned labels themselves: transforming their
    // static parent changes their containing block until clearProps runs.
    const revealSelector = '.hero-name span, .hero-copy > *, .hero-service-cta, .about-copy > *, .projects-heading > *, .project-text > *, .experience-title, .career-heading, .career-label, .mobile-career > *, .stack-copy > *, .stack-legend > div, .breadth-title, .breadth-description, .orbit-project, .contact-copy > *, .contact-form > *, .contact footer';
    const reveals = new Map();
    const reveal = (page, direction = 1, delay = 0) => {
      reveals.get(page)?.kill();
      const elements = page.querySelectorAll(revealSelector);
      gsap.set(elements, { clearProps: 'transform,opacity' });
      if (reduced.matches) return;
      reveals.set(page, gsap.fromTo(elements, { y: direction * 38, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: { each: .12, amount: Math.min(.6, elements.length * .12) }, delay, ease: 'power3.out', clearProps: 'transform,opacity' }));
    };
    const expose = index => pages.forEach((page, i) => {
      page.inert = i !== index;
      page.setAttribute('aria-hidden', String(i !== index));
    });
    const setup = () => {
      transition?.kill();
      gsap.killTweensOf(pages);
      busy = false;
      gsap.set(pages, { clearProps: 'all' });
      pages.forEach(page => { page.inert = false; page.removeAttribute('aria-hidden'); });
      if (desktop.matches) {
        scroller.scrollTop = 0;
        gsap.set(pages, { autoAlpha: 0, zIndex: 0, yPercent: 0, scale: 1, pointerEvents: 'none' });
        gsap.set(pages[current], { autoAlpha: 1, zIndex: 1, pointerEvents: 'auto' });
        expose(current);
      } else scroller.scrollTop = current * scroller.clientHeight;
      setActivePage(current);
      reveal(pages[current], 1, .12);
    };
    const navigate = index => {
      if (index < 0 || index >= pages.length || index === current || busy) return;
      if (!desktop.matches) {
        scroller.scrollTo({ top: index * scroller.clientHeight, behavior: reduced.matches ? 'instant' : 'smooth' });
        return;
      }
      const outgoing = pages[current], incoming = pages[index], direction = index > current ? 1 : -1;
      busy = true; wheelSum = 0;
      expose(index);
      gsap.set(incoming, { autoAlpha: 1, yPercent: reduced.matches ? 0 : direction * 100, scale: 1, zIndex: 2, pointerEvents: 'auto' });
      gsap.set(outgoing, { zIndex: 1, pointerEvents: 'none' });
      current = index; setActivePage(index);
      transition = gsap.timeline({ defaults: { duration: reduced.matches ? 0 : 1, ease: 'power2.inOut' }, onComplete: () => {
        gsap.set(outgoing, { autoAlpha: 0, yPercent: 0, scale: 1, zIndex: 0 });
        gsap.set(incoming, { yPercent: 0, scale: 1, zIndex: 1 });
        busy = false; unlockAt = performance.now() + 90; wheelSum = 0;
      }});
      transition.to(incoming, { yPercent: 0 }, 0).to(outgoing, { yPercent: -direction * 12, scale: .96, opacity: .45 }, 0);
      // Let the incoming page become visible before revealing its content.
      reveal(incoming, direction, .78);
    };
    navigation.current = navigate;
    const wheel = event => {
      if (!desktop.matches || event.ctrlKey || document.querySelector('dialog[open]') || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target.closest('textarea')) return;
      const inner = event.target.closest('.contact-layout');
      if (inner && ((event.deltaY > 0 && inner.scrollTop + inner.clientHeight < inner.scrollHeight - 1) || (event.deltaY < 0 && inner.scrollTop > 0))) return;
      event.preventDefault();
      const now = performance.now();
      if (busy || now < unlockAt) { wheelSum = 0; lastWheel = now; return; }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1);
      if (now - lastWheel > 260 || Math.sign(delta) !== Math.sign(wheelSum)) wheelSum = 0;
      wheelSum += delta; lastWheel = now;
      if (Math.abs(wheelSum) >= 75) { navigate(current + Math.sign(wheelSum)); wheelSum = 0; }
    };
    const keyboard = event => {
      if (!desktop.matches || document.querySelector('dialog[open]') || event.target.closest('input,textarea,select,[contenteditable]')) return;
      const direction = ['ArrowDown','PageDown'].includes(event.key) ? 1 : ['ArrowUp','PageUp'].includes(event.key) ? -1 : 0;
      if (direction) { event.preventDefault(); navigate(current + direction); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); navigate(event.key === 'Home' ? 0 : pages.length - 1); }
    };
    const scroll = () => { if (!desktop.matches) { const next = Math.min(pages.length - 1, Math.round(scroller.scrollTop / scroller.clientHeight)); if (next !== current) { reveal(pages[next], next > current ? 1 : -1); current = next; setActivePage(current); } } };
    setup();
    scroller.addEventListener('wheel', wheel, { passive: false });
    scroller.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('keydown', keyboard);
    desktop.addEventListener('change', setup);
    return () => {
      transition?.kill(); gsap.killTweensOf(pages); gsap.set(pages, { clearProps: 'all' });
      reveals.forEach(animation => animation.kill());
      gsap.set(scroller.querySelectorAll(revealSelector), { clearProps: 'transform,opacity' });
      pages.forEach(page => { page.inert = false; page.removeAttribute('aria-hidden'); });
      scroller.removeEventListener('wheel', wheel); scroller.removeEventListener('scroll', scroll);
      window.removeEventListener('keydown', keyboard); desktop.removeEventListener('change', setup);
      navigation.current = null;
    };
  }, []);
  const labels = es ? {
    ideas: 'Ideas / Sistemas / Resultados', human: 'Sistemas más humanos para un mundo más eficiente',
    scale: 'Soluciones que escalan', code: 'Código / Producto / Personas', connect: 'Conecta / Integra / Automatiza',
    selected: 'Proyectos seleccionados', case: 'Abrir caso', real: 'Ideas que operan en el mundo real',
    experience: 'Experiencia', purpose: 'Mismo propósito / Mayor impacto', from: 'De mantener módulos', to: 'a construir producto completo.',
    assisted: 'Desarrollo asistido', decide: 'Tú decides', amplify: 'Herramientas que amplifican lo importante',
    future: 'Tecnología para lo que viene', discipline: 'Disciplina / Tecnología / Impacto',
    breadth: 'Marcas, productos y experiencias en contextos distintos. El mismo principio: entender, simplificar, resolver y hacer que funcione.',
    contact: 'Ideas + Software + Personas', better: 'Mejores productos / Una vida más humana', footer: 'Software para resultados reales'
  } : {
    ideas: 'Ideas / Systems / Results', human: 'More human systems for a more efficient world',
    scale: 'Solutions that scale', code: 'Code / Product / People', connect: 'Connect / Integrate / Automate',
    selected: 'Selected projects', case: 'Explore project', real: 'Ideas that work in the real world',
    experience: 'Experience', purpose: 'Same purpose / Greater impact', from: 'From maintaining modules', to: 'to building complete products.',
    assisted: 'AI-assisted development', decide: 'You decide', amplify: 'Tools that amplify what matters',
    future: 'Technology for what comes next', discipline: 'Discipline / Technology / Impact',
    breadth: 'Brands, products and experiences in different contexts. The same principle: understand, simplify, solve and make it work.',
    contact: 'Ideas + Software + People', better: 'Better products / A more human life', footer: 'Software for real results'
  };
  const caption = value => value.split(' / ').map((line, index) => <React.Fragment key={line}>{index > 0 && <br/>}{line}</React.Fragment>);
  const projectLines = es ? ['Datos físicos. Decisiones operativas.', 'Automatización para equipos que avanzan.', 'Dispositivos conectados. Pagos sin fricción.', 'Visión industrial para un mundo más eficiente.'] : ['Physical data. Operational decisions.', 'Automation for teams moving forward.', 'Connected devices. Frictionless payments.', 'Industrial vision for a more efficient world.'];
  return <div className="site" ref={root} onClick={event => { const link = event.target.closest('a[href^="#"]'); if (link && pageIds.includes(link.hash.slice(1))) goToPage(event, link.hash.slice(1)); }}>
    <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>{t.skip}</a>
    <Analytics lang={lang} section={pageIds[activePage]}/>
    <main id="main" tabIndex={-1}>
      <section className="scene hero" id="inicio">
        <Artwork name="hero" priority/>
        <header className="nav-wrap">
          <a className="brand-link" href="#inicio" aria-label="José María Castro"><Logo/></a>
          <nav className={menu ? 'nav-links open' : 'nav-links'} id="navigation" aria-label={es ? 'Navegación principal' : 'Main navigation'}>{t.nav.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}</nav>
          <div className="language-switch" role="group" aria-label={es ? 'Idioma' : 'Language'}><button lang="es" aria-label="Español" aria-pressed={es} onClick={() => changeLanguage('es')}>ES</button><button lang="en" aria-label="English" aria-pressed={!es} onClick={() => changeLanguage('en')}>EN</button></div>
          <button className="menu-toggle" aria-controls="navigation" aria-expanded={menu} aria-label={menu ? t.close : t.menu} onClick={() => setMenu(!menu)}>{menu ? '×' : '☰'}</button>
          <span className="hero-motto micro">{caption(labels.ideas)}</span>
        </header>
        <div className="hero-title-plane"><h1 className="hero-name" translate="no"><span>José María</span> <span>Castro</span></h1></div>
        <div className="hero-copy"><p className="hero-role">{t.role}</p><p className="hero-stack" translate="no">{t.stackLine}</p><span className="blue-rule"/><p className="hero-description">{t.heroLine}</p><div className="hero-actions"><a className="primary-action" href="#proyectos">{t.projectsCta}<span>→</span></a><a className="text-action" href="#experiencia">{t.journeyCta}</a></div></div>
        <a className="hero-service-cta" href={es ? '/desarrollo-web-alcobendas.html' : '/en/web-developer-alcobendas.html'}>{es ? '¿Necesitas una web?' : 'Need a website?'} <span aria-hidden="true">↗</span></a>
        <span className="hero-engraving micro" aria-hidden="true">{caption(labels.connect)}</span><p className="hero-side micro">{labels.human}</p><p className="corner bottom-left micro">{labels.scale}</p><p className="corner bottom-right micro">{caption(labels.code)}</p>
      </section>
      <section className="scene about" id="sobre-mi"><Artwork name="about" alt={t.portraitAlt}/><div className="about-copy" data-reveal><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p><div className="trait-row">{t.traits.map(x => <span key={x}>{x}</span>)}</div></div></section>
      <section className="scene projects" id="proyectos">
        <Artwork name="projects"/><div className="section-bar"><span>José María Castro</span><a href="#sobre-mi">{t.nav[1][0]}</a><a href="#contacto">{t.nav[3][0]}</a></div>
        <div className="projects-heading"><p className="eyebrow">{labels.selected}</p><h2>{t.workTitle}</h2></div><p className="projects-note micro">{labels.real}</p>
        <div className={`project-panels ${activeProject !== null ? 'has-active' : ''}`} onPointerLeave={() => setActiveProject(null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveProject(null); }}>{t.projects.map((p,i) => <article className={`project-panel project-${i} ${activeProject === i ? 'is-active' : ''}`} key={p.name} onPointerEnter={() => setActiveProject(i)} onFocus={() => setActiveProject(i)}><svg className="project-photo" viewBox={['0 55 704 886','704 55 314 886','1018 55 326 886','1344 55 328 886'][i]} preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="/art/projects.webp" width="1672" height="941"/></svg><button className="project-open" onClick={() => setDetail(p)} aria-label={`${labels.case}: ${p.name}`}><span className="project-text"><strong>{p.name}</strong><span>{projectLines[i]}</span><span className="case-link">{labels.case}<i>⟶</i></span></span></button></article>)}</div>
      </section>
      <section className="scene experience" id="experiencia">
        <Artwork name="experience"/><p className="corner top-left micro">{labels.experience}</p><p className="corner top-right micro">{caption(labels.purpose)}</p>
        <h2 className="experience-title" data-reveal>{labels.from}<br/><span>{labels.to}</span></h2>
        <button className="career-heading babel-heading" onClick={() => setDetail(t.babel)}><img className="career-logo career-logo-babel" src="/logos/babel.svg" alt="BABEL"/><span>{t.babel.date}</span></button><button className="career-heading q2b-heading" onClick={() => setDetail(t.q2b)}><img className="career-logo career-logo-q2b" src="/logos/q2b.png" alt="Q2B Studio"/><span>{t.q2b.date}</span></button>
        <div className="career-labels">{[...t.babel.steps,...t.q2b.steps].map((x,i) => <span className={`career-label career-label-${i}`} key={x}>{x}</span>)}</div><p className="career-base micro">{es ? 'Base sólida para ir más lejos' : 'A solid base to go further'}</p>
        <div className="mobile-career">{[t.babel,t.q2b].map((job,i) => <article key={job.company}><span className="career-number">0{i + 1}</span><p className="eyebrow">{job.date}</p><h3>{job.company}</h3><p>{job.text}</p><div className="career-skills">{job.steps.map(step => <span key={step}>{step}</span>)}</div></article>)}</div>
      </section>
      <section className="scene stack-section light" id="stack">
        <Artwork name="stack"/><p className="corner top-left micro">José María Castro<br/>{labels.ideas}</p><p className="corner top-right micro">{labels.future}</p>
        <div className="stack-copy" data-reveal><SplitTitle text={t.stackTitle}/><p>{t.stackBody} {es ? 'Con IA y automatización para dedicar más tiempo a producto y arquitectura.' : 'With AI and automation to make more time for product and architecture.'}</p><span className="micro">{caption(labels.discipline)}</span></div>
        <div className="stack-inscriptions" aria-hidden="true">{t.stackGroups.map(([group,...items],i) => <span className={`stack-inscription inscription-${i}`} key={group}>{items.slice(0, i === 3 ? 4 : 3).map(item => <i key={item}>{item}</i>)}</span>)}</div><dl className="stack-legend">{t.stackGroups.map(([group,...items]) => <div key={group}><dt>{group}</dt><dd>{items.map(x => <span key={x}>{x}</span>)}</dd></div>)}</dl>
      </section>
      <section className="scene breadth" id="sectores">
        <Artwork name="breadth"/><p className="corner top-left micro">José María Castro <span className="rule-inline"/> {es ? 'Diseño que mueve negocios' : 'Design that moves business'}</p><SplitTitle text={t.breadthTitle} className="breadth-title"/><p className="breadth-description">{labels.breadth}</p>
        <div className="project-orbit">{t.extraProjects.map(([name,domain],i) => <span className={`orbit-project orbit-${i}`} key={name}><strong>{name}</strong><small>{domain}</small></span>)}</div><p className="corner bottom-left micro">{es ? 'Ideas en órbita real' : 'Ideas in real orbit'}</p><p className="corner bottom-right micro">{es ? 'Distintos mundos. Mejores soluciones.' : 'Different worlds. Better solutions.'}</p>
      </section>
      <section className="scene contact" id="contacto">
        <img className="artwork" src="/art/contacto.png" width="1672" height="941" alt="" loading="lazy"/>
        <div className="contact-identity"><span>José María Castro</span><small>{es ? 'Web · Cine · Historias de piedra' : 'Web · Cinema · Stone stories'}</small></div>
        <div className="contact-layout"><div className="contact-copy" data-reveal><span className="contact-blue-rule" aria-hidden="true"/><h2>{es ? <>¿Construimos<br/>tu próxima web?</> : <>Shall we build<br/>your next website?</>}</h2><p>{es ? <>Cuéntame tu idea. Te respondo yo,<br/>sin intermediarios.</> : <>Share your idea. I reply directly,<br/>without intermediaries.</>}</p><div className="contact-links"><a href={`mailto:${EMAIL}`}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15"/><path d="m3 6 9 7 9-7"/></svg><span>{EMAIL}</span></a><a href={LINKEDIN} target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19"/><path d="M7 10v7M7 7v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/></svg><span>linkedin.com/in/jose-maria-castro</span></a></div></div><ContactForm lang={lang}/></div>
        <footer><span>José María Castro<small>{es ? 'Arquitectura web para un mundo real' : 'Web architecture for a real world'}</small></span><button className="privacy-settings" type="button" onClick={() => window.dispatchEvent(new Event('portfolio:open-privacy-settings'))}>{es ? 'Privacidad' : 'Privacy'}</button><span>{es ? 'Cine · Piedra · Tecnología · Personas' : 'Cinema · Stone · Technology · People'}</span></footer>
      </section>
    </main><nav className={`page-navigation ${activePage === 4 ? 'on-light' : ''}`} aria-label={es ? 'Secciones' : 'Sections'}>{pageIds.map((id,i) => <a href={`#${id}`} key={id} aria-current={activePage === i ? 'page' : undefined} aria-label={(es ? ['Inicio','Sobre mí','Proyectos','Experiencia','Tecnologías','Sectores','Contacto'] : ['Home','About','Projects','Experience','Technologies','Sectors','Contact'])[i]}><span/></a>)}</nav><DetailDialog detail={detail} close={() => setDetail(null)} lang={lang}/>
  </div>;
}
