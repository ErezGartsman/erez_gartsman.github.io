'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var sidebarEl    = document.getElementById('sidebar');
  var hamburgerEl  = document.getElementById('hamburger');
  var overlayEl    = document.getElementById('sidebarOverlay');

  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('[data-nav-link]')
  );

  var pages = Array.prototype.slice.call(
    document.querySelectorAll('[data-page]')
  );

  var skillBars = Array.prototype.slice.call(
    document.querySelectorAll('.skill-fill')
  );

  var skillsAnimated = false;

  function activatePage(targetId) {
    var id = (targetId || '').trim().toLowerCase();

    pages.forEach(function (page) {
      if (page.dataset.page === id) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    navLinks.forEach(function (link) {
      var linkId = (link.getAttribute('data-nav-link') || '').trim().toLowerCase();
      if (linkId === id) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    var mainEl = document.getElementById('mainContent');
    if (mainEl) { mainEl.scrollTo({ top: 0, behavior: 'smooth' }); }

    if (id === 'resume') { animateSkillBars(); }

    closeSidebar();

    try { sessionStorage.setItem('eg-active-tab', id); } catch (err) {}
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var target = (this.getAttribute('data-nav-link') || '').trim().toLowerCase();
      activatePage(target);
    });
  });

  var savedTab = 'about';
  try { savedTab = sessionStorage.getItem('eg-active-tab') || 'about'; } catch (err) {}
  activatePage(savedTab);

  function animateSkillBars() {
    if (skillsAnimated) return; 
    skillsAnimated = true;
    skillBars.forEach(function (bar, i) {
      var target = bar.getAttribute('data-width') || '0';
      setTimeout(function () {
        bar.style.width = target + '%';
      }, 200 + i * 130);
    });
  }

  var resumeSection = document.querySelector('[data-page="resume"]');
  if (resumeSection && resumeSection.classList.contains('active')) {
    animateSkillBars();
  }

  function openSidebar() {
    if (!sidebarEl) return;
    sidebarEl.classList.add('open');
    if (hamburgerEl) {
      hamburgerEl.classList.add('open');
      hamburgerEl.setAttribute('aria-expanded', 'true');
    }
    if (overlayEl) { overlayEl.classList.add('show'); }
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebarEl) return;
    sidebarEl.classList.remove('open');
    if (hamburgerEl) {
      hamburgerEl.classList.remove('open');
      hamburgerEl.setAttribute('aria-expanded', 'false');
    }
    if (overlayEl) { overlayEl.classList.remove('show'); }
    document.body.style.overflow = '';
  }

  if (hamburgerEl) {
    hamburgerEl.addEventListener('click', function () {
      if (sidebarEl && sidebarEl.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlayEl) {
    overlayEl.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebarEl && sidebarEl.classList.contains('open')) {
      closeSidebar();
      if (hamburgerEl) { hamburgerEl.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) { closeSidebar(); }
  });

  if (window.matchMedia('(hover: hover)').matches) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        card.style.transform =
          'translateY(-7px) perspective(800px) ' +
          'rotateX(' + (dy * -4) + 'deg) ' +
          'rotateY(' + (dx * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
  var sbTrigger = document.getElementById('copy-email-trigger');
  if (sbTrigger) {
    sbTrigger.addEventListener('click', function () {
      copyEmail({ iconId: 'sb-email-icon', textId: 'sb-email-text', triggerId: 'copy-email-trigger', checkSize: 14 });
    });
  }

  var aboutTrigger = document.getElementById('about-copy-email-trigger');
  if (aboutTrigger) {
    aboutTrigger.addEventListener('click', function () {
      copyEmail({ iconId: 'about-email-icon', textId: 'about-email-text', triggerId: 'about-copy-email-trigger', checkSize: 20, colorIcon: true });
    });
  }
});

function copyEmail(opts) {
  var email       = 'erezkim1234@gmail.com';
  var iconEl      = document.getElementById(opts.iconId);
  var textEl      = document.getElementById(opts.textId);
  var triggerEl   = document.getElementById(opts.triggerId);
  var checkSize   = opts.checkSize || 14;

  if (!iconEl || !textEl || !triggerEl) return;

  var originalIcon = iconEl.innerHTML;
  var originalText = textEl.innerText;

  navigator.clipboard.writeText(email)
    .then(function () {
      iconEl.innerHTML = '<svg width="' + checkSize + '" height="' + checkSize + '" viewBox="0 0 24 24" fill="none" stroke="#7dd9a8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      iconEl.style.borderColor = '#7dd9a8';
      if (opts.colorIcon) iconEl.style.color = '#7dd9a8';
      textEl.innerText       = 'Copied!';
      textEl.style.color     = '#7dd9a8';
      textEl.style.fontWeight= '700';
      triggerEl.style.pointerEvents = 'none';

      setTimeout(function () {
        iconEl.innerHTML  = originalIcon;
        iconEl.style.borderColor  = '';
        if (opts.colorIcon) iconEl.style.color = '';
        textEl.innerText        = originalText;
        textEl.style.color      = '';
        textEl.style.fontWeight = '';
        triggerEl.style.pointerEvents = 'auto';
      }, 2500);
    })
    .catch(function () {
      triggerEl.style.pointerEvents = 'none';
      textEl.style.color = 'var(--clr-accent)';
      textEl.innerText = 'Press Ctrl+C';
      setTimeout(function () {
        textEl.innerText = originalText;
        textEl.style.color = '';
        triggerEl.style.pointerEvents = 'auto';
      }, 2500);
    });
}
