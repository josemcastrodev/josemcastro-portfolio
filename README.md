<p align="center">
  <img src="docs/portada.jpg" alt="josemcastro.dev · Portfolio personal · Vite, GSAP, Cloudflare Pages" width="100%">
</p>

# josemcastro.dev

Código de mi portfolio personal: [josemcastro.dev](https://josemcastro.dev).

<p align="center">
  <a href="https://josemcastro.dev"><img src="docs/screenshot.jpg" alt="Portada de josemcastro.dev" width="100%"></a>
</p>

Soy Jose María Castro, Senior Full Stack Developer (.NET, React, IA). En la web están mi experiencia, los proyectos en los que he trabajado, mis apps publicadas y un formulario de contacto.

## Stack

- **Vite 6** con varias páginas HTML y **JavaScript sin framework**: la portada y la página de desarrollo web son HTML estático, legible por buscadores y asistentes de IA sin ejecutar nada.
- **GSAP** (ScrollTrigger, ScrollSmoother y SplitText) para las animaciones ligadas al scroll.
- **Canvas 2D** para el retrato de la portada: al pasar el ratón, una lente lo redibuja con líneas de código cuyo tono sale de la propia foto.
- **Fuentes alojadas en el propio sitio** con Fontsource (Archivo, Instrument Serif y JetBrains Mono), sin peticiones a terceros.
- **Cloudflare Pages** para el alojamiento y **Pages Functions** para el formulario de contacto (`functions/api/contact.js`), que envía el correo con Resend.
- Datos estructurados (JSON-LD) y `llms.txt`. La página de desarrollo web está en español e inglés.

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Variables de entorno

El formulario de contacto necesita dos variables en Cloudflare Pages. No hay ninguna clave en el repositorio.

| Variable | Para qué |
|---|---|
| `RESEND_API_KEY` | Clave de la API de Resend |
| `CONTACT_FROM` | Remitente de los correos del formulario |

## Estructura

| Ruta | Contenido |
|---|---|
| `index.html` | Portada |
| `desarrollo-web-alcobendas.html`, `en/` | Página de desarrollo web, en español e inglés |
| `src/v2/` | Estilos y scripts de las páginas actuales |
| `public/` | Imágenes, favicon, CV y páginas de privacidad y confirmación |
| `functions/api/` | Función del formulario de contacto |
