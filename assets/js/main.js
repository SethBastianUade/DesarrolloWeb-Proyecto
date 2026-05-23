/**
 * main.js  ·  Amor y Sanación
 * JavaScript propio del sitio
 *
 * Contenido:
 *   1. Navbar — efecto scroll
 *   2. Scroll Reveal — IntersectionObserver
 *   3. Contadores animados — jQuery $.animate() [ver nota pedagógica]
 *   4. Validación de formulario — HTML5 Constraint Validation + Bootstrap
 *   5. ScrollSpy — IntersectionObserver (resalta nav-link activo)
 *
 * Nota pedagógica sobre jQuery:
 *   Se utiliza jQuery 3.7.1 para dos funcionalidades específicas:
 *   a) $.animate() sobre propiedades de objetos JS (no CSS), que permite
 *      interpolar valores numéricos con easing sin requestAnimationFrame manual.
 *      Bootstrap 5 no provee esta utilidad.
 *   b) .fadeIn().delay().fadeOut() encadenado para mostrar el feedback
 *      del formulario de forma declarativa, demostrando el patrón de
 *      encadenamiento de métodos (method chaining) de jQuery.
 */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. NAVBAR — efecto al hacer scroll
══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  toggle(); // aplica al cargar si la página ya está scrolleada
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ══════════════════════════════════════════════════════════
   2. SCROLL REVEAL — IntersectionObserver
   Los elementos con clase .reveal aparecen al entrar al viewport
══════════════════════════════════════════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════════════════════
   3. CONTADORES ANIMADOS — jQuery $.animate()
   Interpola una propiedad numérica de un objeto JS con easing.
   Se dispara cuando el primer contador entra al viewport.
══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length || typeof jQuery === 'undefined') return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        observer.disconnect();

        counters.forEach(function (el) {
          const $el    = jQuery(el);
          const target = parseInt($el.data('target'), 10);

          /* jQuery: anima una propiedad de objeto JS (no CSS) con easing */
          jQuery({ val: 0 }).animate({ val: target }, {
            duration: 1800,
            easing: 'swing',
            step: function () { $el.text(Math.floor(this.val)); },
            complete: function () { $el.text(target); }
          });
        });
      }
    },
    { threshold: 0.6 }
  );

  observer.observe(counters[0]);
})();

/* ══════════════════════════════════════════════════════════
   4. VALIDACIÓN DE FORMULARIO
   Usa la API nativa Constraint Validation (HTML5) y las clases
   de Bootstrap .was-validated / .invalid-feedback.
   jQuery maneja el feedback visual post-envío.
══════════════════════════════════════════════════════════ */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = document.getElementById('btnLabel');
  const btnSpinner = document.getElementById('btnSpinner');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    /* Activa las clases de validación de Bootstrap */
    form.classList.add('was-validated');

    /* Verifica validez con la API nativa */
    if (!form.checkValidity()) {
      /* Accesibilidad: mueve el foco al primer campo inválido */
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Bloquea el botón y muestra spinner */
    submitBtn.disabled = true;
    if (btnLabel)   btnLabel.textContent = 'Enviando…';
    if (btnSpinner) btnSpinner.classList.remove('d-none');

    /* Simula envío asíncrono — en producción reemplazar con fetch() o $.ajax() */
    setTimeout(function () {
      if (submitBtn)  submitBtn.disabled = false;
      if (btnLabel)   btnLabel.textContent = 'Enviar mensaje';
      if (btnSpinner) btnSpinner.classList.add('d-none');

      form.reset();
      form.classList.remove('was-validated');

      /* jQuery: fadeIn + delay + fadeOut encadenados (method chaining) */
      if (typeof jQuery !== 'undefined') {
        const $msg = jQuery('#successMsg');
        $msg.removeClass('d-none')
            .hide()
            .fadeIn(400)
            .delay(5000)
            .fadeOut(600, function () {
              jQuery(this).addClass('d-none').show();
            });
      } else {
        /* Fallback sin jQuery */
        const msg = document.getElementById('successMsg');
        if (msg) {
          msg.classList.remove('d-none');
          setTimeout(() => msg.classList.add('d-none'), 6000);
        }
      }
    }, 1800);
  });
})();

/* ══════════════════════════════════════════════════════════
   5. SCROLLSPY — resalta el nav-link de la sección visible
   Solo aplica en páginas con secciones e id de navegación
══════════════════════════════════════════════════════════ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktopNav .nav-link[href*="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            /* Compara el fragmento del href con el id de la sección */
            const href = link.getAttribute('href');
            const isMatch = href === `#${entry.target.id}` ||
                            href.endsWith(`#${entry.target.id}`);
            link.classList.toggle('active', isMatch);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => observer.observe(sec));
})();
