/* ============================================================
   TAFTRI — Interaction layer
   Vanilla JS, no dependencies. Motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Navbar: stuck state + mobile menu ---------- */
  var nav = $('#nav');
  var burger = $('#burger');
  var menu = $('#navMenu');

  function onScrollNav() {
    nav.classList.toggle('is-stuck', window.scrollY > 30);
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  $$('a', menu).forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });

  /* ---------- Scroll progress + back to top ---------- */
  var progress = $('#progress');
  var backTop = $('#backTop');

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
    backTop.classList.toggle('is-visible', window.scrollY > 600);
    onScrollNav();
  }

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        window.setTimeout(function () { el.classList.add('is-revealed'); }, delay);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Counters ---------- */
  function formatValue(value, decimals) {
    return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  }

  function runCounter(el) {
    var raw = el.getAttribute('data-count');
    var target = parseFloat(raw);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (raw.split('.')[1] || '').length;

    if (reduceMotion) {
      el.textContent = prefix + formatValue(target, decimals) + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function tick(timestamp) {
      if (start === null) start = timestamp;
      var t = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + formatValue(target * eased, decimals) + suffix;
      if (t < 1) window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  var counters = $$('[data-count]');

  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- Hero mini chart ---------- */
  var chart = $('#chart');
  if (chart) {
    var heights = [22, 31, 27, 44, 39, 56, 61, 74, 68, 88, 100];
    heights.forEach(function (h) {
      var bar = document.createElement('i');
      bar.style.height = h + '%';
      chart.appendChild(bar);
    });
  }

  /* ---------- Hizmet indeksi: scrollspy + jump ---------- */
  var indexButtons = $$('.idx');
  var panels = $$('.svc');

  indexButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-target');
      var target = document.getElementById(id);
      if (!target) return;
      setActiveIndex(id);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  function setActiveIndex(id) {
    indexButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-target') === id);
    });
  }

  if (panels.length && 'IntersectionObserver' in window) {
    var panelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveIndex(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -55% 0px' });

    panels.forEach(function (panel) { panelObserver.observe(panel); });
  }

  /* ---------- Kart üzerinde ışık takibi ---------- */
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    panels.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
      });
    });
  }

  /* ---------- Nav scrollspy ---------- */
  var navLinks = $$('a[data-spy]', menu);
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------- SSS akordiyon ---------- */
  $$('.faq__item').forEach(function (item) {
    var trigger = $('.faq__q', item);
    var answer = $('.faq__a', item);

    trigger.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');

      $$('.faq__item.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        $('.faq__q', other).setAttribute('aria-expanded', 'false');
        $('.faq__a', other).setAttribute('aria-hidden', 'true');
      });

      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      answer.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
    });
  });

  /* ---------- İletişim formu ---------- */
  var form = $('#contactForm');
  var success = $('#formSuccess');

  var isEN = (document.documentElement.lang || 'tr').toLowerCase().indexOf('en') === 0;
  var MSG_INVALID = isEN ? 'Please enter a valid value.' : 'Geçerli bir değer girin.';
  var MSG_EMPTY = isEN ? 'Please fill in this field.' : 'Bu alanı doldurun.';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var invalid = $$('input[required], textarea[required]', form).filter(function (field) {
        return !field.value.trim() || !field.checkValidity();
      });

      $$('.field__error', form).forEach(function (msg) { msg.textContent = ''; });

      if (invalid.length) {
        invalid.forEach(function (field) {
          var msg = document.getElementById(field.id + '-error');
          if (msg) msg.textContent = field.value.trim() ? MSG_INVALID : MSG_EMPTY;
          field.setAttribute('aria-invalid', 'true');
        });
        invalid[0].focus();
        return;
      }

      $$('[aria-invalid]', form).forEach(function (field) { field.removeAttribute('aria-invalid'); });

      var endpoint = form.getAttribute('data-endpoint');
      var submitBtn = form.querySelector('button[type="submit"]');
      var errBox = document.getElementById('formError');
      if (errBox) errBox.hidden = true;

      if (!endpoint) { success.hidden = false; form.dispatchEvent(new CustomEvent('taftri:gonderildi')); form.reset(); success.focus(); return; }

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });
      payload._subject = isEN ? 'New message from taftri.com' : 'taftri.com sitesinden yeni ileti';
      payload._captcha = 'false';
      payload._template = 'table';

      var btnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = isEN ? 'Sending...' : 'Gönderiliyor...';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      }).then(function () {
        success.hidden = false;
        form.dispatchEvent(new CustomEvent('taftri:gonderildi'));
        form.reset();
        success.focus();
      })['catch'](function () {
        if (errBox) errBox.hidden = false;
      }).then(function () {
        if (submitBtn) {
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = btnHtml;
        }
      });
    });

    $$('input, textarea', form).forEach(function (field) {
      field.addEventListener('blur', function () {
        if (!field.hasAttribute('required')) return;
        var msg = document.getElementById(field.id + '-error');
        var ok = field.value.trim() && field.checkValidity();
        if (msg) msg.textContent = ok ? '' : (field.value.trim() ? MSG_INVALID : MSG_EMPTY);
        if (ok) field.removeAttribute('aria-invalid');
      });
    });
  }

  /* ============================================================
     DÖNÜŞÜM OLAYLARI (GA4 + Google Ads)
     Google Ads dönüşümü için AW_SEND_TO değerini doldurun:
     örnek: 'AW-1234567890/AbCdEfGhIjK'. Boşken yalnızca GA4'e gönderilir.
     ============================================================ */
  var AW_SEND_TO = '';

  function izle(olay, detay) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', olay, detay || {});
    if (AW_SEND_TO) window.gtag('event', 'conversion', { send_to: AW_SEND_TO, event_source: olay });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) izle('contact_whatsapp', { method: 'whatsapp' });
    else if (href.indexOf('tel:') === 0) izle('contact_phone', { method: 'phone' });
    else if (href.indexOf('mailto:') === 0) izle('contact_email', { method: 'email' });
  }, true);

  if (form) {
    form.addEventListener('taftri:gonderildi', function () {
      izle('generate_lead', { method: 'form', currency: 'TRY', value: 0 });
    });
  }

  /* ---------- Yıl ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ============================================================
     HAREKET KATMANI
     ============================================================ */

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Açılış perdesi ---------- */
  var curtain = $('#curtain');
  var isMobileWidth = window.matchMedia('(max-width: 767px)').matches;
  if (curtain) {
    if (reduceMotion || isMobileWidth) {
      curtain.remove();
    } else {
      var hideCurtain = function () {
        curtain.classList.add('is-done');
        window.setTimeout(function () { curtain.remove(); }, 700);
      };
      window.addEventListener('load', function () { window.setTimeout(hideCurtain, 620); });
      window.setTimeout(hideCurtain, 2600);
    }
  }

  /* ---------- Başlıkları kelimelere böl ---------- */
  function splitWords(root) {
    var counter = { i: 0 };

    function walk(node) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === 3) {
          var text = child.nodeValue;
          if (!text.trim()) return;
          var frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (!part.trim()) {
              frag.appendChild(document.createTextNode(part));
              return;
            }
            var span = document.createElement('span');
            span.className = 'word';
            span.style.setProperty('--i', counter.i++);
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains('word')) {
          walk(child);
        }
      });
    }

    walk(root);
  }

  if (!reduceMotion) {
    $$('[data-split]').forEach(splitWords);
  }

  /* ---------- Mıknatıs butonlar + dalga ---------- */
  $$('.magnetic').forEach(function (el) {
    if (finePointer && !reduceMotion) {
      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        var clamp = function (v, max) { return Math.max(-max, Math.min(max, v)); };
        var x = clamp((e.clientX - rect.left - rect.width / 2) * 0.2, 14);
        var y = clamp((e.clientY - rect.top - rect.height / 2) * 0.28, 10);
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    }

    el.addEventListener('pointerdown', function (e) {
      if (reduceMotion) return;
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      window.setTimeout(function () { ripple.remove(); }, 640);
    });
  });

  /* ---------- Kart eğilmesi ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(1100px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' +
          (px * 6).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- Parallax ---------- */
  var parallaxItems = $$('[data-parallax]');
  var parallaxTicking = false;

  function applyParallax() {
    var y = window.scrollY;
    parallaxItems.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
      el.style.setProperty('--py', (-y * speed).toFixed(1) + 'px');
      el.style.translate = '0 ' + (-y * speed).toFixed(1) + 'px';
    });
    parallaxTicking = false;
  }

  if (parallaxItems.length && !reduceMotion) {
    window.addEventListener('scroll', function () {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(applyParallax);
    }, { passive: true });
    applyParallax();
  }

  /* ---------- Özel imleç ---------- */
  var cursor = $('#cursor');
  var cursorDot = $('#cursorDot');

  if (cursor && finePointer && !reduceMotion) {
    document.body.classList.add('has-cursor');

    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var ring = { x: mouse.x, y: mouse.y };

    window.addEventListener('pointermove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursorDot.style.transform = 'translate(' + mouse.x + 'px,' + mouse.y + 'px)';
    }, { passive: true });

    (function loop() {
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;
      cursor.style.transform = 'translate(' + ring.x.toFixed(1) + 'px,' + ring.y.toFixed(1) + 'px)';
      window.requestAnimationFrame(loop);
    })();

    document.addEventListener('pointerover', function (e) {
      var hot = e.target.closest('a, button, .chip, .svc, .quote, .brand, .stat-card');
      cursor.classList.toggle('is-hot', !!hot);
    });
    window.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    window.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
    document.addEventListener('pointerleave', function () {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('pointerenter', function () {
      cursor.style.opacity = '';
      cursorDot.style.opacity = '';
    });
  } else if (cursor) {
    cursor.remove();
    if (cursorDot) cursorDot.remove();
  }
})();
