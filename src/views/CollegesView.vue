<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">College Finder</h1>
    
    <div class="card mb-6">
      <h2 class="text-xl font-semibold mb-4">Find Your Dream College</h2>
      <p class="mb-4">Our AI-powered college finder will help you discover colleges that match your academic profile and preferences.</p>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block mb-1 font-medium">Your GPA</label>
          <input v-model.number="SEARCH_CRITERIA.gpa" type="number" min="0" max="4" step="0.1" class="form-input" placeholder="Enter your GPA">
        </div>
        
        <div>
          <label class="block mb-1 font-medium">Preferred Location</label>
          <select v-model="SEARCH_CRITERIA.location" class="form-input">
            <option value="any">Any Location</option>
            <option value="northeast">Northeast</option>
            <option value="midwest">Midwest</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block mb-1 font-medium">College Type</label>
          <select v-model="SEARCH_CRITERIA.type" class="form-input">
            <option value="any">Any Type</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        <div>
          <label class="block mb-1 font-medium">Major Interest</label>
          <select v-model="SEARCH_CRITERIA.major" class="form-input">
            <option value="any">Any Major</option>
            <option value="business">Business</option>
            <option value="engineering">Engineering</option>
            <option value="arts">Arts & Humanities</option>
            <option value="science">Science</option>
            <option value="healthcare">Healthcare</option>
            <option value="computer">Computer Science</option>
          </select>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="findColleges" 
          class="btn btn-primary flex items-center"
          :disabled="IS_LOADING"
        >
          <span v-if="IS_LOADING" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ IS_LOADING ? 'Searching...' : 'Find Colleges' }}
        </button>
      </div>
    </div>
    
    <div v-if="RECOMMENDED_COLLEGES.length > 0" class="space-y-4">
      <h2 class="text-2xl font-bold">Recommended Colleges</h2>
      
      <div v-for="(college, index) in RECOMMENDED_COLLEGES" :key="index" class="card border border-gray-200 hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold text-blue-600">{{ college.name }}</h3>
            <p class="text-gray-600">{{ college.location }}</p>
          </div>
          <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ college.type }}
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4 mt-4">
          <div>
            <p class="text-sm text-gray-500">Acceptance Rate</p>
            <p class="font-medium">{{ college.acceptanceRate }}%</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Average GPA</p>
            <p class="font-medium">{{ college.averageGpa }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tuition</p>
            <p class="font-medium">${{ college.tuition.toLocaleString() }}/year</p>
          </div>
        </div>
        
        <div class="mt-4">
          <p class="text-gray-700">{{ college.description }}</p>
          
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="(strength, i) in college.strengths" :key="i" class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {{ strength }}
            </span>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t flex justify-between">
          <button @click="saveCollege(college)" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            Save
          </button>
          <a :href="college.website" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
            Visit Website
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    
    <div v-else-if="HAS_SEARCHED" class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-500">No colleges found matching your criteria. Try adjusting your search parameters.</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { toast } from 'vue3-toastify'
import { supabase } from '../services/supabase'

export default {
  name: 'CollegesView',
  setup() {
    const SEARCH_CRITERIA = reactive({
      gpa: 3.0,
      location: 'any',
      type: 'any',
      major: 'any'
    })
    
    const RECOMMENDED_COLLEGES = ref([])
    const IS_LOADING = ref(false)
    const HAS_SEARCHED = ref(false)
    
    // This would normally call an AI service API
    // For now, we'll simulate AI recommendations with sample data
    async function findColleges() {
      if (!SEARCH_CRITERIA.gpa) {
        toast.error('Please enter your GPA')
        return
      }
      
      IS_LOADING.value = true
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Sample college data - in a real app, this would come from an AI recommendation API
        RECOMMENDED_COLLEGES.value = generateCollegeRecommendations(SEARCH_CRITERIA)
        HAS_SEARCHED.value = true
        
        // Save search to history
        await saveSearchHistory()
        
        if (RECOMMENDED_COLLEGES.value.length === 0) {
          toast.info('No colleges found matching your criteria')
        }
      } catch (error) {
        toast.error('Error finding colleges')
        console.error('Error finding colleges:', error)
      } finally {
        IS_LOADING.value = false
      }
    }
    
    async function saveSearchHistory() {
      try {
        const { error } = await supabase
          .from('college_searches')
          .insert([
            {
              gpa: SEARCH_CRITERIA.gpa,
              location: SEARCH_CRITERIA.location,
              type: SEARCH_CRITERIA.type,
              major: SEARCH_CRITERIA.major,
              results_count: RECOMMENDED_COLLEGES.value.length
            }
          ])
        
        if (error) throw error
      } catch (error) {
        console.error('Error saving search history:', error)
      }
    }
    
    async function saveCollege(college) {
      try {
        const { error } = await supabase
          .from('saved_colleges')
          .insert([
            {
              name: college.name,
              location: college.location,
              type: college.type,
              acceptance_rate: college.acceptanceRate,
              average_gpa: college.averageGpa,
              tuition: college.tuition,
              website: college.website
            }
          ])
        
        if (error) throw error
        
        toast.success(`${college.name} saved to your list`)
      } catch (error) {
        toast.error('Error saving college')
        console.error('Error saving college:', error)
      }
    }
    
    // Simulated AI college recommendation engine
    function generateCollegeRecommendations(criteria) {
      const collegeDatabase = [
        {
          name: "Ivy University",
          location: "Northeast",
          type: "Private",
          acceptanceRate: 8,
          averageGpa: 3.9,
          tuition: 52000,
          description: "A prestigious Ivy League institution known for academic excellence and world-class research opportunities.",
          strengths: ["Research", "Liberal Arts", "Global Networks"],
          website: "https://www.ivy.edu",
          majors: ["business", "engineering", "arts", "science"]
        },
        {
          name: "Pacific State University",
          location: "West",
          type: "Public",
          acceptanceRate: 65,
          averageGpa: 3.2,
          tuition: 28000,
          description: "A large public research university offering comprehensive programs with strong STEM departments.",
          strengths: ["Engineering", "Computer Science", "Healthcare"],
          website: "https://www.psu.edu",
          majors: ["engineering", "computer", "healthcare", "science"]
        },
        {
          name: "Midwest College",
          location: "Midwest",
          type: "Private",
          acceptanceRate: 45,
          averageGpa: 3.4,
          tuition: 42000,
          description: "A liberal arts college with small class sizes and strong undergraduate teaching focus.",
          strengths: ["Undergraduate Teaching", "Community Engagement", "Arts"],
          website: "https://www.midwestcollege.edu",
          majors: ["arts", "business", "science"]
        },
        {
          name: "Southern Tech Institute",
          location: "South",
          type: "Public",
          acceptanceRate: 60,
          averageGpa: 3.3,
          tuition: 25000,
          description: "A leading technical institute with strong industry connections and excellent job placement rates.",
          strengths: ["Engineering", "Computer Science", "Industry Partnerships"],
          website: "https://www.southerntech.edu",
          majors: ["engineering", "computer", "business"]
        },
        {
          name: "Northeast Liberal Arts College",
          location: "Northeast",
          type: "Private",
          acceptanceRate: 30,
          averageGpa: 3.7,
          tuition: 48000,
          description: "A selective liberal arts college known for producing leaders in various fields.",
          strengths: ["Writing", "Critical Thinking", "Arts & Humanities"],
          website: "https://www.nelac.edu",
          majors: ["arts", "science", "business"]
        },
        {
          name: "Western State University",
          location: "West",
          type: "Public",
          acceptanceRate: 75,
          averageGpa: 3.0,
          tuition: 22000,
          description: "A comprehensive public university with strong professional programs and diverse student body.",
          strengths: ["Affordability", "Diversity", "Business Programs"],
          website: "https://www.wsu.edu",
          majors: ["business", "healthcare", "engineering"]
        },
        {
          name: "Southern Medical University",
          location: "South",
          type: "Private",
          acceptanceRate: 20,
          averageGpa: 3.8,
          tuition: 56000,
          description: "A leading medical and health sciences university with cutting-edge research facilities.",
          strengths: ["Medical Programs", "Research", "Healthcare Leadership"],
          website: "https://www.southernmed.edu",
          majors: ["healthcare", "science"]
        },
        {
          name: "Midwest Engineering Institute",
          location: "Midwest",
          type: "Public",
          acceptanceRate: 50,
          averageGpa: 3.5,
          tuition: 30000,
          description: "A specialized engineering and technology-focused institution with strong industry connections.",
          strengths: ["Engineering", "Innovation", "Industry Partnerships"],
          website: "https://www.mwei.edu",
          majors: ["engineering", "computer", "science"]
        }
      ]
      
      // Filter colleges based on criteria
      let filteredColleges = collegeDatabase.filter(college => {
        // GPA filter with some flexibility
        const gpaMatch = college.averageGpa <= criteria.gpa + 0.3
        
        // Location filter
        const locationMatch = criteria.location === 'any' || college.location.toLowerCase() === criteria.location.toLowerCase()
        
        // Type filter
        const typeMatch = criteria.type === 'any' || college.type.toLowerCase() === criteria.type.toLowerCase()
        
        // Major filter
        const majorMatch = criteria.major === 'any' || college.majors.includes(criteria.major)
        
        return gpaMatch && locationMatch && typeMatch && majorMatch
      })
      
      // Sort by "fit" - prioritize colleges where user's GPA is close to the college's average
      filteredColleges.sort((a, b) => {
        const aGpaDiff = Math.abs(a.averageGpa - criteria.gpa)
        const bGpaDiff = Math.abs(b.averageGpa - criteria.gpa)
        return aGpaDiff - bGpaDiff
      })
      
      // Limit to top 5 recommendations
      return filteredColleges.slice(0, 5)
    }
    
    return {
      SEARCH_CRITERIA,
      RECOMMENDED_COLLEGES,
      IS_LOADING,
      HAS_SEARCHED,
      findColleges,
      saveCollege
    }
  }
}
</script>
