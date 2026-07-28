document.addEventListener('DOMContentLoaded', () => {

  /* ---- Lucide icons ---- */
  if (window.lucide) lucide.createIcons();

  /* ---- Particles background (lightweight floating dots) ---- */
  (function initParticles() {
    const wrap = document.getElementById('particles-bg');
    if (!wrap) return;
    const count = window.innerWidth < 700 ? 12 : 26;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      const size = 2 + Math.random() * 3;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + 'vw';
      dot.style.top = Math.random() * 100 + 'vh';
      dot.style.animationDuration = (10 + Math.random() * 10) + 's';
      dot.style.animationDelay = (Math.random() * 6) + 's';
      wrap.appendChild(dot);
    }
  })();

  /* ---- Navbar scroll shadow ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  /* ---- Mobile dropdown toggles (tap to expand submenus) ---- */
  document.querySelectorAll('.nav-item.dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        link.closest('.dropdown').classList.toggle('open');
      }
    });
  });

  /* ---- Close mobile menu after clicking a link ---- */
  document.querySelectorAll('.nav-links a:not(.nav-link)').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  /* ---- Smooth scroll offset for in-page anchors (navbar height) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 110; /* 2-tầng header: top-bar ~56px + nav-bar ~46px */
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Animated number counters ---- */
  function animateCounter(el, target, duration = 1800) {
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString('vi-VN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('vi-VN');
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObserver.observe(el));

  /* ---- Scroll-reveal for cards / steps ---- */
  const revealEls = document.querySelectorAll('[data-delay]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay'), 10) || 0;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Contact form submission (demo only, no backend) ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess?.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess?.classList.remove('show'), 5000);
    });
  }

});
