import {createMemoryHistory, createRouter as _createRouter, createWebHistory, type RouteRecordRaw,} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/Home.vue'),
    meta: {
      pageName: 'Home',
    },
  },
];

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
