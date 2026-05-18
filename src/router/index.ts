import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/course/:courseId',
    name: 'course',
    component: () => import('@/views/CourseView.vue'),
  },
  {
    path: '/course/:courseId/module/:moduleId',
    name: 'module',
    component: () => import('@/views/ModuleView.vue'),
  },
  {
    // lessonId is dot-inclusive so it can carry slashes (e.g. "vue/reactivity/ref")
    path: '/course/:courseId/lesson/:lessonId(.*)',
    name: 'lesson',
    component: () => import('@/views/LessonView.vue'),
  },
  {
    path: '/course/:courseId/review',
    name: 'review',
    component: () => import('@/views/ReviewView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
