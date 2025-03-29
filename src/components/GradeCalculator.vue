<template>
  <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
    <h2 class="text-xl font-semibold mb-4 text-indigo-400">GPA Calculator</h2>
    <p class="mb-6 text-gray-300">Enter your grades and credits to calculate your GPA.</p>
    
    <div class="space-y-4">
      <div v-for="(entry, index) in CALCULATOR_ENTRIES" :key="index" class="flex gap-4">
        <div class="flex-grow">
          <label class="block mb-1 text-sm text-gray-300">Course</label>
          <input v-model="entry.name" type="text" class="form-input" placeholder="Course name">
        </div>
        
        <div class="w-24">
          <label class="block mb-1 text-sm text-gray-300">Grade</label>
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
          <label class="block mb-1 text-sm text-gray-300">Credits</label>
          <input v-model.number="entry.credits" type="number" min="0" class="form-input" placeholder="0">
        </div>
        
        <div class="flex items-end mb-1">
          <button @click="removeEntry(index)" class="text-red-400 p-2 hover:text-red-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
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
        
        <button @click="calculateGPA" class="btn btn-primary mt-4 w-full">
          Calculate
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'GradeCalculator',
  setup() {
    const CALCULATOR_ENTRIES = ref([
      { name: '', grade: 'A', credits: 3 }
    ])
    
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
    
    function removeEntry(index) {
      CALCULATOR_ENTRIES.value.splice(index, 1)
      if (CALCULATOR_ENTRIES.value.length === 0) {
        addEntry()
      }
    }
    
    function calculateGPA() {
      // This is a placeholder - the GPA is already calculated reactively
      // This function is here for potential future enhancements
      console.log('GPA calculated:', CALCULATED_GPA.value)
    }
    
    return {
      CALCULATOR_ENTRIES,
      CALCULATED_GPA,
      addEntry,
      removeEntry,
      calculateGPA
    }
  }
}
</script>
