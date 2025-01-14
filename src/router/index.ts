import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const checkAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  if (!userStore.userId) {
    next({name: 'Auth'})
  } else {
    next()
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth.vue'),
  },
  {
    path: '/chart',
    name: 'Statistic',
    component: () => import('@/views/Chart.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/list',
    name: 'InterviewsList',
    component: () => import('@/views/InterviewsList.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/interview/:id',
    name: 'Interview',
    component: () => import('@/views/Interview.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/school',
    name: 'Showcase',
    component: () => import('@/views/Showcase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
