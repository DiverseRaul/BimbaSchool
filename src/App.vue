<template>
  <div id="app" class="min-h-screen bg-gray-900 text-gray-100">
    <header class="bg-indigo-900 text-white shadow-lg">
      <nav class="container mx-auto flex justify-between items-center p-4">
        <h1 class="text-2xl font-bold tracking-tight">Bimba School</h1>
        <div class="flex gap-6">
          <a href="/" class="hover:text-indigo-300 transition-colors">Home</a>
          <a href="/grades" class="hover:text-indigo-300 transition-colors">Grades</a>
          <a href="/colleges" class="hover:text-indigo-300 transition-colors">Colleges</a>
          <a href="/profile" class="hover:text-indigo-300 transition-colors">Profile</a>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-6 text-indigo-400">Welcome to Bimba School</h1>
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
          <p class="text-xl text-gray-300 mb-6">Your comprehensive school grade management platform</p>
          
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
              <div class="text-3xl text-indigo-400 mb-4">📊</div>
              <h2 class="text-xl font-semibold mb-2">Grade Calculator</h2>
              <p class="text-gray-300">Track and calculate your GPA across all courses.</p>
            </div>
            
            <div class="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
              <div class="text-3xl text-indigo-400 mb-4">🎓</div>
              <h2 class="text-xl font-semibold mb-2">College Finder</h2>
              <p class="text-gray-300">Find colleges matching your academic profile with AI.</p>
            </div>
            
            <div class="bg-gray-700 p-5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
              <div class="text-3xl text-indigo-400 mb-4">📱</div>
              <h2 class="text-xl font-semibold mb-2">Always Available</h2>
              <p class="text-gray-300">Access your data from anywhere with secure storage.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 p-6 mt-12">
      <div class="container mx-auto text-center text-gray-400">
        <p> &copy; {{ CURRENT_YEAR }} Bimba School. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      CURRENT_YEAR: new Date().getFullYear()
    }
  }
}
</script>
