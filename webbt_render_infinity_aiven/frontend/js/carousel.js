/* VNVD / Vinaphone 5G hero banner carousel — scoped, self-contained */
(function () {
  'use strict';

  function initVnvdCarousel() {
    var AUTOPLAY_MS = 5000;

    var track = document.getElementById('vcTrack');
    var banner = document.getElementById('vnvdBanner');
    if (!track || !banner) return; // carousel not present on this page

    var slides = Array.prototype.slice.call(track.querySelectorAll('.vc-slide'));
    var prevBtn = document.getElementById('vcPrev');
    var nextBtn = document.getElementById('vcNext');
    var dotsWrap = document.getElementById('vcDots');
    var progress = document.getElementById('vcProgress');

    var index = 0;
    var timer = null;
    var count = slides.length;
    if (count === 0) return;

    // Build dash indicators
    var dots = [];
    for (var i = 0; i < count; i++) {
      var d = document.createElement('button');
      d.className = 'vc-dot';
      d.type = 'button';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      (function (n) {
        d.addEventListener('click', function () { goTo(n, true); });
      })(i);
      dotsWrap.appendChild(d);
      dots.push(d);
    }

    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      for (var j = 0; j < count; j++) {
        dots[j].classList.toggle('active', j === index);
        dots[j].setAttribute('aria-selected', j === index ? 'true' : 'false');
      }
    }

    function restartProgress() {
      if (!progress) return;
      progress.classList.remove('run');
      void progress.offsetWidth; // force reflow so the animation restarts
      progress.style.setProperty('--dur', AUTOPLAY_MS + 'ms');
      progress.classList.add('run');
    }

    function goTo(n, userAction) {
      index = (n + count) % count;
      render();
      if (userAction) restart();
      else restartProgress();
    }

    function next(userAction) { goTo(index + 1, userAction); }
    function prev(userAction) { goTo(index - 1, userAction); }

    function start() {
      stop();
      restartProgress();
      timer = setInterval(function () { next(false); }, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      if (progress) progress.classList.remove('run');
    }
    function restart() { start(); }

    // Controls
    if (nextBtn) nextBtn.addEventListener('click', function () { next(true); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(true); });

    // Keyboard (only when banner in view / focused area)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') next(true);
      else if (e.key === 'ArrowLeft') prev(true);
    });

    // Pause on hover / focus
    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', start);
    banner.addEventListener('focusin', stop);
    banner.addEventListener('focusout', start);

    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    // Touch / swipe
    var startX = 0, dragging = false;
    banner.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; dragging = true; stop();
    }, { passive: true });
    banner.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next(true) : prev(true); }
      else start();
    });

    // Init
    render();
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVnvdCarousel);
  } else {
    initVnvdCarousel();
  }
})();
