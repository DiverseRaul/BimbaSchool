<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">My Grades</h1>
    
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">GPA Summary</h2>
        <div class="text-4xl font-bold text-blue-600">{{ CALCULATED_GPA.toFixed(2) }}</div>
        <p class="text-sm text-gray-500 mt-2">Overall GPA</p>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Courses</h2>
        <div class="text-4xl font-bold text-blue-600">{{ COURSES.length }}</div>
        <p class="text-sm text-gray-500 mt-2">Total Courses</p>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Status</h2>
        <div class="text-4xl font-bold" :class="gpaBadgeColor">{{ gpaStatus }}</div>
        <p class="text-sm text-gray-500 mt-2">Based on your GPA</p>
      </div>
    </div>
    
    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="mb-6 flex justify-between items-center">
          <h2 class="text-2xl font-bold">Course List</h2>
          <button @click="showAddCourseModal = true" class="btn btn-primary">Add Course</button>
        </div>
        
        <div v-if="COURSES.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
          <p class="text-gray-500">You haven't added any courses yet.</p>
          <button @click="showAddCourseModal = true" class="btn btn-primary mt-4">Add Your First Course</button>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="p-3 text-left">Course Name</th>
                <th class="p-3 text-left">Grade</th>
                <th class="p-3 text-left">Credits</th>
                <th class="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in COURSES" :key="index" class="border-b hover:bg-gray-50">
                <td class="p-3">{{ course.name }}</td>
                <td class="p-3">{{ course.grade }}</td>
                <td class="p-3">{{ course.credits }}</td>
                <td class="p-3">
                  <button @click="editCourse(index)" class="text-blue-500 mr-2">Edit</button>
                  <button @click="deleteCourse(index)" class="text-red-500">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <GradeCalculator @saved="loadCourses" />
      </div>
    </div>
    
    <!-- Add/Edit Course Modal -->
    <div v-if="showAddCourseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4">{{ editingIndex === null ? 'Add New Course' : 'Edit Course' }}</h2>
        
        <div class="mb-4">
          <label class="block mb-1 font-medium">Course Name</label>
          <input v-model="currentCourse.name" type="text" class="form-input" placeholder="e.g. Mathematics 101">
        </div>
        
        <div class="mb-4">
          <label class="block mb-1 font-medium">Grade</label>
          <select v-model="currentCourse.grade" class="form-input">
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>
        
        <div class="mb-6">
          <label class="block mb-1 font-medium">Credits</label>
          <input v-model.number="currentCourse.credits" type="number" min="1" class="form-input" placeholder="3">
        </div>
        
        <div class="flex justify-end gap-2">
          <button @click="showAddCourseModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="saveCourse" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import { ref, computed, reactive, onMounted } from 'vue'
import { supabase } from '../services/supabase'
import GradeCalculator from '../components/GradeCalculator.vue'

export default {
  name: 'GradesView',
  components: {
    GradeCalculator
  },
  setup() {
    const COURSES = ref([])
    const showAddCourseModal = ref(false)
    const editingIndex = ref(null)
    const currentCourse = reactive({
      name: '',
      grade: 'A',
      credits: 3
    })
    
    // GPA calculation system
    const gradeValues = {
      'A+': 4.0,
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0
    }
    
    const CALCULATED_GPA = computed(() => {
      if (COURSES.value.length === 0) return 0.0
      
      let totalPoints = 0
      let totalCredits = 0
      
      COURSES.value.forEach(course => {
        const gradeValue = gradeValues[course.grade]
        totalPoints += gradeValue * course.credits
        totalCredits += course.credits
      })
      
      return totalCredits > 0 ? totalPoints / totalCredits : 0
    })
    
    const gpaStatus = computed(() => {
      const gpa = CALCULATED_GPA.value
      if (gpa >= 3.5) return 'Excellent'
      if (gpa >= 3.0) return 'Good'
      if (gpa >= 2.0) return 'Average'
      return 'Needs Improvement'
    })
    
    const gpaBadgeColor = computed(() => {
      const gpa = CALCULATED_GPA.value
      if (gpa >= 3.5) return 'text-green-600'
      if (gpa >= 3.0) return 'text-blue-600'
      if (gpa >= 2.0) return 'text-yellow-600'
      return 'text-red-600'
    })
    
    async function loadCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        COURSES.value = data || []
      } catch (error) {
        toast.error('Error loading courses')
        console.error('Error loading courses:', error)
      }
    }
    
    function resetCurrentCourse() {
      currentCourse.name = ''
      currentCourse.grade = 'A'
      currentCourse.credits = 3
      editingIndex.value = null
    }
    
    function editCourse(index) {
      const course = COURSES.value[index]
      currentCourse.name = course.name
      currentCourse.grade = course.grade
      currentCourse.credits = course.credits
      editingIndex.value = index
      showAddCourseModal.value = true
    }
    
    async function saveCourse() {
      if (!currentCourse.name) {
        toast.error('Course name is required')
        return
      }
      
      try {
        if (editingIndex.value === null) {
          // Add new course
          const { data, error } = await supabase
            .from('courses')
            .insert([
              {
                name: currentCourse.name,
                grade: currentCourse.grade,
                credits: currentCourse.credits
              }
            ])
            .select()
          
          if (error) throw error
          
          COURSES.value.unshift(data[0])
          toast.success('Course added successfully')
        } else {
          // Update existing course
          const course = COURSES.value[editingIndex.value]
          
          const { error } = await supabase
            .from('courses')
            .update({
              name: currentCourse.name,
              grade: currentCourse.grade,
              credits: currentCourse.credits
            })
            .eq('id', course.id)
          
          if (error) throw error
          
          COURSES.value[editingIndex.value] = {
            ...course,
            name: currentCourse.name,
            grade: currentCourse.grade,
            credits: currentCourse.credits
          }
          
          toast.success('Course updated successfully')
        }
        
        resetCurrentCourse()
        showAddCourseModal.value = false
      } catch (error) {
        toast.error('Error saving course')
        console.error('Error saving course:', error)
      }
    }
    
    async function deleteCourse(index) {
      if (!confirm('Are you sure you want to delete this course?')) return
      
      const course = COURSES.value[index]
      
      try {
        const { error } = await supabase
          .from('courses')
          .delete()
          .eq('id', course.id)
        
        if (error) throw error
        
        COURSES.value.splice(index, 1)
        toast.success('Course deleted successfully')
      } catch (error) {
        toast.error('Error deleting course')
        console.error('Error deleting course:', error)
      }
    }
    
    onMounted(() => {
      loadCourses()
    })
    
    return {
      COURSES,
      showAddCourseModal,
      editingIndex,
      currentCourse,
      CALCULATED_GPA,
      gpaStatus,
      gpaBadgeColor,
      loadCourses,
      editCourse,
      saveCourse,
      deleteCourse
    }
  }
}
</script>
