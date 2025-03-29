import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GradesView from '../views/GradesView.vue'
import CollegesView from '../views/CollegesView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/grades',
      name: 'grades',
      component: GradesView
    },
    {
      path: '/colleges',
      name: 'colleges',
      component: CollegesView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

export default router
