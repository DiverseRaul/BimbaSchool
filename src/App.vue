<template>
  <div id="app" class="min-h-screen bg-gray-900 text-gray-100">
    <header class="bg-indigo-900 text-white shadow-lg">
      <nav class="container mx-auto flex justify-between items-center p-4">
        <h1 class="text-2xl font-bold tracking-tight">Bimba School</h1>
        <div class="flex gap-6">
          <router-link to="/" class="hover:text-indigo-300 transition-colors">Home</router-link>
          <router-link to="/grades" class="hover:text-indigo-300 transition-colors">Grades</router-link>
          <router-link to="/colleges" class="hover:text-indigo-300 transition-colors">Colleges</router-link>
          <router-link to="/profile" class="hover:text-indigo-300 transition-colors">Profile</router-link>
          <router-link v-if="!USER_LOGGED_IN" to="/login" class="hover:text-indigo-300 transition-colors">Login</router-link>
          <button v-else @click="logout" class="hover:text-indigo-300 transition-colors">Logout</button>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6">
      <router-view />
    </main>

    <footer class="bg-gray-800 p-6 mt-12">
      <div class="container mx-auto text-center text-gray-400">
        <p> &copy; {{ CURRENT_YEAR }} Bimba School. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './services/supabase'
import { toast } from 'vue3-toastify'

export default {
  name: 'App',
  setup() {
    const CURRENT_YEAR = new Date().getFullYear()
    const USER_LOGGED_IN = ref(false)
    const router = useRouter()

    async function checkUser() {
      const { data, error } = await supabase.auth.getSession()
      if (data && data.session) {
        USER_LOGGED_IN.value = true
      }
    }

    async function logout() {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        USER_LOGGED_IN.value = false
        toast.success('Logged out successfully')
        router.push('/login')
      } catch (error) {
        toast.error('Error logging out')
        console.error('Error logging out:', error)
      }
    }

    onMounted(() => {
      checkUser()
    })

    return {
      CURRENT_YEAR,
      USER_LOGGED_IN,
      logout
    }
  }
}
</script>
