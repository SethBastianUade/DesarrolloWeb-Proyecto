# Imágenes — Amor y Sanación

Esta carpeta contiene los recursos gráficos del sitio.

## Formatos recomendados
- **WebP** — fotografías y fondos (mejor compresión que JPEG)
- **AVIF** — imágenes con transparencia y fotografías de alta calidad
- **SVG** — íconos, ilustraciones y elementos gráficos vectoriales

## Convención de nombres
```
[seccion]-[descripcion]-[dimension].[ext]
hero-portada-1200w.webp
servicios-masaje-600w.webp
nosotros-terapeuta-800w.webp
logo.svg
favicon.svg
```

## Optimización
- Comprimir con Squoosh (https://squoosh.app) antes de subir
- Usar el atributo `loading="lazy"` en imágenes fuera del viewport
- Proveer atributos `width` y `height` para evitar layout shift (CLS)
