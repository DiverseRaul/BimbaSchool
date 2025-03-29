<template>
  <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
    <h2 class="text-xl font-semibold mb-4 text-indigo-400">College Finder</h2>
    <p class="mb-6 text-gray-300">Find colleges that match your academic profile.</p>
    
    <div class="space-y-4">
      <div>
        <label class="block mb-1 text-gray-300">Your GPA</label>
        <input v-model.number="SEARCH_QUERY.gpa" type="number" min="0" max="4" step="0.1" class="form-input" placeholder="Enter your GPA">
      </div>
      
      <div>
        <label class="block mb-1 text-gray-300">Preferred Location</label>
        <select v-model="SEARCH_QUERY.location" class="form-input">
          <option value="any">Any Location</option>
          <option value="northeast">Northeast</option>
          <option value="midwest">Midwest</option>
          <option value="south">South</option>
          <option value="west">West</option>
        </select>
      </div>
      
      <div>
        <label class="block mb-1 text-gray-300">College Type</label>
        <select v-model="SEARCH_QUERY.type" class="form-input">
          <option value="any">Any Type</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
      
      <div>
        <label class="block mb-1 text-gray-300">Major Interest</label>
        <select v-model="SEARCH_QUERY.major" class="form-input">
          <option value="any">Any Major</option>
          <option value="business">Business</option>
          <option value="engineering">Engineering</option>
          <option value="arts">Arts & Humanities</option>
          <option value="science">Science</option>
          <option value="healthcare">Healthcare</option>
          <option value="computer">Computer Science</option>
        </select>
      </div>
      
      <button @click="findColleges" class="btn btn-primary w-full mt-6" :disabled="IS_LOADING">
        <span v-if="IS_LOADING" class="flex items-center justify-center">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching...
        </span>
        <span v-else>Find Colleges</span>
      </button>
    </div>
    
    <div v-if="RESULTS.length > 0" class="mt-8 border-t border-gray-700 pt-6">
      <h3 class="text-lg font-semibold mb-4 text-indigo-400">Recommended Colleges</h3>
      
      <div v-for="(college, index) in RESULTS" :key="index" class="bg-gray-700 p-4 rounded-lg mb-4 border border-gray-600">
        <div class="flex justify-between">
          <h4 class="text-lg font-medium text-white">{{ college.name }}</h4>
          <span class="bg-indigo-900 text-indigo-200 px-2 py-1 rounded text-sm">{{ college.type }}</span>
        </div>
        <p class="text-gray-300 text-sm mb-2">{{ college.location }}</p>
        <div class="grid grid-cols-3 gap-4 mt-2 text-sm">
          <div>
            <p class="text-gray-400">Average GPA</p>
            <p class="font-medium text-white">{{ college.averageGpa }}</p>
          </div>
          <div>
            <p class="text-gray-400">Acceptance</p>
            <p class="font-medium text-white">{{ college.acceptanceRate }}%</p>
          </div>
          <div>
            <p class="text-gray-400">Tuition</p>
            <p class="font-medium text-white">${{ college.tuition.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="HAS_SEARCHED" class="mt-6 text-center py-6">
      <p class="text-gray-400">No colleges found matching your criteria. Try adjusting your search.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CollegeFinder',
  setup() {
    const SEARCH_QUERY = ref({
      gpa: 3.0,
      location: 'any',
      type: 'any',
      major: 'any'
    })
    
    const RESULTS = ref([])
    const IS_LOADING = ref(false)
    const HAS_SEARCHED = ref(false)
    
    function findColleges() {
      if (!SEARCH_QUERY.value.gpa) {
        alert('Please enter your GPA')
        return
      }
      
      IS_LOADING.value = true
      HAS_SEARCHED.value = true
      
      setTimeout(() => {
        RESULTS.value = generateCollegeRecommendations(SEARCH_QUERY.value)
        IS_LOADING.value = false
      }, 1500)
    }
    
    function generateCollegeRecommendations(criteria) {
      const COLLEGE_DATABASE = [
        {
          name: "Ivy University",
          location: "Northeast",
          type: "Private",
          acceptanceRate: 8,
          averageGpa: 3.9,
          tuition: 52000,
          majors: ["business", "engineering", "arts", "science"]
        },
        {
          name: "Pacific State University",
          location: "West",
          type: "Public",
          acceptanceRate: 65,
          averageGpa: 3.2,
          tuition: 28000,
          majors: ["engineering", "computer", "healthcare", "science"]
        },
        {
          name: "Midwest College",
          location: "Midwest",
          type: "Private",
          acceptanceRate: 45,
          averageGpa: 3.4,
          tuition: 42000,
          majors: ["arts", "business", "science"]
        },
        {
          name: "Southern Tech Institute",
          location: "South",
          type: "Public",
          acceptanceRate: 60,
          averageGpa: 3.3,
          tuition: 25000,
          majors: ["engineering", "computer", "business"]
        },
        {
          name: "Northeast Liberal Arts College",
          location: "Northeast",
          type: "Private",
          acceptanceRate: 30,
          averageGpa: 3.7,
          tuition: 48000,
          majors: ["arts", "science", "business"]
        },
        {
          name: "Western State University",
          location: "West",
          type: "Public",
          acceptanceRate: 75,
          averageGpa: 3.0,
          tuition: 22000,
          majors: ["business", "healthcare", "engineering"]
        }
      ]
      
      let FILTERED_COLLEGES = COLLEGE_DATABASE.filter(college => {
        const GPA_MATCH = college.averageGpa <= criteria.gpa + 0.3
        const LOCATION_MATCH = criteria.location === 'any' || college.location.toLowerCase() === criteria.location.toLowerCase()
        const TYPE_MATCH = criteria.type === 'any' || college.type.toLowerCase() === criteria.type.toLowerCase() 
        const MAJOR_MATCH = criteria.major === 'any' || college.majors.includes(criteria.major)
        
        return GPA_MATCH && LOCATION_MATCH && TYPE_MATCH && MAJOR_MATCH
      })
      
      FILTERED_COLLEGES.sort((a, b) => {
        const A_GPA_DIFF = Math.abs(a.averageGpa - criteria.gpa)
        const B_GPA_DIFF = Math.abs(b.averageGpa - criteria.gpa)
        return A_GPA_DIFF - B_GPA_DIFF
      })
      
      return FILTERED_COLLEGES.slice(0, 3)
    }
    
    return {
      SEARCH_QUERY,
      RESULTS,
      IS_LOADING,
      HAS_SEARCHED,
      findColleges
    }
  }
}
</script>
