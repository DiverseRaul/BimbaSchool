<template>
  <div class="max-w-md mx-auto">
    <div class="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h1 class="text-2xl font-bold mb-6 text-indigo-400 text-center">Create Your Account</h1>
      
      <form @submit.prevent="signup" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block mb-1 text-sm text-gray-300">First Name</label>
            <input 
              v-model="SIGNUP_FORM.firstName" 
              type="text" 
              id="firstName" 
              class="form-input" 
              placeholder="First Name"
              required
            >
          </div>
          
          <div>
            <label for="lastName" class="block mb-1 text-sm text-gray-300">Last Name</label>
            <input 
              v-model="SIGNUP_FORM.lastName" 
              type="text" 
              id="lastName" 
              class="form-input" 
              placeholder="Last Name"
              required
            >
          </div>
        </div>
        
        <div>
          <label for="email" class="block mb-1 text-sm text-gray-300">Email</label>
          <input 
            v-model="SIGNUP_FORM.email" 
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
            v-model="SIGNUP_FORM.password" 
            type="password" 
            id="password" 
            class="form-input" 
            placeholder="Create a password"
            required
          >
          <p class="mt-1 text-xs text-gray-400">Password must be at least 8 characters long.</p>
        </div>
        
        <div>
          <label for="confirmPassword" class="block mb-1 text-sm text-gray-300">Confirm Password</label>
          <input 
            v-model="SIGNUP_FORM.confirmPassword" 
            type="password" 
            id="confirmPassword" 
            class="form-input" 
            placeholder="Confirm your password"
            required
          >
        </div>
        
        <div>
          <label for="schoolYear" class="block mb-1 text-sm text-gray-300">School Year</label>
          <select v-model="SIGNUP_FORM.schoolYear" id="schoolYear" class="form-input" required>
            <option value="">Select your school year</option>
            <option value="freshman">Freshman</option>
            <option value="sophomore">Sophomore</option>
            <option value="junior">Junior</option>
            <option value="senior">Senior</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
        
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input 
              v-model="SIGNUP_FORM.acceptTerms" 
              id="terms" 
              type="checkbox" 
              class="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
              required
            >
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-300">I agree to the <a href="#" class="text-indigo-400 hover:text-indigo-300">Terms and Conditions</a></label>
          </div>
        </div>
        
        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="IS_LOADING">
            <span v-if="IS_LOADING" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-300">
          Already have an account?
          <router-link to="/login" class="ml-1 text-indigo-400 hover:text-indigo-300">Log in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import { toast } from 'vue3-toastify'

export default {
  name: 'SignupView',
  setup() {
    const SIGNUP_FORM = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolYear: '',
      acceptTerms: false
    })
    
    const IS_LOADING = ref(false)
    const router = useRouter()
    
    async function signup() {
      if (SIGNUP_FORM.value.password.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return
      }
      
      if (SIGNUP_FORM.value.password !== SIGNUP_FORM.value.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      
      if (!SIGNUP_FORM.value.acceptTerms) {
        toast.error('You must accept the Terms and Conditions')
        return
      }
      
      IS_LOADING.value = true
      
      try {
        // 1. Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: SIGNUP_FORM.value.email,
          password: SIGNUP_FORM.value.password,
          options: {
            data: {
              first_name: SIGNUP_FORM.value.firstName,
              last_name: SIGNUP_FORM.value.lastName
            }
          }
        })
        
        if (authError) throw authError
        
        // 2. Insert additional user profile data
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: authData.user.id,
              first_name: SIGNUP_FORM.value.firstName,
              last_name: SIGNUP_FORM.value.lastName,
              email: SIGNUP_FORM.value.email,
              school_year: SIGNUP_FORM.value.schoolYear,
              created_at: new Date()
            }
          ])
        
        if (profileError) throw profileError
        
        toast.success('Account created successfully! Please sign in.')
        router.push('/login')
      } catch (error) {
        console.error('Signup error:', error)
        toast.error(error.message || 'Failed to create account')
      } finally {
        IS_LOADING.value = false
      }
    }
    
    return {
      SIGNUP_FORM,
      IS_LOADING,
      signup
    }
  }
}
</script>
