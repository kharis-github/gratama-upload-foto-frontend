import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage.vue'
import SecondPage from '../views/secondPage.vue'
import ImageUpload from '@/views/image-upload.vue'
import LoginPage from '@/views/loginPage.vue'

const routes = [
  // Homepage
  {
    path: '/',
    name: 'Homepage',
    component: ImageUpload,
    meta: { requiresAuth: true }
  },
  // Login Page
  {
    path: '/login',
    name: 'Login Page',
    component: LoginPage
  },
  // Second Page
  {
    path: '/second',
    name: 'Second Page',
    component: SecondPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 1 | ambil token
  const token = localStorage.getItem('token')

  // 2 | autentikasi token
  if (to.meta.requiresAuth && !token) {
    alert('User harus login terlebih dahulu!')
    next('/login') // jika user blm login, harus login
  } else {
    next()
  }
})

export default router
