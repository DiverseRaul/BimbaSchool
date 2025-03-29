<template>
  <div class="space-y-8">
    <div class="text-center py-12 bg-blue-50 rounded-lg">
      <h1 class="text-4xl font-bold mb-4">Welcome to GradeTrack</h1>
      <p class="text-xl text-gray-600 mb-6">The ultimate school grade management platform</p>
      <div class="flex justify-center gap-4">
        <router-link to="/grades" class="btn btn-primary">Track Your Grades</router-link>
        <router-link to="/colleges" class="btn btn-secondary">Find Colleges</router-link>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="card">
        <div class="text-3xl text-blue-500 mb-4">📊</div>
        <h2 class="text-xl font-semibold mb-2">Grade Calculator</h2>
        <p>Easily calculate your GPA and track your academic progress across all your courses.</p>
      </div>
      
      <div class="card">
        <div class="text-3xl text-blue-500 mb-4">🎓</div>
        <h2 class="text-xl font-semibold mb-2">College Finder</h2>
        <p>Discover colleges that match your academic profile using our AI-powered recommendation system.</p>
      </div>
      
      <div class="card">
        <div class="text-3xl text-blue-500 mb-4">📱</div>
        <h2 class="text-xl font-semibold mb-2">Always Available</h2>
        <p>Access your grades and college recommendations anytime, anywhere with secure cloud storage.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>
