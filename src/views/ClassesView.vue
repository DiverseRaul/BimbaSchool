<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-indigo-400">My Classes</h1>
      <button @click="SHOW_ADD_MODAL = true" class="btn btn-primary">
        <span class="flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New Class
        </span>
      </button>
    </div>
    
    <!-- Class Cards Grid -->
    <div v-if="USER_CLASSES.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(classItem, index) in USER_CLASSES" :key="index" class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg hover:border-indigo-500 transition-colors">
        <div class="flex justify-between items-start">
          <h3 class="text-xl font-semibold text-white">{{ classItem.name }}</h3>
          <span class="bg-indigo-900 text-indigo-200 px-2 py-1 rounded text-sm">{{ classItem.term }}</span>
        </div>
        <p class="text-gray-300 mt-2">{{ classItem.description }}</p>
        
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-400">Instructor</p>
              <p class="text-gray-300">{{ classItem.instructor }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Credit Hours</p>
              <p class="text-gray-300">{{ classItem.credits }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-between">
          <button @click="editClass(classItem)" class="text-indigo-400 hover:text-indigo-300">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Edit
            </span>
          </button>
          <button @click="deleteClass(classItem.id)" class="text-red-400 hover:text-red-300">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
      <div class="text-5xl text-center text-indigo-400 mb-4">📚</div>
      <h2 class="text-2xl font-semibold text-white mb-2">No Classes Yet</h2>
      <p class="text-gray-300 mb-6">You haven't added any classes to track yet.</p>
      <button @click="SHOW_ADD_MODAL = true" class="btn btn-primary">Add Your First Class</button>
    </div>
    
    <!-- Add/Edit Class Modal -->
    <div v-if="SHOW_ADD_MODAL" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-75" @click="closeModal"></div>
      <div class="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 w-full max-w-md z-10">
        <h2 class="text-2xl font-bold mb-6 text-indigo-400">{{ EDIT_CLASS.id ? 'Edit Class' : 'Add New Class' }}</h2>
        
        <form @submit.prevent="saveClass" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm text-gray-300">Class Name</label>
            <input v-model="EDIT_CLASS.name" type="text" class="form-input" placeholder="e.g. Advanced Mathematics" required>
          </div>
          
          <div>
            <label class="block mb-1 text-sm text-gray-300">Instructor</label>
            <input v-model="EDIT_CLASS.instructor" type="text" class="form-input" placeholder="Instructor name" required>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm text-gray-300">Credit Hours</label>
              <input v-model.number="EDIT_CLASS.credits" type="number" min="0" step="0.5" class="form-input" required>
            </div>
            
            <div>
              <label class="block mb-1 text-sm text-gray-300">Term</label>
              <select v-model="EDIT_CLASS.term" class="form-input" required>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
                <option value="Summer 2025">Summer 2025</option>
                <option value="Fall 2025">Fall 2025</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block mb-1 text-sm text-gray-300">Description</label>
            <textarea v-model="EDIT_CLASS.description" class="form-input" rows="3" placeholder="Class description"></textarea>
          </div>
          
          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="IS_LOADING">
              <span v-if="IS_LOADING" class="flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>{{ EDIT_CLASS.id ? 'Update Class' : 'Add Class' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="SHOW_DELETE_MODAL" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-75" @click="SHOW_DELETE_MODAL = false"></div>
      <div class="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 w-full max-w-md z-10">
        <h2 class="text-2xl font-bold mb-6 text-red-400">Confirm Deletion</h2>
        <p class="text-gray-300 mb-6">Are you sure you want to delete this class? This action cannot be undone.</p>
        
        <div class="flex justify-end gap-4">
          <button @click="SHOW_DELETE_MODAL = false" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger" :disabled="IS_LOADING">
            <span v-if="IS_LOADING" class="flex items-center justify-center">
              <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Deleting...
            </span>
            <span v-else>Delete Class</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import { toast } from 'vue3-toastify'

export default {
  name: 'ClassesView',
  setup() {
    const USER_CLASSES = ref([])
    const IS_LOADING = ref(false)
    const SHOW_ADD_MODAL = ref(false)
    const SHOW_DELETE_MODAL = ref(false)
    const CLASS_TO_DELETE = ref(null)
    const EDIT_CLASS = ref({
      id: null,
      name: '',
      instructor: '',
      credits: 3,
      term: 'Fall 2024',
      description: ''
    })
    
    onMounted(async () => {
      await fetchClasses()
    })
    
    async function fetchClasses() {
      IS_LOADING.value = true
      
      try {
        const { data: USER } = await supabase.auth.getUser()
        
        if (!USER || !USER.user) return
        
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('user_id', USER.user.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        USER_CLASSES.value = data || []
      } catch (error) {
        console.error('Error fetching classes:', error)
        toast.error('Failed to load your classes')
      } finally {
        IS_LOADING.value = false
      }
    }
    
    function resetForm() {
      EDIT_CLASS.value = {
        id: null,
        name: '',
        instructor: '',
        credits: 3,
        term: 'Fall 2024',
        description: ''
      }
    }
    
    function editClass(classItem) {
      EDIT_CLASS.value = { ...classItem }
      SHOW_ADD_MODAL.value = true
    }
    
    function closeModal() {
      SHOW_ADD_MODAL.value = false
      resetForm()
    }
    
    async function saveClass() {
      IS_LOADING.value = true
      
      try {
        const { data: USER } = await supabase.auth.getUser()
        
        if (!USER || !USER.user) {
          toast.error('You must be logged in to save classes')
          return
        }
        
        const CLASS_DATA = {
          name: EDIT_CLASS.value.name,
          instructor: EDIT_CLASS.value.instructor,
          credits: EDIT_CLASS.value.credits,
          term: EDIT_CLASS.value.term,
          description: EDIT_CLASS.value.description,
          user_id: USER.user.id
        }
        
        if (EDIT_CLASS.value.id) {
          const { error } = await supabase
            .from('classes')
            .update(CLASS_DATA)
            .eq('id', EDIT_CLASS.value.id)
          
          if (error) throw error
          toast.success('Class updated successfully')
        } else {
          CLASS_DATA.created_at = new Date()
          
          const { error } = await supabase
            .from('classes')
            .insert([CLASS_DATA])
          
          if (error) throw error
          toast.success('Class added successfully')
        }
        
        await fetchClasses()
        closeModal()
      } catch (error) {
        console.error('Error saving class:', error)
        toast.error(error.message || 'Failed to save class')
      } finally {
        IS_LOADING.value = false
      }
    }
    
    function deleteClass(classId) {
      CLASS_TO_DELETE.value = classId
      SHOW_DELETE_MODAL.value = true
    }
    
    async function confirmDelete() {
      if (!CLASS_TO_DELETE.value) return
      
      IS_LOADING.value = true
      
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', CLASS_TO_DELETE.value)
        
        if (error) throw error
        
        toast.success('Class deleted successfully')
        await fetchClasses()
        SHOW_DELETE_MODAL.value = false
      } catch (error) {
        console.error('Error deleting class:', error)
        toast.error(error.message || 'Failed to delete class')
      } finally {
        IS_LOADING.value = false
      }
    }
    
    return {
      USER_CLASSES,
      IS_LOADING,
      SHOW_ADD_MODAL,
      SHOW_DELETE_MODAL,
      EDIT_CLASS,
      editClass,
      closeModal,
      saveClass,
      deleteClass,
      confirmDelete
    }
  }
}
</script>
