<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-milky flex flex-col items-center justify-center px-6 text-center font-sans">
    <AmbientBackground />
    
    <div class="glass-card p-12 max-w-lg w-full animate-fade-in relative z-10">
      <Icon 
        :name="error.statusCode === 404 ? 'ph:magnifying-glass-light' : 'ph:warning-octagon-light'" 
        class="w-20 h-20 text-powder-400 mb-6 mx-auto" 
      />
      
      <h1 class="font-display text-5xl text-stone-800 mb-4">
        {{ error.statusCode }}
      </h1>
      
      <p class="text-stone-600 font-serif text-lg mb-8">
        {{ error.statusCode === 404 ? 'Страница не найдена' : 'Произошла ошибка' }}
      </p>
      
      <button 
        @click="handleError" 
        class="bg-stone-800 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300"
      >
        Go back home
      </button>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl;
}
</style>
