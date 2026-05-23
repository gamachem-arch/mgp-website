/* MGP Media — Main JS */

/* ── Matterport 3D tour modal ── */
(function matterportModal() {
  const TOUR_SRC = 'https://my.matterport.com/show/?m=xyJqvXrU53P';
  const overlay  = document.getElementById('matterportModal');
  if (!overlay) return;
  const iframe   = overlay.querySelector('iframe');
  const closeBtn = overlay.querySelector('.modal-close');

  function open() {
    iframe.src = TOUR_SRC;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-matterport]').forEach(el => {
    el.addEventListener('click', open);
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── Splash intro animation ── */
(function splashIntro() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const heroContent = document.querySelector('.hero-content');
  const heroDots    = document.querySelector('.hero-dots');

  function skipSplash() {
    splash.remove();
    if (heroContent) heroContent.style.opacity = '1';
    if (heroDots)    heroDots.style.opacity    = '1';
  }

  // Only play once per browser session
  if (sessionStorage.getItem('mgp-splash-seen')) {
    skipSplash();
    return;
  }

  if (typeof lottie === 'undefined') { skipSplash(); return; }

  if (heroContent) heroContent.style.opacity = '0';
  if (heroDots)    heroDots.style.opacity    = '0';

  const anim = lottie.loadAnimation({
    container: document.getElementById('splash-lottie'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: 'images/logo-animation.json'
  });

  anim.addEventListener('complete', () => {
    sessionStorage.setItem('mgp-splash-seen', '1');
    splash.classList.add('fade-out');
    splash.addEventListener('transitionend', () => splash.remove(), { once: true });

    const fadeIn = 'opacity 0.6s ease';
    if (heroContent) { heroContent.style.transition = fadeIn; heroContent.style.opacity = '1'; }
    if (heroDots)    { heroDots.style.transition    = fadeIn; heroDots.style.opacity    = '1'; }
  });
})();

/* ── Hero auto-advancing slider ── */
(function heroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  if (!slides.length) return;

  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function start() { timer = setInterval(next, 5000); }
  function stop() { clearInterval(timer); }

  start();

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
  }
})();

/* ── Services tabs ── */
(function serviceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('tab-' + target);
      if (pane) pane.classList.add('active');
    });
  });
})();

/* ── Generic image slider (photo & drone tabs) ── */
(function initSliders() {
  document.querySelectorAll('.tab-slider').forEach(sliderEl => {
    const id = sliderEl.id;
    const slides = sliderEl.querySelectorAll('.tab-slide');
    const wrap = sliderEl.closest('.tab-slider-wrap');
    const prevBtn = wrap ? wrap.querySelector('.slider-prev') : null;
    const nextBtn = wrap ? wrap.querySelector('.slider-next') : null;
    const dotsWrap = wrap ? wrap.querySelector('.slider-dots') : null;
    if (!slides.length) return;

    let current = 0;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
      slides[current].classList.remove('active');
      if (dotsWrap) dotsWrap.children[current].classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dotsWrap) dotsWrap.children[current].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
  });
})();

/* ── Mobile nav hamburger ── */
(function mobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
})();

/* ── Back to top button ── */
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Active nav link on scroll ── */
(function activeNavLink() {
  const sections = ['home', 'services', 'pricing'];
  const links = document.querySelectorAll('.nav-link[href^="#"]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.style.opacity = l.getAttribute('href') === '#' + id ? '1' : '0.85';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ── Portfolio toggle (portfolio.html only) ── */
(function portfolioToggle() {
  const photoBtn = document.getElementById('showPhotos');
  const videoBtn = document.getElementById('showVideos');
  const photoGrid = document.getElementById('photoGrid');
  const videoList = document.getElementById('videoList');
  if (!photoBtn) return;

  photoBtn.addEventListener('click', () => {
    photoGrid.classList.toggle('visible');
    videoList.classList.remove('visible');
  });

  if (videoBtn) {
    videoBtn.addEventListener('click', () => {
      videoList.classList.toggle('visible');
      photoGrid.classList.remove('visible');
    });
  }
})();

/* ── Lightbox ── */
(function lightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const img = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');

  let items = [];
  let currentIdx = 0;

  function open(idx) {
    currentIdx = (idx + items.length) % items.length;
    img.src = items[currentIdx].dataset.src || items[currentIdx].querySelector('img').src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }

  function refresh() {
    items = [...document.querySelectorAll('.portfolio-item')];
    items.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
    });
  }

  refresh();

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', () => open(currentIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => open(currentIdx + 1));

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(currentIdx - 1);
    if (e.key === 'ArrowRight') open(currentIdx + 1);
  });
})();
