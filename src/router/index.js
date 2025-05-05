import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage.vue'
import SecondPage from '../views/secondPage.vue'
import ImageUpload from '@/views/image-upload.vue'


const routes = [
  // Homepage
  {
    path: '/',
    name: 'Homepage',
    component: ImageUpload
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

export default router
