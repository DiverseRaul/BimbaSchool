import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GradesView from '../views/GradesView.vue'
import CollegesView from '../views/CollegesView.vue'
import ProfileView from '../views/ProfileView.vue'
import { supabase } from '../services/supabase'

// Auth components
const LoginView = () => import('../views/LoginView.vue')
const SignupView = () => import('../views/SignupView.vue')
const ClassesView = () => import('../views/ClassesView.vue')

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
      component: GradesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/colleges',
      name: 'colleges',
      component: CollegesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/classes',
      name: 'classes',
      component: ClassesView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
