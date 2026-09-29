import { defineConfig } from 'vite';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const cleanRoutes = new Map([
  ['/desarrollo-web-alcobendas', '/desarrollo-web-alcobendas.html'],
  ['/en/web-developer-alcobendas', '/en/web-developer-alcobendas.html'],
]);
const legacyRoutes = new Map([
  ['/desarrollo-web-alcobendas.html', '/desarrollo-web-alcobendas'],
  ['/en/web-developer-alcobendas.html', '/en/web-developer-alcobendas'],
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

export default defineConfig({
  plugins: [cleanLandingRoutes()],
});