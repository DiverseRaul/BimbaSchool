<template>
  <div class="max-w-md mx-auto">
    <div class="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h1 class="text-2xl font-bold mb-6 text-indigo-400 text-center">Login to Bimba School</h1>
      
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block mb-1 text-sm text-gray-300">Email</label>
          <input 
            v-model="LOGIN_FORM.email" 
            type="email" 
            id="email" 
            class="form-input" 
            placeholder="Enter your email"
            required
          >
        </div>
        
        <div>
          <label for="password" class="block mb-1 text-sm text-gray-300">Password</label>
          <input 
            v-model="LOGIN_FORM.password" 
            type="password" 
            id="password" 
            class="form-input" 
            placeholder="Enter your password"
            required
          >
        </div>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              v-model="LOGIN_FORM.remember" 
              id="remember" 
              type="checkbox" 
              class="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            >
            <label for="remember" class="ml-2 block text-sm text-gray-300">Remember me</label>
          </div>
          
          <div class="text-sm">
            <a href="#" class="text-indigo-400 hover:text-indigo-300">Forgot your password?</a>
          </div>
        </div>
        
        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="IS_LOADING">
            <span v-if="IS_LOADING" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-300">
          Don't have an account?
          <router-link to="/signup" class="ml-1 text-indigo-400 hover:text-indigo-300">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../services/supabase'
import { toast } from 'vue3-toastify'

export default {
  name: 'LoginView',
  setup() {
    const LOGIN_FORM = ref({
      email: '',
      password: '',
      remember: false
    })
    
    const IS_LOADING = ref(false)
    const router = useRouter()
    const route = useRoute()
    
    async function login() {
      if (!LOGIN_FORM.value.email || !LOGIN_FORM.value.password) {
        toast.error('Please enter both email and password')
        return
      }
      
      IS_LOADING.value = true
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: LOGIN_FORM.value.email,
          password: LOGIN_FORM.value.password
        })
        
        if (error) throw error
        
        toast.success('Logged in successfully')
        
        // Redirect to the requested page or default to home
        const REDIRECT_PATH = route.query.redirect || '/'
        router.push(REDIRECT_PATH)
      } catch (error) {
        console.error('Login error:', error)
        toast.error(error.message || 'Failed to login')
      } finally {
        IS_LOADING.value = false
      }
    }
    
    return {
      LOGIN_FORM,
      IS_LOADING,
      login
    }
  }
}
</script>
