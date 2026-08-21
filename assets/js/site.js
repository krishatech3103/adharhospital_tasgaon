(() => {
  const root = document.documentElement;
  const loader = document.querySelector('#site-loader');
  const header = document.querySelector('#site-header');
  const menuButton = document.querySelector('[data-nav-toggle]');
  const navigation = document.querySelector('#site-nav');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loaderStartedAt = window.__aadharLoaderStartedAt || performance.now();
  let loaderFinished = false;

  const finishLoader = () => {
    if (loaderFinished || !loader) return;
    loaderFinished = true;

    const minimumDuration = prefersReducedMotion ? 0 : 1500;
    const remainingTime = Math.max(0, minimumDuration - (performance.now() - loaderStartedAt));

    window.setTimeout(() => {
      loader.classList.add('is-complete');
      root.classList.remove('is-loading');
      window.setTimeout(() => loader.remove(), 430);
    }, remainingTime);
  };

  if (prefersReducedMotion) {
    finishLoader();
  } else {
    window.addEventListener('load', finishLoader, { once: true });
    window.setTimeout(finishLoader, 3200);
  }

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const closeNavigation = () => {
    if (!header || !menuButton) return;
    header.classList.remove('nav-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    header?.classList.toggle('nav-open', !isOpen);
  });

  navigation?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  document.querySelectorAll('.essentials-grid').forEach((grid) => {
    grid.removeAttribute('data-reveal');

    grid.querySelectorAll('.essential').forEach((card, index) => {
      card.setAttribute('data-reveal', '');
      if (index) card.dataset.delay = String(Math.min(index, 2));
    });
  });

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  const cardSelector = [
    '.link-card',
    '.step-card',
    '.essential',
    '.detail-card',
    '.intro-panel',
    '.callout-card',
    '.route-card',
    '.hours-table',
    '.phone-card'
  ].join(', ');

  revealItems.forEach((item) => {
    if (item.matches('.home-copy, .page-hero-inner')) {
      item.classList.add('reveal-copy');
    }

    if (item.matches(cardSelector)) {
      item.classList.add('reveal-card');
    }
  });

  if (!prefersReducedMotion && revealItems.length && 'IntersectionObserver' in window) {
    root.classList.add('motion-enabled');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -9% 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
})();
