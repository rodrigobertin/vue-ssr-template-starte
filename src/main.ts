import { createSSRApp, createApp as createClientApp } from 'vue';
import type { App as VueApp } from '@vue/runtime-core';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createRouter } from './router';
import './assets/sass/main.scss';

export function createApp() {
  let app: VueApp;
  if (import.meta.env.DEV && !import.meta.env.SSR) {
    app = createClientApp(App);
  } else {
    app = createSSRApp(App);
  }

  const store = createPinia();
  app.use(store);

  const router = createRouter();
  app.use(router);
  return { app, store, router };
}
