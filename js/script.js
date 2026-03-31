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

});

function copyEmailToClipboard() {
  const email = "erezkim1234@gmail.com";
  const iconSpan = document.getElementById("sb-email-icon");
  const textSpan = document.getElementById("sb-email-text");
  const trigger = document.getElementById("copy-email-trigger");

  const originalIcon = iconSpan.innerHTML;
  const originalText = textSpan.innerText;

  navigator.clipboard.writeText(email).then(() => {
    iconSpan.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7dd9a8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    iconSpan.style.borderColor = "#7dd9a8";
    textSpan.innerText = "Copied!";
    textSpan.style.color = "#7dd9a8";
    textSpan.style.fontWeight = "700";

    trigger.style.pointerEvents = "none";

    setTimeout(() => {
      iconSpan.innerHTML = originalIcon;
      iconSpan.style.borderColor = "";
      textSpan.innerText = originalText;
      textSpan.style.color = "";
      textSpan.style.fontWeight = "";
      trigger.style.pointerEvents = "auto";
    }, 2500);
  }).catch(function () {
    trigger.style.pointerEvents = 'none';
    textSpan.style.color = 'var(--clr-accent)';
    textSpan.innerText = 'Press Ctrl+C';
    setTimeout(() => {
      textSpan.innerText = originalText;
      textSpan.style.color = '';
      trigger.style.pointerEvents = 'auto';
    }, 2500);
  });
}

function copyAboutEmailToClipboard() {
  const email = "erezkim1234@gmail.com";
  const iconBox = document.getElementById("about-email-icon");
  const textSpan = document.getElementById("about-email-text");
  const trigger = document.getElementById("about-copy-email-trigger");

  const originalIcon = iconBox.innerHTML;
  const originalText = textSpan.innerText;

  navigator.clipboard.writeText(email).then(() => {
    iconBox.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd9a8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    iconBox.style.borderColor = "#7dd9a8";
    iconBox.style.color = "#7dd9a8";
    
    textSpan.innerText = "Copied!";
    textSpan.style.color = "#7dd9a8";
    textSpan.style.fontWeight = "700";

    trigger.style.pointerEvents = "none";

    setTimeout(() => {
      iconBox.innerHTML = originalIcon;
      iconBox.style.borderColor = "";
      iconBox.style.color = "";
      textSpan.innerText = originalText;
      textSpan.style.color = "";
      textSpan.style.fontWeight = "";
      trigger.style.pointerEvents = "auto";
    }, 2500);
  }).catch(function () {
    trigger.style.pointerEvents = 'none';
    textSpan.style.color = 'var(--clr-accent)';
    textSpan.innerText = 'Press Ctrl+C';
    setTimeout(() => {
      textSpan.innerText = originalText;
      textSpan.style.color = '';
      trigger.style.pointerEvents = 'auto';
    }, 2500);
  });
}
