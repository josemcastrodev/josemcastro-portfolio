(() => {
  const main = document.querySelector('#main');
  const scenes = [...document.querySelectorAll('.landing-scene')];
  if (!main || scenes.length === 0) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-nav .nav-links');
  const labels = document.documentElement.lang === 'en'
    ? ['Introduction', 'Solutions', 'Process', 'Contact']
    : ['Inicio', 'Soluciones', 'Proceso', 'Contacto'];
  const cleanRoutes = {
    '/desarrollo-web-alcobendas.html': '/desarrollo-web-alcobendas',
    '/en/web-developer-alcobendas.html': '/en/web-developer-alcobendas',
  };
  const cleanPath = cleanRoutes[location.pathname] || location.pathname;

  if (cleanPath !== location.pathname) {
    history.replaceState(history.state, '', `${cleanPath}${location.search}${location.hash}`);
  }
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${location.origin}${cleanPath}`);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${location.origin}${cleanPath}`);
  document.querySelector('link[hreflang="es"]')?.setAttribute('href', `${location.origin}/desarrollo-web-alcobendas`);
  document.querySelector('link[hreflang="en"]')?.setAttribute('href', `${location.origin}/en/web-developer-alcobendas`);
  document.querySelector('link[hreflang="x-default"]')?.setAttribute('href', `${location.origin}/desarrollo-web-alcobendas`);

  const pagination = document.createElement('nav');
  pagination.className = 'scene-pagination';
  pagination.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Page sections' : 'Secciones de la página');
  const links = scenes.map((scene, index) => {
    if (!scene.id) scene.id = `scene-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${scene.id}`;
    link.setAttribute('aria-label', labels[index] || `${index + 1}`);
    link.append(document.createElement('span'));
    pagination.append(link);
    return link;
  });
  document.body.append(pagination);

  const closeMenu = () => {
    menu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-label', document.documentElement.lang === 'en' ? 'Open menu' : 'Abrir menú');
  };

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu?.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open
      ? (document.documentElement.lang === 'en' ? 'Close menu' : 'Cerrar menú')
      : (document.documentElement.lang === 'en' ? 'Open menu' : 'Abrir menú'));
  });
  menu?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  let currentIndex = Math.max(0, scenes.findIndex(scene => scene.id === location.hash.slice(1)));
  let busy = false;
  let wheelSum = 0;
  let lastWheel = 0;
  let unlockAt = 0;
  let transitionAnimations = [];
  let transitionId = 0;

  const setActive = index => {
    currentIndex = index;
    scenes.forEach((scene, sceneIndex) => {
      const active = sceneIndex === index;
      scene.classList.toggle('is-active', active);
      scene.setAttribute('aria-hidden', String(!active));
      scene.inert = !active && desktop.matches;
      if (active) links[sceneIndex].setAttribute('aria-current', 'page');
      else links[sceneIndex].removeAttribute('aria-current');
    });
  };

  const exposeMobileScenes = () => {
    scenes.forEach(scene => {
      scene.inert = false;
      scene.removeAttribute('aria-hidden');
    });
  };

  const setup = () => {
    transitionId += 1;
    transitionAnimations.forEach(animation => animation.cancel());
    transitionAnimations = [];
    busy = false;
    wheelSum = 0;

    if (desktop.matches) {
      main.scrollTop = 0;
      scenes.forEach(scene => {
        scene.style.visibility = 'hidden';
        scene.style.opacity = '0';
        scene.style.transform = 'translateY(0) scale(1)';
        scene.style.zIndex = '0';
        scene.style.pointerEvents = 'none';
      });
      setActive(currentIndex);
      const active = scenes[currentIndex];
      active.style.visibility = 'visible';
      active.style.opacity = '1';
      active.style.zIndex = '1';
      active.style.pointerEvents = 'auto';
    } else {
      scenes.forEach(scene => {
        scene.removeAttribute('style');
        scene.inert = false;
        scene.removeAttribute('aria-hidden');
      });
      main.scrollTop = currentIndex * main.clientHeight;
      setActive(currentIndex);
    }
  };

  const navigate = index => {
    if (index < 0 || index >= scenes.length || index === currentIndex || busy) return;
    const outgoing = scenes[currentIndex];
    const incoming = scenes[index];
    const direction = index > currentIndex ? 1 : -1;
    const duration = reducedMotion.matches ? 1 : 1000;
    const easing = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';

    if (!desktop.matches) {
      setActive(index);
      main.scrollTo({ top: index * main.clientHeight, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      return;
    }

    busy = true;
    wheelSum = 0;
    incoming.style.visibility = 'visible';
    incoming.style.opacity = '1';
    incoming.style.zIndex = '2';
    incoming.style.pointerEvents = 'auto';
    outgoing.style.zIndex = '1';
    outgoing.style.pointerEvents = 'none';
    setActive(index);
    const id = ++transitionId;
    transitionAnimations = [
      incoming.animate([
        { transform: `translateY(${direction * 100}%) scale(1)` },
        { transform: 'translateY(0) scale(1)' },
      ], { duration, easing, fill: 'forwards' }),
      outgoing.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(${-direction * 12}%) scale(0.96)`, opacity: 0.45 },
      ], { duration, easing, fill: 'forwards' }),
    ];

    Promise.all(transitionAnimations.map(animation => animation.finished.catch(() => null))).then(() => {
      if (id !== transitionId) return;
      outgoing.style.visibility = 'hidden';
      outgoing.style.opacity = '0';
      outgoing.style.zIndex = '0';
      outgoing.style.transform = 'translateY(0) scale(1)';
      incoming.style.opacity = '1';
      incoming.style.zIndex = '1';
      incoming.style.transform = 'translateY(0) scale(1)';
      transitionAnimations.forEach(animation => animation.cancel());
      transitionAnimations = [];
      busy = false;
      unlockAt = performance.now() + 90;
    });
  };

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible && !desktop.matches) setActive(scenes.indexOf(visible.target));
  }, { root: main, threshold: [0.55, 0.8] });

  scenes.forEach(scene => observer.observe(scene));
  setup();
  desktop.addEventListener('change', setup);

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const targetIndex = scenes.findIndex(scene => `#${scene.id}` === anchor.getAttribute('href'));
    if (targetIndex < 0) return;
    event.preventDefault();
    closeMenu();
    navigate(targetIndex);
    const hash = targetIndex === 0 ? '' : `#${scenes[targetIndex].id}`;
    history.replaceState(history.state, '', `${cleanPath}${location.search}${hash}`);
  });

  main.addEventListener('wheel', event => {
    if (!desktop.matches || event.ctrlKey || document.querySelector('dialog[open]') || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest('textarea')) return;
    event.preventDefault();
    const now = performance.now();
    if (busy || now < unlockAt) {
      wheelSum = 0;
      lastWheel = now;
      return;
    }
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1);
    if (now - lastWheel > 260 || Math.sign(delta) !== Math.sign(wheelSum)) wheelSum = 0;
    wheelSum += delta;
    lastWheel = now;
    if (Math.abs(wheelSum) >= 75) {
      navigate(currentIndex + Math.sign(wheelSum));
      wheelSum = 0;
    }
  }, { passive: false });

  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"], dialog')) return;
    if (event.key === ' ' && event.target.closest('button, a, summary')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(event.key);
    const up = ['ArrowUp', 'PageUp'].includes(event.key);
    if (down || up || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (event.key === 'Home') navigate(0);
      else if (event.key === 'End') navigate(scenes.length - 1);
      else navigate(currentIndex + (down ? 1 : -1));
    }
    if (event.key === 'Escape') closeMenu();
  });

  const faq = document.querySelector('.faq');
  let accordionBusy = false;
  const animateAnswer = (details, open) => {
    const answer = details.querySelector(':scope > p');
    if (!answer || reducedMotion.matches) {
      details.open = open;
      return Promise.resolve();
    }
    if (open) details.open = true;
    const fromHeight = open ? 0 : answer.getBoundingClientRect().height;
    const toHeight = open ? answer.scrollHeight : 0;
    answer.style.overflow = 'hidden';
    const animation = answer.animate([
      { height: `${fromHeight}px`, opacity: open ? 0 : 1, transform: `translateY(${open ? -8 : 0}px)` },
      { height: `${toHeight}px`, opacity: open ? 1 : 0, transform: `translateY(${open ? 0 : -8}px)` },
    ], { duration: open ? 480 : 340, easing: 'cubic-bezier(0.22, 0.68, 0.2, 1)' });
    return animation.finished.catch(() => null).then(() => {
      if (!open) details.open = false;
      answer.style.removeProperty('overflow');
    });
  };

  faq?.querySelectorAll('details').forEach(details => {
    details.querySelector('summary')?.addEventListener('click', async event => {
      event.preventDefault();
      if (accordionBusy) return;
      accordionBusy = true;
      try {
        if (details.open) {
          await animateAnswer(details, false);
        } else {
          const closing = [...faq.querySelectorAll('details[open]')]
            .map(openDetails => animateAnswer(openDetails, false));
          await Promise.all(closing);
          await animateAnswer(details, true);
        }
      } finally {
        accordionBusy = false;
      }
    });
  });

  window.addEventListener('pagehide', () => {
    observer.disconnect();
    desktop.removeEventListener('change', setup);
    transitionAnimations.forEach(animation => animation.cancel());
  }, { once: true });
})();
