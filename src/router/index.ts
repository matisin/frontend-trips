import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TripView from '../views/TripView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'trips',
      component: HomeView
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: TripView
    }
  ]
})

export default router
