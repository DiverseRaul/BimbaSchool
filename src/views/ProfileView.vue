<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">My Profile</h1>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="card col-span-1">
        <div class="flex flex-col items-center">
          <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span v-if="!USER_PROFILE.avatar" class="text-4xl text-blue-500">{{ USER_PROFILE.initials }}</span>
            <img v-else :src="USER_PROFILE.avatar" alt="Profile" class="w-full h-full rounded-full object-cover">
          </div>
          
          <h2 class="text-xl font-semibold">{{ USER_PROFILE.fullName }}</h2>
          <p class="text-gray-600">{{ USER_PROFILE.email }}</p>
          
          <button @click="uploadAvatar" class="mt-4 text-blue-600 text-sm">Change Profile Picture</button>
        </div>
      </div>
      
      <div class="card col-span-2">
        <h2 class="text-xl font-semibold mb-4">Personal Information</h2>
        
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium">First Name</label>
              <input v-model="FORM.firstName" type="text" class="form-input" placeholder="Your first name">
            </div>
            
            <div>
              <label class="block mb-1 font-medium">Last Name</label>
              <input v-model="FORM.lastName" type="text" class="form-input" placeholder="Your last name">
            </div>
          </div>
          
          <div>
            <label class="block mb-1 font-medium">Email</label>
            <input v-model="FORM.email" type="email" class="form-input" placeholder="Your email" disabled>
          </div>
          
          <div>
            <label class="block mb-1 font-medium">School/Institution</label>
            <input v-model="FORM.school" type="text" class="form-input" placeholder="Your school or institution">
          </div>
          
          <div>
            <label class="block mb-1 font-medium">Graduation Year</label>
            <select v-model="FORM.graduationYear" class="form-input">
              <option v-for="year in graduationYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          
          <div class="pt-4">
            <button type="submit" class="btn btn-primary" :disabled="IS_UPDATING">
              {{ IS_UPDATING ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="mt-6 card">
      <h2 class="text-xl font-semibold mb-4">Account Settings</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between py-2 border-b">
          <div>
            <h3 class="font-medium">Change Password</h3>
            <p class="text-sm text-gray-600">Update your account password</p>
          </div>
          <button @click="showChangePasswordModal = true" class="btn btn-secondary">Change</button>
        </div>
        
        <div class="flex items-center justify-between py-2 border-b">
          <div>
            <h3 class="font-medium">Email Notifications</h3>
            <p class="text-sm text-gray-600">Receive updates about your grades and college recommendations</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="FORM.emailNotifications" type="checkbox" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div class="flex items-center justify-between py-2">
          <div>
            <h3 class="font-medium">Delete Account</h3>
            <p class="text-sm text-gray-600">Permanently delete your account and all data</p>
          </div>
          <button @click="confirmDeleteAccount" class="text-red-600 hover:text-red-800">Delete Account</button>
        </div>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">Change Password</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block mb-1 font-medium">Current Password</label>
            <input v-model="passwordForm.current" type="password" class="form-input" placeholder="Current password">
          </div>
          
          <div>
            <label class="block mb-1 font-medium">New Password</label>
            <input v-model="passwordForm.new" type="password" class="form-input" placeholder="New password">
          </div>
          
          <div>
            <label class="block mb-1 font-medium">Confirm New Password</label>
            <input v-model="passwordForm.confirm" type="password" class="form-input" placeholder="Confirm new password">
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button @click="showChangePasswordModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="changePassword" class="btn btn-primary">Update Password</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { supabase } from '../services/supabase'

export default {
  name: 'ProfileView',
  setup() {
    const USER_PROFILE = reactive({
      fullName: '',
      email: '',
      avatar: null,
      initials: 'U'
    })
    
    const FORM = reactive({
      firstName: '',
      lastName: '',
      email: '',
      school: '',
      graduationYear: new Date().getFullYear() + 4,
      emailNotifications: true
    })
    
    const passwordForm = reactive({
      current: '',
      new: '',
      confirm: ''
    })
    
    const showChangePasswordModal = ref(false)
    const IS_UPDATING = ref(false)
    
    // Generate a list of graduation years (current year up to 10 years in the future)
    const graduationYears = computed(() => {
      const currentYear = new Date().getFullYear()
      return Array.from({ length: 10 }, (_, i) => currentYear + i)
    })
    
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return
        
        FORM.email = user.email
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        if (data) {
          FORM.firstName = data.first_name || ''
          FORM.lastName = data.last_name || ''
          FORM.school = data.school || ''
          FORM.graduationYear = data.graduation_year || new Date().getFullYear() + 4
          FORM.emailNotifications = data.email_notifications !== false
          
          // Update display information
          USER_PROFILE.fullName = `${FORM.firstName} ${FORM.lastName}`.trim() || 'User'
          USER_PROFILE.email = FORM.email
          USER_PROFILE.avatar = data.avatar_url
          USER_PROFILE.initials = getInitials(USER_PROFILE.fullName)
        }
      } catch (error) {
        toast.error('Error loading profile')
        console.error('Error loading profile:', error)
      }
    }
    
    function getInitials(name) {
      if (!name || name === 'User') return 'U'
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    
    async function updateProfile() {
      if (!FORM.firstName || !FORM.lastName) {
        toast.error('First and last name are required')
        return
      }
      
      IS_UPDATING.value = true
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          toast.error('You must be logged in to update your profile')
          return
        }
        
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            first_name: FORM.firstName,
            last_name: FORM.lastName,
            school: FORM.school,
            graduation_year: FORM.graduationYear,
            email_notifications: FORM.emailNotifications,
            updated_at: new Date().toISOString()
          })
        
        if (error) throw error
        
        // Update displayed user information
        USER_PROFILE.fullName = `${FORM.firstName} ${FORM.lastName}`.trim()
        USER_PROFILE.initials = getInitials(USER_PROFILE.fullName)
        
        toast.success('Profile updated successfully')
      } catch (error) {
        toast.error('Error updating profile')
        console.error('Error updating profile:', error)
      } finally {
        IS_UPDATING.value = false
      }
    }
    
    async function uploadAvatar() {
      // In a real app, this would open a file picker and upload to Supabase Storage
      toast.info('Avatar upload functionality would be implemented here')
    }
    
    async function changePassword() {
      if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
        toast.error('All password fields are required')
        return
      }
      
      if (passwordForm.new !== passwordForm.confirm) {
        toast.error('New passwords do not match')
        return
      }
      
      if (passwordForm.new.length < 8) {
        toast.error('Password must be at least 8 characters long')
        return
      }
      
      try {
        const { error } = await supabase.auth.updateUser({
          password: passwordForm.new
        })
        
        if (error) throw error
        
        toast.success('Password updated successfully')
        showChangePasswordModal.value = false
        
        // Reset form
        passwordForm.current = ''
        passwordForm.new = ''
        passwordForm.confirm = ''
      } catch (error) {
        toast.error('Error updating password')
        console.error('Error updating password:', error)
      }
    }
    
    function confirmDeleteAccount() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        deleteAccount()
      }
    }
    
    async function deleteAccount() {
      try {
        const { error } = await supabase.auth.admin.deleteUser(
          (await supabase.auth.getUser()).data.user.id
        )
        
        if (error) throw error
        
        toast.success('Account deleted successfully')
        // In a real app, would redirect to login page
      } catch (error) {
        toast.error('Error deleting account')
        console.error('Error deleting account:', error)
      }
    }
    
    onMounted(() => {
      loadUserProfile()
    })
    
    return {
      USER_PROFILE,
      FORM,
      passwordForm,
      showChangePasswordModal,
      IS_UPDATING,
      graduationYears,
      updateProfile,
      uploadAvatar,
      changePassword,
      confirmDeleteAccount
    }
  }
}
</script>
