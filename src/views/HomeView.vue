<template>
  <div class="space-y-8">
    <div class="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
      <h1 class="text-4xl font-bold mb-4 text-indigo-400">Welcome to Bimba School</h1>
      <p class="text-xl text-gray-300 mb-6">Your comprehensive school grade management platform</p>
      <div class="flex justify-center gap-4">
        <router-link to="/grades" class="btn btn-primary">Track Your Grades</router-link>
        <router-link to="/colleges" class="btn btn-secondary">Find Colleges</router-link>
        <router-link to="/classes" class="btn btn-secondary">Manage Classes</router-link>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
        <div class="text-3xl text-indigo-400 mb-4">📊</div>
        <h2 class="text-xl font-semibold mb-2 text-white">Grade Calculator</h2>
        <p class="text-gray-300">Easily calculate your GPA and track your academic progress across all your courses.</p>
        <router-link to="/grades" class="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          Calculate Now →
        </router-link>
      </div>
      
      <div class="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
        <div class="text-3xl text-indigo-400 mb-4">🎓</div>
        <h2 class="text-xl font-semibold mb-2 text-white">College Finder</h2>
        <p class="text-gray-300">Discover colleges that match your academic profile using our AI-powered recommendation system.</p>
        <router-link to="/colleges" class="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          Find Colleges →
        </router-link>
      </div>
      
      <div class="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors">
        <div class="text-3xl text-indigo-400 mb-4">📚</div>
        <h2 class="text-xl font-semibold mb-2 text-white">Custom Classes</h2>
        <p class="text-gray-300">Create and manage your custom classes with flexible settings and detailed tracking.</p>
        <router-link to="/classes" class="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          Manage Classes →
        </router-link>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 class="text-xl font-semibold mb-4 text-indigo-400">Quick GPA Calculator</h2>
        <div class="space-y-4">
          <div v-for="(entry, index) in CALCULATOR_ENTRIES" :key="index" class="flex gap-4">
            <div class="flex-grow">
              <input v-model="entry.name" type="text" class="form-input" placeholder="Course name">
            </div>
            
            <div class="w-24">
              <select v-model="entry.grade" class="form-input">
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
            
            <div class="w-24">
              <input v-model.number="entry.credits" type="number" min="0" class="form-input" placeholder="0">
            </div>
          </div>
          
          <button @click="addEntry" class="text-indigo-400 flex items-center hover:text-indigo-300 transition-colors">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Course
          </button>
          
          <div class="border-t border-gray-700 pt-4 mt-4">
            <div class="flex justify-between items-center">
              <span class="font-medium text-gray-300">Calculated GPA:</span>
              <span class="text-2xl font-bold text-indigo-400">{{ CALCULATED_GPA.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h2 class="text-xl font-semibold mb-4 text-indigo-400">Recent Activity</h2>
        <div class="space-y-4">
          <div v-if="RECENT_ACTIVITIES.length === 0" class="text-center py-8">
            <p class="text-gray-400">No recent activity to display.</p>
            <p class="text-gray-400 text-sm mt-2">Log in to start tracking your grades!</p>
          </div>
          
          <div v-for="(activity, index) in RECENT_ACTIVITIES" :key="index" class="p-3 rounded-lg bg-gray-700 border border-gray-600">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-white">{{ activity.title }}</h3>
                <p class="text-sm text-gray-300">{{ activity.description }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ activity.time }}</span>
            </div>
          </div>
          
          <router-link v-if="RECENT_ACTIVITIES.length > 0" to="/profile" class="text-indigo-400 hover:text-indigo-300 text-sm flex justify-end">
            View All Activity →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../services/supabase'

export default {
  name: 'HomeView',
  setup() {
    const CALCULATOR_ENTRIES = ref([
      { name: '', grade: 'A', credits: 3 }
    ])
    
    const RECENT_ACTIVITIES = ref([])
    
    const GRADE_VALUES = {
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
      let TOTAL_POINTS = 0
      let TOTAL_CREDITS = 0
      
      CALCULATOR_ENTRIES.value.forEach(entry => {
        if (entry.credits && entry.grade) {
          const GRADE_VALUE = GRADE_VALUES[entry.grade]
          TOTAL_POINTS += GRADE_VALUE * entry.credits
          TOTAL_CREDITS += entry.credits
        }
      })
      
      return TOTAL_CREDITS > 0 ? TOTAL_POINTS / TOTAL_CREDITS : 0
    })
    
    function addEntry() {
      CALCULATOR_ENTRIES.value.push({ name: '', grade: 'A', credits: 3 })
    }
    
    async function fetchRecentActivity() {
      try {
        const { data: USER } = await supabase.auth.getUser()
        
        if (USER && USER.user) {
          // In a real app, would fetch actual activities from the database
          RECENT_ACTIVITIES.value = [
            { 
              title: 'Mathematics 101', 
              description: 'Added new class',
              time: '2 hours ago'
            },
            { 
              title: 'Computer Science', 
              description: 'Updated grade to A',
              time: '1 day ago'
            },
            { 
              title: 'GPA Update', 
              description: 'Your GPA is now 3.8',
              time: '3 days ago'
            }
          ]
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }
    
    onMounted(() => {
      fetchRecentActivity()
    })
    
    return {
      CALCULATOR_ENTRIES,
      CALCULATED_GPA,
      RECENT_ACTIVITIES,
      addEntry
    }
  }
}
</script>
