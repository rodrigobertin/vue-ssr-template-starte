import {createMemoryHistory, createRouter as _createRouter, createWebHistory, type RouteRecordRaw,} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      pageName: 'Home',
    },
  },
  {
    path:'/about',
    name:'about',
    component:()=>import('@/views/AboutView.vue'),
  }
];

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}
