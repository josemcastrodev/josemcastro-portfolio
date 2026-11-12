import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { onRequestPost } from './functions/api/contact.js';

// Páginas que compila Vite (viven en la raíz, no en public/)
const builtRoutes = new Map([
  ['/desarrollo-web-alcobendas', '/desarrollo-web-alcobendas.html'],
  ['/en/web-developer-alcobendas', '/en/web-developer-alcobendas.html'],
]);
const cleanRoutes = new Map([
  ['/contacto-enviado', '/contacto-enviado.html'],
  ['/en/message-sent', '/en/message-sent.html'],
]);
const legacyRoutes = new Map([
  ['/desarrollo-web-alcobendas.html', '/desarrollo-web-alcobendas'],
  ['/en/web-developer-alcobendas.html', '/en/web-developer-alcobendas'],
  ['/contacto-enviado.html', '/contacto-enviado'],
  ['/en/message-sent.html', '/en/message-sent'],
]);

function cleanLandingRoutes() {
  const routeMiddleware = async (request, response, next, server) => {
    if (!request.url) return next();
    const requestUrl = new URL(request.url, 'http://localhost');
    const redirect = legacyRoutes.get(requestUrl.pathname);
    if (redirect) {
      response.writeHead(308, { Location: `${redirect}${requestUrl.search}` });
      response.end();
      return;
    }

    const built = builtRoutes.get(requestUrl.pathname);
    if (built) {
      request.url = `${built}${requestUrl.search}`;
      return next();
    }

    const file = cleanRoutes.get(requestUrl.pathname);
    if (!file) return next();

    try {
      const html = await readFile(resolve(server.config.root, 'public', file.replace(/^\/+/, '')), 'utf8');
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      });
      response.end(html);
    } catch (error) {
      next(error);
    }
  };

  return {
    name: 'clean-landing-routes',
    configureServer(server) {
      server.middlewares.use((request, response, next) => routeMiddleware(request, response, next, server));
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => routeMiddleware(request, response, next, server));
    },
  };
}

function localContactApi() {
  let fileEnv = {};
  const middleware = async (request, response, next) => {
    if (!request.url || new URL(request.url, 'http://localhost').pathname !== '/api/contact') return next();
    if (request.method !== 'POST') {
      response.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
      return;
    }

    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
      const webRequest = new Request(url, {
        method: 'POST',
        headers: {
          origin: request.headers.origin || url.origin,
          'content-type': request.headers['content-type'] || 'application/json',
        },
        body: Buffer.concat(chunks),
      });
      const result = await onRequestPost({
        request: webRequest,
        env: {
          RESEND_API_KEY: process.env.RESEND_API_KEY || fileEnv.RESEND_API_KEY,
          CONTACT_FROM: process.env.CONTACT_FROM || fileEnv.CONTACT_FROM,
        },
      });
      response.writeHead(result.status, Object.fromEntries(result.headers));
      response.end(Buffer.from(await result.arrayBuffer()));
    } catch (error) {
      next(error);
    }
  };

  return {
    name: 'local-contact-api',
    config(_, { mode }) {
      fileEnv = loadEnv(mode, process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [cleanLandingRoutes(), localContactApi()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        landing: resolve(import.meta.dirname, 'desarrollo-web-alcobendas.html'),
        landingEn: resolve(import.meta.dirname, 'en/web-developer-alcobendas.html'),
      },
    },
  },
});