/*
  main.js - Amor y Sanación
  Scripts propios del sitio.

  Lo que hace este archivo:
    1. Navbar con efecto al hacer scroll
    2. Aparicion de las secciones al scrollear (IntersectionObserver)
    3. Contadores animados (con jQuery .animate())
    4. Validacion del formulario de contacto
    5. ScrollSpy: marca el link de la seccion que se esta viendo

  Sobre el uso de jQuery:
  Usamos jQuery 3.7.1 nada mas que para dos cosas puntuales:
    - animar los numeros de los contadores con $.animate(), que permite
      animar un valor con easing (Bootstrap 5 no trae algo asi).
    - mostrar y ocultar el mensaje de "enviado" del formulario encadenando
      fadeIn().delay().fadeOut().
  Todo el resto del sitio usa JavaScript puro. La justificacion del aporte
  de jQuery tambien esta en el anexo Uso_de_IA del trabajo.
*/

'use strict';

/* 1. Navbar - efecto al hacer scroll */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  toggle(); // por si la pagina ya esta scrolleada al cargar
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* 2. Scroll reveal - las secciones con .reveal aparecen al entrar a la pantalla */
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

/* 3. Contadores animados - usamos jQuery .animate() para animar el numero */
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

          /* jQuery anima la propiedad val de un objeto con easing */
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

/* 4. Validacion del formulario de contacto
   Usa la validacion nativa de HTML5 (checkValidity) junto con las clases
   .was-validated / .invalid-feedback de Bootstrap. */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = document.getElementById('submitBtn');
  const btnLabel   = document.getElementById('btnLabel');
  const btnSpinner = document.getElementById('btnSpinner');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    /* activa los estilos de validacion de Bootstrap */
    form.classList.add('was-validated');

    /* chequea si el formulario es valido con la API nativa */
    if (!form.checkValidity()) {
      /* manda el foco al primer campo invalido (accesibilidad) */
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* desactiva el boton y muestra el spinner mientras "envia" */
    submitBtn.disabled = true;
    if (btnLabel)   btnLabel.textContent = 'Enviando…';
    if (btnSpinner) btnSpinner.classList.remove('d-none');

    /* simulamos el envio con un setTimeout.
       Para produccion habria que reemplazarlo por fetch() o $.ajax(). */
    setTimeout(function () {
      if (submitBtn)  submitBtn.disabled = false;
      if (btnLabel)   btnLabel.textContent = 'Enviar mensaje';
      if (btnSpinner) btnSpinner.classList.add('d-none');

      form.reset();
      form.classList.remove('was-validated');

      /* jQuery: encadenamos fadeIn + delay + fadeOut para el mensaje de exito */
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
        /* por si no llega a cargar jQuery */
        const msg = document.getElementById('successMsg');
        if (msg) {
          msg.classList.remove('d-none');
          setTimeout(() => msg.classList.add('d-none'), 6000);
        }
      }
    }, 1800);
  });
})();

/* 5. ScrollSpy - resalta el link de la seccion que se esta viendo
   Solo aplica en paginas que tienen secciones con id. */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#desktopNav .nav-link[href*="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            /* compara el #ancla del link con el id de la seccion */
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
