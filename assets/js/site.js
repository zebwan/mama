/* Nelfar Zulkifli — interactions
   Reproduces the reference template's observable behaviour with
   IntersectionObserver + CSS transitions. No dependencies. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- nav */
  function initNav() {
    var burger = document.querySelector('.burger');
    var drawer = document.querySelector('.drawer');
    if (!burger || !drawer) return;

    var panel = drawer.querySelector('.drawer__panel');
    var backdrop = drawer.querySelector('.drawer__backdrop');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      // reflow, not rAF: a throttled tab never runs the callback and the panel
      // would stay off-screen with the backdrop already blocking the page
      void drawer.offsetWidth;
      drawer.classList.add('is-in');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      var first = panel.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      drawer.classList.remove('is-in');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      window.setTimeout(function () { drawer.classList.remove('is-open'); }, 280);
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-in') ? close() : open();
    });
    if (backdrop) backdrop.addEventListener('click', close);
    var closeBtn = drawer.querySelector('.drawer__close');
    if (closeBtn) closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-in')) close();
    });
    // close when a link is followed
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
  }

  /* --------------------------------------------------------- top bar bg */
  function initTopbar() {
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var tick = function () {
      bar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
  }

  /* ------------------------------------------------------ hero entrance */
  function initHero() {
    // Case-study pages have no .hero, but they do carry .word / .enter on the
    // title and standfirst. Without a fallback scope those stay at opacity 0
    // and the page renders with no heading at all.
    var hero = document.querySelector('.hero') || document.querySelector('.main');
    if (!hero) return;

    if (reduced) {
      hero.querySelectorAll('.enter, .word').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var words = hero.querySelectorAll('.word');
    words.forEach(function (w, i) { w.style.setProperty('--d', 120 + i * 40); });

    // sequence the non-word elements after the headline
    var tail = hero.querySelectorAll('.enter');
    tail.forEach(function (el) {
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', 0);
    });

    requestAnimationFrame(function () {
      hero.querySelectorAll('.enter, .word').forEach(function (el) { el.classList.add('is-in'); });
    });
  }

  /* ------------------------------------------------------ scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------- marquees */
  function initMarquees() {
    document.querySelectorAll('.marquee').forEach(function (m) {
      var track = m.querySelector('.marquee__track');
      if (!track || track.dataset.cloned) return;
      // duplicate content once so translateX(-50%) loops seamlessly
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = '1';
    });
  }

  /* ------------------------------------------- track-record arrow nudge */
  function initMarqueeNav() {
    var nav = document.querySelector('.marq-nav');
    var marquee = document.querySelector('#track .marquee');
    if (!nav || !marquee) return;

    var track = marquee.querySelector('.marquee__track');
    var offset = 0;
    var CARD = 346; // 334 card + 12 gap, measured from the reference
    var resume;

    function nudge(dir) {
      offset += dir * CARD;
      track.style.animationPlayState = 'paused';
      track.style.transition = 'transform 500ms cubic-bezier(.22,1,.36,1)';
      var base = getComputedStyle(track).transform;
      var current = 0;
      if (base && base !== 'none') {
        var m = base.match(/matrix\(([^)]+)\)/);
        if (m) current = parseFloat(m[1].split(',')[4]) || 0;
      }
      track.style.transform = 'translateX(' + (current + dir * -CARD) + 'px)';
      window.clearTimeout(resume);
      resume = window.setTimeout(function () {
        track.style.transition = '';
        track.style.transform = '';
        track.style.animationPlayState = '';
      }, 3000);
    }

    nav.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        nudge(b.dataset.dir === 'prev' ? -1 : 1);
      });
    });
  }

  /* ----------------------------------------------------------- counters */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var dec = (el.dataset.decimals | 0);

      if (reduced) {
        el.textContent = prefix + target.toFixed(dec) + suffix;
        return;
      }
      var dur = 1600, start = null, done = false;
      function settle() {
        if (done) return;
        done = true;
        el.textContent = prefix + target.toFixed(dec) + suffix;
      }
      function frame(ts) {
        if (done) return;
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        if (p >= 1) { settle(); return; }
        var eased = 1 - Math.pow(2, -10 * p); // easeOutExpo
        el.textContent = prefix + (target * eased).toFixed(dec) + suffix;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      // rAF is paused while the tab is hidden; guarantee the final value regardless
      window.setTimeout(settle, dur + 150);
    }

    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- mail form */
  function initForm() {
    var form = document.querySelector('form[data-mailto]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var to = form.dataset.mailto;
      var name = (form.elements.name.value || '').trim();
      var email = (form.elements.email.value || '').trim();
      var msg = (form.elements.message.value || '').trim();
      var subject = 'Website enquiry' + (name ? ' from ' + name : '');
      var body = msg + '\n\n—\n' + name + (email ? '\n' + email : '');
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ----------------------------------------------------------- gallery */
  /* Autoplaying clips are a decoration, not the content: honour reduced
     motion, and never let a clip run while it is off screen. */
  function initClips() {
    var clips = document.querySelectorAll('video[data-autoloop]');
    if (!clips.length) return;

    // The markup ships with `controls` so the clip is still playable with
    // JavaScript off. Only take them away once we can drive playback ourselves.
    if (reduced || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var p = e.target.play();
          if (p && p.catch) p.catch(function () { e.target.setAttribute('controls', ''); });
        } else {
          e.target.pause();
        }
      });
    }, { threshold: 0.25 });

    clips.forEach(function (v) {
      v.removeAttribute('controls');
      io.observe(v);
    });
  }

  /* ------------------------------------------------------ highlight reel */
  function initReel() {
    var track = document.querySelector('[data-reel-track]');
    if (!track) return;

    var bar = document.querySelector('[data-reel-bar]');
    var prev = document.querySelector('[data-reel="prev"]');
    var next = document.querySelector('[data-reel="next"]');
    var item = track.querySelector('.reel__item');

    function step() {
      // one card plus the gap, measured rather than assumed, so the card width
      // can stay a clamp() in the stylesheet
      if (!item) return 300;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 12;
      return item.getBoundingClientRect().width + gap;
    }

    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) {
        // the thumb represents how much of the strip is on screen
        var visible = track.clientWidth / track.scrollWidth;
        bar.style.width = Math.max(visible, 0.08) * 100 + '%';
        bar.style.transform = 'translateX(' + (p * (100 / Math.max(visible, 0.08) - 100)) + '%)';
      }
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    }

    // Assign scrollLeft rather than calling scrollBy, and let the stylesheet's
    // scroll-behavior animate it. scrollBy with an options object is the more
    // fragile of the two and does nothing at all in some headless engines.
    function nudge(dir) {
      if (reduced) track.style.scrollBehavior = 'auto';
      var max = track.scrollWidth - track.clientWidth;
      var to = track.scrollLeft + dir * step();
      track.scrollLeft = to < 0 ? 0 : (to > max ? max : to);
      sync();
    }
    if (prev) prev.addEventListener('click', function () { nudge(-1); });
    if (next) next.addEventListener('click', function () { nudge(1); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  }

  /* --------------------------------------------------------- parallax */
  /* Each .gal__par is 114% of its frame, so shifting it up to ±7% keeps the
     frame covered while the image drifts against the page as you scroll. */
  function initParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll('.gal__par'));
    if (!layers.length || reduced) return;

    var live = [];
    var ticking = false;

    function paint() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < live.length; i++) {
        var el = live[i];
        var r = el.parentNode.getBoundingClientRect();
        // -1 when the frame is just below the fold, 1 when it is just above
        var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        if (p < -1) p = -1; else if (p > 1) p = 1;
        el.style.transform = 'translate3d(0,' + (p * -6).toFixed(2) + '%,0)';
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(paint);
    }

    if (!('IntersectionObserver' in window)) return;
    // only frames on screen are measured, so a 28-image page still costs
    // a handful of reads per frame rather than 28
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var at = live.indexOf(e.target);
        if (e.isIntersecting && at === -1) live.push(e.target);
        else if (!e.isIntersecting && at !== -1) live.splice(at, 1);
      });
      paint();
    }, { rootMargin: '10% 0px' });

    layers.forEach(function (el) { io.observe(el); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  }

  /* --------------------------------------------------------- lightbox */
  function initLightbox() {
    var frames = Array.prototype.slice.call(document.querySelectorAll('[data-zoom]'));
    var lb = document.querySelector('.lb');
    if (!frames.length || !lb) return;

    var stage = lb.querySelector('.lb__stage');
    var capEl = lb.querySelector('.lb__cap');
    var index = 0;
    var lastFocus = null;

    function render() {
      var frame = frames[index];
      var img = frame.querySelector('img');
      var cap = frame.closest('.gal__item');
      cap = cap ? cap.querySelector('.gal__cap') : null;
      stage.innerHTML = '';
      var big = new Image();
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || '';
      stage.appendChild(big);
      capEl.innerHTML = cap ? cap.innerHTML : '';
    }

    function open(i) {
      index = i;
      lastFocus = document.activeElement;
      render();
      lb.classList.add('is-open');
      // commit the closed state before the open one, so the transition has a
      // start frame. A reflow does this synchronously; rAF does not fire at all
      // in a throttled tab, which would leave the viewer open but invisible.
      void lb.offsetWidth;
      lb.classList.add('is-in');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb__btn').focus();
    }
    function close() {
      lb.classList.remove('is-in');
      document.body.style.overflow = '';
      window.setTimeout(function () {
        lb.classList.remove('is-open');
        stage.innerHTML = '';
      }, 260);
      if (lastFocus) lastFocus.focus();
    }
    function step(dir) {
      index = (index + dir + frames.length) % frames.length;
      render();
    }

    frames.forEach(function (frame, i) {
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('role', 'button');
      frame.setAttribute('aria-label', 'Open image');
      frame.addEventListener('click', function () { open(i); });
      frame.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector('.lb__btn').addEventListener('click', close);
    lb.querySelector('.lb__backdrop').addEventListener('click', close);
    lb.querySelector('.lb__nav--prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb__nav--next').addEventListener('click', function () { step(1); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-in')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ------------------------------------------------------ stagger index */
  function initStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty('--i', i);
      });
    });
  }

  function boot() {
    initStagger();
    initNav();
    initTopbar();
    initMarquees();
    initMarqueeNav();
    initReveal();
    initCounters();
    initForm();
    initClips();
    initReel();
    initLightbox();
    initParallax();
    initHero();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
