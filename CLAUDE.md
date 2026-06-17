# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

Landing page **"Amor y Sanación"** — bienestar integral / terapias holísticas en San Andrés (Gral. San Martín, Buenos Aires). Es un **proyecto demo** dentro de `Web-Clientes/Web-Demos/`. El copy del cliente es real pero los contactos son placeholders (WhatsApp "Próximamente", `wa.me/` sin número, email `hola@amorysanacion.com`).

Repo git independiente. El workspace padre tiene `AGENTS.md` y `CLAUDE.md` con convenciones generales — léelos, pero ver la excepción de stack abajo.

## Excepción de stack importante

El `CLAUDE.md` del workspace prohíbe Bootstrap/jQuery/frameworks. **Este proyecto es la excepción deliberada**: usa **Bootstrap 5.3.8** y **jQuery 3.7.1** por CDN a propósito, con fines pedagógicos (demostrar Constraint Validation + clases de Bootstrap, `$.animate()` y method chaining de jQuery). Ver la "Nota pedagógica" al inicio de `assets/js/main.js`.

**No elimines Bootstrap ni jQuery de este proyecto** pensando que violan las reglas del workspace — acá son intencionales. Si tocás `main.js`, mantené el fallback sin jQuery que ya existe en el handler del formulario.

## Comandos

No hay build, lint ni tests. Es HTML/CSS/JS estático.

```powershell
python -m http.server      # previsualizar en http://localhost:8000
# o
npx serve .
```

Servir desde la raíz del proyecto para que las rutas relativas resuelvan bien.

## Arquitectura

Sitio multi-página, mobile-first. **Todo el JS es compartido** (`assets/js/main.js`); cada módulo se autoprotege con guard clauses (`if (!el) return;`), así que el mismo script corre en las 3 páginas sin romper donde un elemento no existe.

```
index.html              # home: hero, servicios (preview), nosotros (preview), testimonios, contacto+form
secciones/
  servicios.html        # detalle de servicios
  nosotros.html         # historia / sobre nosotros
assets/css/styles.css   # único stylesheet (857 líneas) sobre Bootstrap
assets/js/main.js       # único script (5 módulos IIFE)
assets/img/             # vacío — los visuales son emojis/SVG inline, no imágenes
```

### Rutas relativas (clave en multi-página)
`index.html` está en la raíz; las subpáginas viven en `secciones/`. Desde `secciones/` se referencia con `../`:
- assets → `../assets/css/styles.css`, `../assets/js/main.js`
- home → `../index.html`, y anclas cross-page → `../index.html#contacto`
- entre subpáginas → directo (`nosotros.html`, `servicios.html`)

Al crear una página nueva en `secciones/`, copiá el `<head>`, navbar y footer de una existente y respetá estos prefijos.

### main.js — 5 módulos IIFE independientes
1. **Navbar scroll** — agrega `.scrolled` (fondo + blur) cuando `scrollY > 30`.
2. **Scroll reveal** — `IntersectionObserver` sobre `.reveal` → agrega `.visible`. Delays escalonados con clases `.reveal-d1` / `.reveal-d2`.
3. **Contadores** — `$.animate()` de jQuery interpola `data-target` de los `.counter`; se dispara una vez al entrar al viewport.
4. **Formulario** — Constraint Validation HTML5 + `.was-validated` de Bootstrap; mueve foco al primer `:invalid`; el envío está **simulado con `setTimeout`** (línea ~131: reemplazar por `fetch()`/`$.ajax()` para producción). Éxito vía `fadeIn().delay().fadeOut()` con fallback sin jQuery.
5. **ScrollSpy** — resalta el `.nav-link` de la sección visible (solo en home, que tiene `section[id]`).

### CSS — sistema de diseño
- Paleta y tokens en `:root` (`styles.css:8`): verdes salvia (`--sage`), dorado (`--gold`), cremas. Variables Bootstrap sobrescritas ahí mismo (`--bs-primary`, `--bs-body-font-family`, radios).
- Tipografías: **Cormorant Garamond** (display: h1–h3) + **Outfit** (texto), por Google Fonts.
- Usá los tokens `var(--sage)` etc. y las utilidades de marca (`.text-sage`, `.btn-sage`, `.btn-outline-sage`, `.section-label`, `.section-title`) en vez de hardcodear colores.

## Convenciones

- **Idioma:** todo el copy, comentarios y commits en **español (es_AR)** — voseo (ej. "Agendá", "Contanos").
- **CTAs:** Instagram (`@_amor_y_sanacion`) y formulario de contacto son los canales activos. WhatsApp es placeholder — no inventes un número.
- **Visuales:** se usan emojis (🦋 💆 ✨) y SVG inline (hojas del hero), no archivos en `assets/img/`. Mantené ese enfoque salvo que se pida lo contrario.
- **Accesibilidad:** el markup ya cuida ARIA (`aria-label`, `aria-labelledby`, `role`, `aria-live` en el mensaje de éxito, foco en errores). Preservá ese nivel al editar.
