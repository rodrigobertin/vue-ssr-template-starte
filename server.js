// @ts-check
const fs = require('fs');
const path = require('path');
const express = require('express');

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p);

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : '';

  const manifest = isProd
    ? // @ts-ignore
      require('./dist/client/ssr-manifest.json')
    : {};

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: 'ssr',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false,
      })
    );
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render;
      } else {
        template = indexProd;
        render = require('./dist/server/entry-server.js').render;
      }

      const [appHtml, initialState] = await render(url);

      const renderState = `<script>window.__INITIAL_STATE__=${JSON.stringify(
        initialState
      )}</script>`;

      const html = template
        .replace(`<!-- head-end -->`, `${renderState}`)
        .replace(`<!--app-html-->`, appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.info('app error', e);
      res.status(500).end(e.stack || e);
    }
  });

  return { app, vite };
}

createServer().then(({ app }) => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.info(`App run on http://localhost:${port} Cheer!`);
  });
});
