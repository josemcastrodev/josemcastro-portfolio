import React, { useState, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { flushSync } from "react-dom";
import gsap from "gsap";
const ID = "G-SZ5B1NE58P";
const KEY = "portfolio-analytics-consent-v1";
let started = false;
function readConsent() {
  var _a;
  try {
    return ((_a = JSON.parse(localStorage.getItem(KEY))) == null ? void 0 : _a.choice) || null;
  } catch {
    return null;
  }
}
const SRC = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
function track(name, parameters = {}) {
  if (window.gtag) window.gtag("event", name, parameters);
}
function enable() {
  window[`ga-disable-${ID}`] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function() {
    window.dataLayer.push(arguments);
  };
  if (started) return;
  started = true;
  if (document.querySelector(`script[src="${SRC}"]`)) return;
  window.gtag("js", /* @__PURE__ */ new Date());
  window.gtag("config", ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = SRC;
  document.head.appendChild(script);
}
function Analytics({ lang, section }) {
  const [open, setOpen] = useState(false);
  const es = lang === "es";
  useEffect(() => {
    setOpen(!readConsent());
    enable();
  }, []);
  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener("portfolio:open-privacy-settings", reopen);
    return () => window.removeEventListener("portfolio:open-privacy-settings", reopen);
  }, []);
  useEffect(() => {
    track("section_view", { section_name: section, language: lang });
  }, [section, lang]);
  useEffect(() => {
    const click = (event) => {
      var _a;
      const href = ((_a = event.target.closest("a")) == null ? void 0 : _a.getAttribute("href")) || "";
      if (href.startsWith("mailto:")) track("contact_click", { method: "email" });
      else if (href.includes("linkedin.com")) track("contact_click", { method: "linkedin" });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  function choose(choice) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ choice, date: (/* @__PURE__ */ new Date()).toISOString() }));
    } catch {
      setOpen(false);
      return;
    }
    enable();
    if (choice === "accepted") track("section_view", { section_name: section, language: lang });
    setOpen(false);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, open && /* @__PURE__ */ React.createElement("aside", { className: "consent-panel", "aria-label": es ? "Cookies analíticas" : "Analytics cookies" }, /* @__PURE__ */ React.createElement("button", { className: "consent-close", type: "button", "aria-label": es ? "Cerrar" : "Close", onClick: () => setOpen(false) }, "×"), /* @__PURE__ */ React.createElement("h2", null, es ? "Tu privacidad" : "Your privacy"), /* @__PURE__ */ React.createElement("p", null, es ? "Usamos Google Analytics para medir visitas e interacciones. La medición sigue activa aunque pulses rechazar." : "We use Google Analytics to measure visits and interactions. Measurement stays on even if you reject this notice."), /* @__PURE__ */ React.createElement("a", { href: "/privacidad.html", target: "_blank", rel: "noreferrer" }, es ? "Información de privacidad y cookies" : "Privacy and cookie information"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => choose("rejected") }, es ? "Rechazar" : "Reject"), /* @__PURE__ */ React.createElement("button", { onClick: () => choose("accepted") }, es ? "Aceptar analíticas" : "Accept analytics"))));
}
function ContactForm({ lang }) {
  const es = lang === "es";
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event) {
    var _a;
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    setSending(true);
    setStatus("");
    setStatusType("");
    try {
      const data = Object.fromEntries(new FormData(form));
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(15e3) });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "send");
      (_a = window.gtag) == null ? void 0 : _a.call(window, "event", "generate_lead", { method: "contact_form", language: es ? "es" : "en" });
      window.location.assign(es ? "/contacto-enviado" : "/en/message-sent");
    } catch (error) {
      setStatusType("error");
      setStatus(error.message === "email_not_configured" ? es ? "El envío de correo no está configurado todavía. Escríbeme a jose1911castro@gmail.com." : "Email delivery is not configured yet. Write to jose1911castro@gmail.com." : es ? "No se pudo enviar. Inténtalo de nuevo o escríbeme a jose1911castro@gmail.com." : "The message could not be sent. Try again or email jose1911castro@gmail.com.");
    } finally {
      setSending(false);
    }
  }
  return /* @__PURE__ */ React.createElement("form", { className: "contact-form", onSubmit: submit, "aria-label": es ? "Cuéntame tu proyecto" : "Tell me about your project" }, /* @__PURE__ */ React.createElement("div", { className: "form-heading" }, /* @__PURE__ */ React.createElement("span", null, es ? "Tu próxima idea empieza aquí" : "Your next idea starts here"), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "↗")), /* @__PURE__ */ React.createElement("div", { className: "form-row" }, /* @__PURE__ */ React.createElement("label", null, es ? "Nombre" : "Name", /* @__PURE__ */ React.createElement("input", { name: "name", autoComplete: "name", required: true, maxLength: 100, placeholder: es ? "Tu nombre" : "Your name" })), /* @__PURE__ */ React.createElement("label", null, "Email", /* @__PURE__ */ React.createElement("input", { name: "email", type: "email", autoComplete: "email", spellCheck: false, required: true, maxLength: 254, placeholder: es ? "tu@email.com" : "you@email.com" }))), /* @__PURE__ */ React.createElement("label", null, es ? "Mensaje" : "Message", /* @__PURE__ */ React.createElement("textarea", { name: "message", required: true, minLength: 10, maxLength: 5e3, rows: 3, placeholder: es ? "Cuéntame tu proyecto..." : "Tell me about your project..." })), /* @__PURE__ */ React.createElement("label", { className: "form-trap", "aria-hidden": "true" }, "Website", /* @__PURE__ */ React.createElement("input", { name: "website", tabIndex: -1, autoComplete: "off" })), /* @__PURE__ */ React.createElement("label", { className: "form-privacy" }, /* @__PURE__ */ React.createElement("input", { name: "privacy", type: "checkbox", required: true, value: "yes" }), /* @__PURE__ */ React.createElement("span", null, es ? "Acepto la " : "I accept the ", /* @__PURE__ */ React.createElement("a", { href: "/privacidad.html", target: "_blank", rel: "noreferrer" }, es ? "política de privacidad" : "privacy policy"), ".")), /* @__PURE__ */ React.createElement("button", { className: "primary-action", disabled: sending, type: "submit" }, sending ? es ? "Enviando…" : "Sending…" : es ? "Enviar mensaje" : "Send message", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "→")), /* @__PURE__ */ React.createElement("p", { className: `form-status${statusType ? ` ${statusType}` : ""}`, role: "status", "aria-live": "polite", "aria-atomic": "true" }, status));
}
const EMAIL = "jose1911castro@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/josemcastrop/";
const content = {
  es: {
    metaTitle: "Desarrollador Web Freelance en Alcobendas | José María Castro",
    metaDescription: "José María Castro, desarrollador web freelance y Senior Full Stack en Alcobendas. Páginas web profesionales, rápidas y con presupuesto ajustado para negocios y autónomos.",
    skip: "Saltar al contenido",
    menu: "Abrir menú",
    close: "Cerrar menú",
    nav: [["Proyectos", "proyectos"], ["Sobre mí", "sobre-mi"], ["Tecnologías", "stack"], ["Contacto", "contacto"]],
    role: "Full Stack Engineer",
    stackLine: ".NET / React / Node / Next.js",
    heroLine: "Construyo producto, conecto sistemas y automatizo lo repetitivo.",
    projectsCta: "Ver proyectos",
    journeyCta: "Conocer mi recorrido",
    aboutTitle: "Código, producto y una curiosidad bastante difícil de apagar.",
    aboutBody: "Soy Senior Full Stack Developer en Alcobendas, Madrid, especializado en .NET, C# y React. Llevo siete años convirtiendo sistemas complejos en software claro, conectando código, personas y producto.",
    traits: ["Curiosidad", "Criterio", "Construcción"],
    workTitle: "Tecnología real para un impacto tangible.",
    workHint: "Explora cada proyecto",
    openCase: "Visitar proyecto",
    projects: [
      { name: "Kron Analytics", domain: "Analítica e IoT", line: "Datos físicos. Decisiones operativas.", detail: "Plataforma para convertir señales de cámaras y dispositivos en información operativa en tiempo real.", href: "https://kronanalytics.com/", theme: "network" },
      { name: "Laboralfy", domain: "Automatización", line: "Trámites complejos, resueltos.", detail: "Automatización con Playwright, validación de datos y gestión de excepciones para procesos laborales.", theme: "flow" },
      { name: "Automix", domain: "Dispositivos y pagos", line: "Software que sale de la pantalla.", detail: "Aplicación de dispositivo, backend, panel operativo e integración con TPV para eventos.", theme: "device" },
      { name: "BCN Vision", domain: "Visión industrial", line: "Hacer usable la visión artificial.", detail: "Herramientas para definir zonas de inspección y operar procesos visuales especializados.", theme: "vision" }
    ],
    expTitle: "De mantener módulos a construir producto completo.",
    babel: { company: "BABEL", date: "2019 - 2022", text: "Crecí desde tareas júnior hasta asumir la responsabilidad del módulo CAE de OHS Solutions.", steps: ["Software empresarial", "Responsabilidad", "Full stack"], responsibilities: ["Desarrollo y evolución de software empresarial con .NET, C# y SQL Server.", "Responsabilidad funcional y técnica del módulo de Coordinación de Actividades Empresariales (CAE).", "Análisis de incidencias, mantenimiento evolutivo e integración dentro de una plataforma de prevención consolidada."], technologies: ["C#", ".NET", "SQL Server", "TFS"] },
    q2b: { company: "Q2B Studio", date: "2022 - actualidad", text: "Trabajo de extremo a extremo: requisitos, cliente, decisiones técnicas, desarrollo, integraciones y evolución.", steps: ["Producto", "Cliente", "Integraciones", "IA asistida"], responsibilities: ["Toma de requisitos y comunicación directa con cliente para convertir necesidades en producto.", "Diseño y desarrollo full stack de aplicaciones, paneles operativos, APIs e integraciones con servicios y dispositivos.", "Decisiones técnicas, despliegue, mantenimiento evolutivo y automatización de procesos con herramientas de IA."], technologies: [".NET", "React", "Next.js", "Node.js", "Azure", "Playwright", "n8n"] },
    aiTitle: "Más criterio. Menos trabajo repetitivo.",
    aiBody: "Uso Cursor, agentes y automatizaciones para dedicar más tiempo a arquitectura, producto, decisiones y problemas difíciles.",
    aiStages: ["Filtra", "Organiza", "Automatiza"],
    aiFocus: ["Arquitectura", "Producto", "Decisiones"],
    stackTitle: "Una base sólida. Un stack que evoluciona.",
    stackBody: "Tecnología práctica para resolver hoy y construir lo que viene mañana.",
    stackGroups: [["Core", "C#", ".NET", "SQL Server", "REST APIs"], ["Web", "React", "Next.js", "Node.js", "JavaScript"], ["Delivery", "Azure", "Git", "TFS"], ["AI + automation", "Cursor", "Agentes", "n8n", "Playwright"]],
    breadthTitle: "Distintos sectores. La misma obsesión por resolver bien.",
    extraProjects: [["Daruma", "e-commerce"], ["SendTheJoy", "e-commerce"], ["Nouretol", "APIs"], ["Kumoba", "real estate"], ["Oritzó", "hospitality"], ["Nomad Burger", "hospitality"], ["Wild Rumble", "gaming"]],
    contactTitle: "¿Construimos tu próxima web?",
    contactBody: "Cuéntame tu idea. Te respondo yo, sin intermediarios.",
    contactCta: "Enviar mensaje",
    serviceLink: "Desarrollo web para negocios en Alcobendas",
    footer: "Full Stack Engineer",
    availability: "Disponible para nuevas oportunidades",
    portraitAlt: "Retrato profesional de José María Castro"
  },
  en: {
    metaTitle: "José María Castro | Senior Full Stack .NET Developer, Madrid",
    metaDescription: "José María Castro, Senior Full Stack Developer based in Alcobendas, Madrid. .NET, C#, React and Node.js development, software integrations and automation.",
    skip: "Skip to content",
    menu: "Open menu",
    close: "Close menu",
    nav: [["Projects", "proyectos"], ["About", "sobre-mi"], ["Technologies", "stack"], ["Contact", "contacto"]],
    role: "Full Stack Engineer",
    stackLine: ".NET / React / Node / Next.js",
    heroLine: "I build products, connect systems and automate repetitive work.",
    projectsCta: "View projects",
    journeyCta: "See my journey",
    aboutTitle: "Code, product and a curiosity that is quite hard to switch off.",
    aboutBody: "I am a Senior Full Stack Developer based in Alcobendas, Madrid, specialising in .NET, C# and React. For seven years, I have turned complex systems into clear software, connecting code, people and product.",
    traits: ["Curiosity", "Judgement", "Craft"],
    workTitle: "Real technology with tangible impact.",
    workHint: "Explore each project",
    openCase: "Visit project",
    projects: [
      { name: "Kron Analytics", domain: "Analytics and IoT", line: "Physical data. Operational decisions.", detail: "A platform that turns camera and device signals into real-time operational insight.", href: "https://kronanalytics.com/", theme: "network" },
      { name: "Laboralfy", domain: "Automation", line: "Complex paperwork, resolved.", detail: "Playwright automation, data validation and exception handling for employment processes.", theme: "flow" },
      { name: "Automix", domain: "Devices and payments", line: "Software that leaves the screen.", detail: "Device app, backend, operations panel and payment terminal integration for events.", theme: "device" },
      { name: "BCN Vision", domain: "Industrial vision", line: "Making computer vision usable.", detail: "Tools for defining inspection zones and operating specialised visual processes.", theme: "vision" }
    ],
    expTitle: "From maintaining modules to building complete products.",
    babel: { company: "BABEL", date: "2019 - 2022", text: "I grew from junior tasks to owning the contractor coordination module in OHS Solutions.", steps: ["Enterprise software", "Ownership", "Full stack"], responsibilities: ["Developed and evolved enterprise software with .NET, C# and SQL Server.", "Took functional and technical ownership of the Contractor Activity Coordination (CAE) module.", "Analysed incidents, delivered product improvements and integrated them into an established prevention platform."], technologies: ["C#", ".NET", "SQL Server", "TFS"] },
    q2b: { company: "Q2B Studio", date: "2022 - present", text: "I work end to end: requirements, client conversations, technical decisions, development, integrations and evolution.", steps: ["Product", "Client", "Integrations", "AI-assisted"], responsibilities: ["Turn client conversations and requirements into concrete product decisions.", "Design and build full-stack applications, operational dashboards, APIs and integrations with services and devices.", "Own technical decisions, delivery, product evolution and process automation with AI-assisted tools."], technologies: [".NET", "React", "Next.js", "Node.js", "Azure", "Playwright", "n8n"] },
    aiTitle: "More judgement. Less repetitive work.",
    aiBody: "I use Cursor, agents and automation to spend more time on architecture, product, decisions and hard problems.",
    aiStages: ["Filter", "Organise", "Automate"],
    aiFocus: ["Architecture", "Product", "Decisions"],
    stackTitle: "A solid foundation. A stack that evolves.",
    stackBody: "Practical technology for solving today and building what comes next.",
    stackGroups: [["Core", "C#", ".NET", "SQL Server", "REST APIs"], ["Web", "React", "Next.js", "Node.js", "JavaScript"], ["Delivery", "Azure", "Git", "TFS"], ["AI + automation", "Cursor", "Agents", "n8n", "Playwright"]],
    breadthTitle: "Different sectors. The same obsession with solving things well.",
    extraProjects: [["Daruma", "e-commerce"], ["SendTheJoy", "e-commerce"], ["Nouretol", "APIs"], ["Kumoba", "real estate"], ["Oritzó", "hospitality"], ["Nomad Burger", "hospitality"], ["Wild Rumble", "gaming"]],
    contactTitle: "Shall we build your next website?",
    contactBody: "Share your idea. I reply directly, without intermediaries.",
    contactCta: "Send message",
    serviceLink: "Web development for businesses in Alcobendas",
    footer: "Full Stack Engineer",
    availability: "Open to new opportunities",
    portraitAlt: "Professional portrait of José María Castro"
  }
};
function Logo() {
  return /* @__PURE__ */ React.createElement("svg", { className: "logo-mark", viewBox: "0 0 160 180", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("path", { className: "logo-piece logo-white", fill: "#f1f0ea", d: "M7 89 66 53 66 85 34 104 34 140 7 159Z" }), /* @__PURE__ */ React.createElement("path", { className: "logo-piece logo-top", fill: "#6f9bc7", d: "M66 8 154 58 154 107 124 125 124 76 66 43Z" }), /* @__PURE__ */ React.createElement("path", { className: "logo-piece logo-bottom", fill: "#6f9bc7", d: "M66 94 96 76 96 121 150 154 119 172 66 136Z" }));
}
function Artwork({ name, priority = false, alt = "" }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { className: "artwork", src: `/art/${name}.webp`, alt, width: "1672", height: "941", loading: priority ? "eager" : "lazy", fetchPriority: priority ? "high" : "auto", decoding: "async" }), /* @__PURE__ */ React.createElement("span", { className: "scene-shade", "aria-hidden": "true" }));
}
function SplitTitle({ text, className = "" }) {
  const split = text.indexOf(". ");
  return /* @__PURE__ */ React.createElement("h2", { className }, split < 0 ? text : /* @__PURE__ */ React.createElement(React.Fragment, null, text.slice(0, split + 1), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", null, text.slice(split + 2))));
}
function DetailDialog({ detail, close, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!detail) return;
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
      previous == null ? void 0 : previous.focus();
    };
  }, [detail]);
  if (!detail) return null;
  return /* @__PURE__ */ React.createElement("dialog", { className: "detail-dialog", ref, onCancel: close, onClick: (event) => {
    if (event.target === event.currentTarget) close();
  } }, /* @__PURE__ */ React.createElement("button", { className: "dialog-close", onClick: close, "aria-label": lang === "es" ? "Cerrar detalle" : "Close details" }, "×"), /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, detail.domain || detail.date), /* @__PURE__ */ React.createElement("h2", null, detail.name || detail.company), /* @__PURE__ */ React.createElement("p", null, detail.detail || detail.text), detail.responsibilities && /* @__PURE__ */ React.createElement("div", { className: "dialog-responsibilities" }, /* @__PURE__ */ React.createElement("h3", null, lang === "es" ? "Responsabilidades" : "Responsibilities"), /* @__PURE__ */ React.createElement("ul", null, detail.responsibilities.map((item) => /* @__PURE__ */ React.createElement("li", { key: item }, item)))), detail.technologies && /* @__PURE__ */ React.createElement("div", { className: "dialog-technologies", "aria-label": lang === "es" ? "Tecnologías" : "Technologies" }, detail.technologies.map((item) => /* @__PURE__ */ React.createElement("span", { key: item }, item))), !detail.responsibilities && detail.steps && /* @__PURE__ */ React.createElement("ul", null, detail.steps.map((step) => /* @__PURE__ */ React.createElement("li", { key: step }, step))), detail.href && /* @__PURE__ */ React.createElement("a", { className: "primary-action", href: detail.href, target: "_blank", rel: "noreferrer" }, lang === "es" ? "Visitar proyecto" : "Visit project", " ", /* @__PURE__ */ React.createElement("span", null, "↗")));
}
function Portfolio() {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("portfolio-language");
      if (saved === "es" || saved === "en") return saved;
    } catch {
    }
    return "es";
  });
  const [menu, setMenu] = useState(false);
  const [detail, setDetail] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const navigation = useRef(null);
  const root = useRef(null);
  const t = content[lang];
  const es = lang === "es";
  const pageIds = ["inicio", "sobre-mi", "proyectos", "experiencia", "stack", "sectores", "contacto"];
  const goToPage = (event, id) => {
    var _a;
    event.preventDefault();
    const index = pageIds.indexOf(id);
    if (index < 0) return;
    setMenu(false);
    (_a = navigation.current) == null ? void 0 : _a.call(navigation, index);
  };
  const changeLanguage = (next) => {
    if (next === lang) return;
    const update = () => flushSync(() => setLang(next));
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(update);
    else update();
  };
  useEffect(() => {
    var _a;
    document.documentElement.lang = lang;
    document.title = t.metaTitle;
    (_a = document.querySelector('meta[name="description"]')) == null ? void 0 : _a.setAttribute("content", t.metaDescription);
    try {
      localStorage.setItem("portfolio-language", lang);
    } catch {
    }
  }, [lang, t]);
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => {
    const scroller = root.current;
    const pages = [...scroller.querySelectorAll(".scene")];
    const desktop = window.matchMedia("(min-width: 761px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = Math.max(0, pageIds.indexOf(location.hash.slice(1)));
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    let busy = false, wheelSum = 0, lastWheel = 0, unlockAt = 0;
    let transition;
    const revealSelector = ".hero-name span, .hero-copy > *, .hero-service-cta, .about-copy > *, .projects-heading > *, .project-text > *, .experience-title, .career-heading, .career-label, .mobile-career > *, .stack-copy > *, .stack-legend > div, .breadth-title, .breadth-description, .orbit-project, .contact-copy > *, .contact-form > *, .contact footer";
    const reveals = /* @__PURE__ */ new Map();
    const reveal = (page, direction = 1, delay = 0) => {
      var _a;
      (_a = reveals.get(page)) == null ? void 0 : _a.kill();
      const elements = page.querySelectorAll(revealSelector);
      gsap.set(elements, { clearProps: "transform,opacity" });
      if (reduced.matches) return;
      reveals.set(page, gsap.fromTo(elements, { y: direction * 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: { each: 0.12, amount: Math.min(0.6, elements.length * 0.12) }, delay, ease: "power3.out", clearProps: "transform,opacity" }));
    };
    const expose = (index) => pages.forEach((page, i) => {
      page.inert = i !== index;
      page.setAttribute("aria-hidden", String(i !== index));
    });
    const setup = () => {
      transition == null ? void 0 : transition.kill();
      gsap.killTweensOf(pages);
      busy = false;
      gsap.set(pages, { clearProps: "all" });
      pages.forEach((page) => {
        page.inert = false;
        page.removeAttribute("aria-hidden");
      });
      if (desktop.matches) {
        scroller.scrollTop = 0;
        gsap.set(pages, { autoAlpha: 0, zIndex: 0, yPercent: 0, scale: 1, pointerEvents: "none" });
        gsap.set(pages[current], { autoAlpha: 1, zIndex: 1, pointerEvents: "auto" });
        expose(current);
      } else scroller.scrollTop = current * scroller.clientHeight;
      setActivePage(current);
      reveal(pages[current], 1, 0.12);
    };
    const navigate = (index) => {
      if (index < 0 || index >= pages.length || index === current || busy) return;
      if (!desktop.matches) {
        scroller.scrollTo({ top: index * scroller.clientHeight, behavior: reduced.matches ? "instant" : "smooth" });
        return;
      }
      const outgoing = pages[current], incoming = pages[index], direction = index > current ? 1 : -1;
      busy = true;
      wheelSum = 0;
      expose(index);
      gsap.set(incoming, { autoAlpha: 1, yPercent: reduced.matches ? 0 : direction * 100, scale: 1, zIndex: 2, pointerEvents: "auto" });
      gsap.set(outgoing, { zIndex: 1, pointerEvents: "none" });
      current = index;
      setActivePage(index);
      transition = gsap.timeline({ defaults: { duration: reduced.matches ? 0 : 1, ease: "power2.inOut" }, onComplete: () => {
        gsap.set(outgoing, { autoAlpha: 0, yPercent: 0, scale: 1, zIndex: 0 });
        gsap.set(incoming, { yPercent: 0, scale: 1, zIndex: 1 });
        busy = false;
        unlockAt = performance.now() + 90;
        wheelSum = 0;
      } });
      transition.to(incoming, { yPercent: 0 }, 0).to(outgoing, { yPercent: -direction * 12, scale: 0.96, opacity: 0.45 }, 0);
      reveal(incoming, direction, 0.78);
    };
    navigation.current = navigate;
    const wheel = (event) => {
      if (!desktop.matches || event.ctrlKey || document.querySelector("dialog[open]") || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target.closest("textarea")) return;
      const inner = event.target.closest(".contact-layout");
      if (inner && (event.deltaY > 0 && inner.scrollTop + inner.clientHeight < inner.scrollHeight - 1 || event.deltaY < 0 && inner.scrollTop > 0)) return;
      event.preventDefault();
      const now = performance.now();
      if (busy || now < unlockAt) {
        wheelSum = 0;
        lastWheel = now;
        return;
      }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1);
      if (now - lastWheel > 260 || Math.sign(delta) !== Math.sign(wheelSum)) wheelSum = 0;
      wheelSum += delta;
      lastWheel = now;
      if (Math.abs(wheelSum) >= 75) {
        navigate(current + Math.sign(wheelSum));
        wheelSum = 0;
      }
    };
    const keyboard = (event) => {
      if (!desktop.matches || document.querySelector("dialog[open]") || event.target.closest("input,textarea,select,[contenteditable]")) return;
      const direction = ["ArrowDown", "PageDown"].includes(event.key) ? 1 : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (direction) {
        event.preventDefault();
        navigate(current + direction);
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        navigate(event.key === "Home" ? 0 : pages.length - 1);
      }
    };
    const scroll = () => {
      if (!desktop.matches) {
        const next = Math.min(pages.length - 1, Math.round(scroller.scrollTop / scroller.clientHeight));
        if (next !== current) {
          reveal(pages[next], next > current ? 1 : -1);
          current = next;
          setActivePage(current);
        }
      }
    };
    setup();
    scroller.addEventListener("wheel", wheel, { passive: false });
    scroller.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("keydown", keyboard);
    desktop.addEventListener("change", setup);
    return () => {
      transition == null ? void 0 : transition.kill();
      gsap.killTweensOf(pages);
      gsap.set(pages, { clearProps: "all" });
      reveals.forEach((animation) => animation.kill());
      gsap.set(scroller.querySelectorAll(revealSelector), { clearProps: "transform,opacity" });
      pages.forEach((page) => {
        page.inert = false;
        page.removeAttribute("aria-hidden");
      });
      scroller.removeEventListener("wheel", wheel);
      scroller.removeEventListener("scroll", scroll);
      window.removeEventListener("keydown", keyboard);
      desktop.removeEventListener("change", setup);
      navigation.current = null;
    };
  }, []);
  const labels = es ? {
    ideas: "Ideas / Sistemas / Resultados",
    human: "Sistemas más humanos para un mundo más eficiente",
    scale: "Soluciones que escalan",
    code: "Código / Producto / Personas",
    connect: "Conecta / Integra / Automatiza",
    selected: "Proyectos seleccionados",
    case: "Abrir caso",
    real: "Ideas que operan en el mundo real",
    experience: "Experiencia",
    purpose: "Mismo propósito / Mayor impacto",
    from: "De mantener módulos",
    to: "a construir producto completo.",
    future: "Tecnología para lo que viene",
    discipline: "Disciplina / Tecnología / Impacto",
    breadth: "Marcas, productos y experiencias en contextos distintos. El mismo principio: entender, simplificar, resolver y hacer que funcione."
  } : {
    ideas: "Ideas / Systems / Results",
    human: "More human systems for a more efficient world",
    scale: "Solutions that scale",
    code: "Code / Product / People",
    connect: "Connect / Integrate / Automate",
    selected: "Selected projects",
    case: "Explore project",
    real: "Ideas that work in the real world",
    experience: "Experience",
    purpose: "Same purpose / Greater impact",
    from: "From maintaining modules",
    to: "to building complete products.",
    future: "Technology for what comes next",
    discipline: "Discipline / Technology / Impact",
    breadth: "Brands, products and experiences in different contexts. The same principle: understand, simplify, solve and make it work."
  };
  const caption = (value) => value.split(" / ").map((line, index) => /* @__PURE__ */ React.createElement(React.Fragment, { key: line }, index > 0 && /* @__PURE__ */ React.createElement("br", null), line));
  const projectLines = es ? ["Datos físicos. Decisiones operativas.", "Automatización para equipos que avanzan.", "Dispositivos conectados. Pagos sin fricción.", "Visión industrial para un mundo más eficiente."] : ["Physical data. Operational decisions.", "Automation for teams moving forward.", "Connected devices. Frictionless payments.", "Industrial vision for a more efficient world."];
  return /* @__PURE__ */ React.createElement("div", { className: "site", ref: root, onClick: (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (link && pageIds.includes(link.hash.slice(1))) goToPage(event, link.hash.slice(1));
  } }, /* @__PURE__ */ React.createElement("a", { className: "skip-link", href: "#main", onClick: (event) => {
    var _a;
    event.preventDefault();
    (_a = document.getElementById("main")) == null ? void 0 : _a.focus();
  } }, t.skip), /* @__PURE__ */ React.createElement(Analytics, { lang, section: pageIds[activePage] }), /* @__PURE__ */ React.createElement("main", { id: "main", tabIndex: -1 }, /* @__PURE__ */ React.createElement("section", { className: "scene hero", id: "inicio" }, /* @__PURE__ */ React.createElement(Artwork, { name: "hero", priority: true }), /* @__PURE__ */ React.createElement("header", { className: "nav-wrap" }, /* @__PURE__ */ React.createElement("a", { className: "brand-link", href: "#inicio", "aria-label": "José María Castro" }, /* @__PURE__ */ React.createElement(Logo, null)), /* @__PURE__ */ React.createElement("nav", { className: menu ? "nav-links open" : "nav-links", id: "navigation", "aria-label": es ? "Navegación principal" : "Main navigation" }, t.nav.map(([label, id]) => /* @__PURE__ */ React.createElement("a", { key: id, href: `#${id}`, onClick: () => setMenu(false) }, label))), /* @__PURE__ */ React.createElement("div", { className: "language-switch", role: "group", "aria-label": es ? "Idioma" : "Language" }, /* @__PURE__ */ React.createElement("button", { lang: "es", "aria-label": "Español", "aria-pressed": es, onClick: () => changeLanguage("es") }, "ES"), /* @__PURE__ */ React.createElement("button", { lang: "en", "aria-label": "English", "aria-pressed": !es, onClick: () => changeLanguage("en") }, "EN")), /* @__PURE__ */ React.createElement("button", { className: "menu-toggle", "aria-controls": "navigation", "aria-expanded": menu, "aria-label": menu ? t.close : t.menu, onClick: () => setMenu(!menu) }, menu ? "×" : "☰"), /* @__PURE__ */ React.createElement("span", { className: "hero-motto micro" }, caption(labels.ideas))), /* @__PURE__ */ React.createElement("div", { className: "hero-title-plane" }, /* @__PURE__ */ React.createElement("h1", { className: "hero-name", translate: "no" }, /* @__PURE__ */ React.createElement("span", null, "José María"), " ", /* @__PURE__ */ React.createElement("span", null, "Castro"))), /* @__PURE__ */ React.createElement("div", { className: "hero-copy" }, /* @__PURE__ */ React.createElement("p", { className: "hero-role" }, t.role), /* @__PURE__ */ React.createElement("p", { className: "hero-stack", translate: "no" }, t.stackLine), /* @__PURE__ */ React.createElement("span", { className: "blue-rule" }), /* @__PURE__ */ React.createElement("p", { className: "hero-description" }, t.heroLine), /* @__PURE__ */ React.createElement("div", { className: "hero-actions" }, /* @__PURE__ */ React.createElement("a", { className: "primary-action", href: "#proyectos" }, t.projectsCta, /* @__PURE__ */ React.createElement("span", null, "→")), /* @__PURE__ */ React.createElement("a", { className: "text-action", href: "#experiencia" }, t.journeyCta))), /* @__PURE__ */ React.createElement("a", { className: "hero-service-cta", href: es ? "/desarrollo-web-alcobendas" : "/en/web-developer-alcobendas" }, es ? "¿Necesitas una web?" : "Need a website?", " ", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "↗")), /* @__PURE__ */ React.createElement("span", { className: "hero-engraving micro", "aria-hidden": "true" }, caption(labels.connect)), /* @__PURE__ */ React.createElement("p", { className: "hero-side micro" }, labels.human), /* @__PURE__ */ React.createElement("p", { className: "corner bottom-left micro" }, labels.scale), /* @__PURE__ */ React.createElement("p", { className: "corner bottom-right micro" }, caption(labels.code))), /* @__PURE__ */ React.createElement("section", { className: "scene about", id: "sobre-mi" }, /* @__PURE__ */ React.createElement(Artwork, { name: "about", alt: t.portraitAlt }), /* @__PURE__ */ React.createElement("div", { className: "about-copy", "data-reveal": true }, /* @__PURE__ */ React.createElement("h2", null, t.aboutTitle), /* @__PURE__ */ React.createElement("p", null, t.aboutBody), /* @__PURE__ */ React.createElement("div", { className: "trait-row" }, t.traits.map((x) => /* @__PURE__ */ React.createElement("span", { key: x }, x))))), /* @__PURE__ */ React.createElement("section", { className: "scene projects", id: "proyectos" }, /* @__PURE__ */ React.createElement(Artwork, { name: "projects" }), /* @__PURE__ */ React.createElement("div", { className: "section-bar" }, /* @__PURE__ */ React.createElement("span", null, "José María Castro"), /* @__PURE__ */ React.createElement("a", { href: "#sobre-mi" }, t.nav[1][0]), /* @__PURE__ */ React.createElement("a", { href: "#contacto" }, t.nav[3][0])), /* @__PURE__ */ React.createElement("div", { className: "projects-heading" }, /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, labels.selected), /* @__PURE__ */ React.createElement("h2", null, t.workTitle)), /* @__PURE__ */ React.createElement("p", { className: "projects-note micro" }, labels.real), /* @__PURE__ */ React.createElement("div", { className: `project-panels ${activeProject !== null ? "has-active" : ""}`, onPointerLeave: () => setActiveProject(null), onBlur: (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActiveProject(null);
  } }, t.projects.map((p, i) => /* @__PURE__ */ React.createElement("article", { className: `project-panel project-${i} ${activeProject === i ? "is-active" : ""}`, key: p.name, onPointerEnter: () => setActiveProject(i), onFocus: () => setActiveProject(i) }, /* @__PURE__ */ React.createElement("svg", { className: "project-photo", viewBox: ["0 55 704 886", "704 55 314 886", "1018 55 326 886", "1344 55 328 886"][i], preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("image", { href: "/art/projects.webp", width: "1672", height: "941" })), /* @__PURE__ */ React.createElement("button", { className: "project-open", onClick: () => setDetail(p), "aria-label": `${labels.case}: ${p.name}` }, /* @__PURE__ */ React.createElement("span", { className: "project-text" }, /* @__PURE__ */ React.createElement("strong", null, p.name), /* @__PURE__ */ React.createElement("span", null, projectLines[i]), /* @__PURE__ */ React.createElement("span", { className: "case-link" }, labels.case, /* @__PURE__ */ React.createElement("i", null, "⟶")))))))), /* @__PURE__ */ React.createElement("section", { className: "scene experience", id: "experiencia" }, /* @__PURE__ */ React.createElement(Artwork, { name: "experience" }), /* @__PURE__ */ React.createElement("p", { className: "corner top-left micro" }, labels.experience), /* @__PURE__ */ React.createElement("p", { className: "corner top-right micro" }, caption(labels.purpose)), /* @__PURE__ */ React.createElement("h2", { className: "experience-title", "data-reveal": true }, labels.from, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", null, labels.to)), /* @__PURE__ */ React.createElement("button", { className: "career-heading babel-heading", onClick: () => setDetail(t.babel) }, /* @__PURE__ */ React.createElement("img", { className: "career-logo career-logo-babel", src: "/logos/babel.svg", alt: "BABEL" }), /* @__PURE__ */ React.createElement("span", null, t.babel.date)), /* @__PURE__ */ React.createElement("button", { className: "career-heading q2b-heading", onClick: () => setDetail(t.q2b) }, /* @__PURE__ */ React.createElement("img", { className: "career-logo career-logo-q2b", src: "/logos/q2b.png", alt: "Q2B Studio" }), /* @__PURE__ */ React.createElement("span", null, t.q2b.date)), /* @__PURE__ */ React.createElement("div", { className: "career-labels" }, [...t.babel.steps, ...t.q2b.steps].map((x, i) => /* @__PURE__ */ React.createElement("span", { className: `career-label career-label-${i}`, key: x }, x))), /* @__PURE__ */ React.createElement("p", { className: "career-base micro" }, es ? "Base sólida para ir más lejos" : "A solid base to go further"), /* @__PURE__ */ React.createElement("div", { className: "mobile-career" }, [t.babel, t.q2b].map((job, i) => /* @__PURE__ */ React.createElement("article", { key: job.company }, /* @__PURE__ */ React.createElement("span", { className: "career-number" }, "0", i + 1), /* @__PURE__ */ React.createElement("p", { className: "eyebrow" }, job.date), /* @__PURE__ */ React.createElement("h3", null, job.company), /* @__PURE__ */ React.createElement("p", null, job.text), /* @__PURE__ */ React.createElement("div", { className: "career-skills" }, job.steps.map((step) => /* @__PURE__ */ React.createElement("span", { key: step }, step))))))), /* @__PURE__ */ React.createElement("section", { className: "scene stack-section light", id: "stack" }, /* @__PURE__ */ React.createElement(Artwork, { name: "stack" }), /* @__PURE__ */ React.createElement("p", { className: "corner top-left micro" }, "José María Castro", /* @__PURE__ */ React.createElement("br", null), labels.ideas), /* @__PURE__ */ React.createElement("p", { className: "corner top-right micro" }, labels.future), /* @__PURE__ */ React.createElement("div", { className: "stack-copy", "data-reveal": true }, /* @__PURE__ */ React.createElement(SplitTitle, { text: t.stackTitle }), /* @__PURE__ */ React.createElement("p", null, t.stackBody, " ", es ? "Con IA y automatización para dedicar más tiempo a producto y arquitectura." : "With AI and automation to make more time for product and architecture."), /* @__PURE__ */ React.createElement("span", { className: "micro" }, caption(labels.discipline))), /* @__PURE__ */ React.createElement("div", { className: "stack-inscriptions", "aria-hidden": "true" }, t.stackGroups.map(([group, ...items], i) => /* @__PURE__ */ React.createElement("span", { className: `stack-inscription inscription-${i}`, key: group }, items.slice(0, i === 3 ? 4 : 3).map((item) => /* @__PURE__ */ React.createElement("i", { key: item }, item))))), /* @__PURE__ */ React.createElement("dl", { className: "stack-legend" }, t.stackGroups.map(([group, ...items]) => /* @__PURE__ */ React.createElement("div", { key: group }, /* @__PURE__ */ React.createElement("dt", null, group), /* @__PURE__ */ React.createElement("dd", null, items.map((x) => /* @__PURE__ */ React.createElement("span", { key: x }, x))))))), /* @__PURE__ */ React.createElement("section", { className: "scene breadth", id: "sectores" }, /* @__PURE__ */ React.createElement(Artwork, { name: "breadth" }), /* @__PURE__ */ React.createElement("p", { className: "corner top-left micro" }, "José María Castro ", /* @__PURE__ */ React.createElement("span", { className: "rule-inline" }), " ", es ? "Diseño que mueve negocios" : "Design that moves business"), /* @__PURE__ */ React.createElement(SplitTitle, { text: t.breadthTitle, className: "breadth-title" }), /* @__PURE__ */ React.createElement("p", { className: "breadth-description" }, labels.breadth), /* @__PURE__ */ React.createElement("div", { className: "project-orbit" }, t.extraProjects.map(([name, domain], i) => /* @__PURE__ */ React.createElement("span", { className: `orbit-project orbit-${i}`, key: name }, /* @__PURE__ */ React.createElement("strong", null, name), /* @__PURE__ */ React.createElement("small", null, domain)))), /* @__PURE__ */ React.createElement("p", { className: "corner bottom-left micro" }, es ? "Ideas en órbita real" : "Ideas in real orbit"), /* @__PURE__ */ React.createElement("p", { className: "corner bottom-right micro" }, es ? "Distintos mundos. Mejores soluciones." : "Different worlds. Better solutions.")), /* @__PURE__ */ React.createElement("section", { className: "scene contact", id: "contacto" }, /* @__PURE__ */ React.createElement("img", { className: "artwork", src: "/art/contacto.png", width: "1672", height: "941", alt: "", loading: "lazy" }), /* @__PURE__ */ React.createElement("div", { className: "contact-identity" }, /* @__PURE__ */ React.createElement("span", null, "José María Castro"), /* @__PURE__ */ React.createElement("small", null, es ? "Web · Cine · Historias de piedra" : "Web · Cinema · Stone stories")), /* @__PURE__ */ React.createElement("div", { className: "contact-layout" }, /* @__PURE__ */ React.createElement("div", { className: "contact-copy", "data-reveal": true }, /* @__PURE__ */ React.createElement("span", { className: "contact-blue-rule", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("h2", null, es ? /* @__PURE__ */ React.createElement(React.Fragment, null, "¿Construimos", /* @__PURE__ */ React.createElement("br", null), "tu próxima web?") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Shall we build", /* @__PURE__ */ React.createElement("br", null), "your next website?")), /* @__PURE__ */ React.createElement("p", null, es ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Cuéntame tu idea. Te respondo yo,", /* @__PURE__ */ React.createElement("br", null), "sin intermediarios.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Share your idea. I reply directly,", /* @__PURE__ */ React.createElement("br", null), "without intermediaries.")), /* @__PURE__ */ React.createElement("div", { className: "contact-links" }, /* @__PURE__ */ React.createElement("a", { href: `mailto:${EMAIL}` }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "2.5", y: "4.5", width: "19", height: "15" }), /* @__PURE__ */ React.createElement("path", { d: "m3 6 9 7 9-7" })), /* @__PURE__ */ React.createElement("span", null, EMAIL)), /* @__PURE__ */ React.createElement("a", { href: LINKEDIN, target: "_blank", rel: "noreferrer" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("rect", { x: "2.5", y: "2.5", width: "19", height: "19" }), /* @__PURE__ */ React.createElement("path", { d: "M7 10v7M7 7v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4" })), /* @__PURE__ */ React.createElement("span", null, "linkedin.com/in/josemcastrop")))), /* @__PURE__ */ React.createElement(ContactForm, { lang })), /* @__PURE__ */ React.createElement("footer", null, /* @__PURE__ */ React.createElement("span", null, "José María Castro", /* @__PURE__ */ React.createElement("small", null, es ? "Arquitectura web para un mundo real" : "Web architecture for a real world")), /* @__PURE__ */ React.createElement("button", { className: "privacy-settings", type: "button", onClick: () => window.dispatchEvent(new Event("portfolio:open-privacy-settings")) }, es ? "Privacidad" : "Privacy"), /* @__PURE__ */ React.createElement("span", null, es ? "Cine · Piedra · Tecnología · Personas" : "Cinema · Stone · Technology · People")))), /* @__PURE__ */ React.createElement("nav", { className: `page-navigation ${activePage === 4 ? "on-light" : ""}`, "aria-label": es ? "Secciones" : "Sections" }, pageIds.map((id, i) => /* @__PURE__ */ React.createElement("a", { href: `#${id}`, key: id, "aria-current": activePage === i ? "page" : void 0, "aria-label": (es ? ["Inicio", "Sobre mí", "Proyectos", "Experiencia", "Tecnologías", "Sectores", "Contacto"] : ["Home", "About", "Projects", "Experience", "Technologies", "Sectors", "Contact"])[i] }, /* @__PURE__ */ React.createElement("span", null)))), /* @__PURE__ */ React.createElement(DetailDialog, { detail, close: () => setDetail(null), lang }));
}
function render() {
  return renderToString(/* @__PURE__ */ React.createElement(Portfolio, null));
}
export {
  render
};
