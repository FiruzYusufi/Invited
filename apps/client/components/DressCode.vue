<script setup lang="ts">
const colors = [
  { name: 'Шампань', hex: '#F6EBD4' },
  { name: 'Пудровый', hex: '#E391AF' },
  { name: 'Пыльная роза', hex: '#C04B72' },
  { name: 'Бежевый', hex: '#EFDBB2' },
  { name: 'Золотой акцент', hex: '#D4AF37' }
]
</script>

<template>
  <section class="py-20 md:py-32 px-6 bg-champagne-50">
    <div class="max-w-3xl mx-auto text-center reveal">
      <h2 class="font-display text-4xl md:text-5xl text-stone-800 mb-8">Дресс-код</h2>
      
      <p class="font-serif text-lg md:text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        Мы будем очень признательны, если вы поддержите цветовую гамму нашего праздника 
        и выберете наряды в нежных, пастельных тонах.
      </p>

      <div class="flex flex-wrap justify-center gap-6 mt-12 reveal-delay-300">
        <div v-for="(color, index) in colors" :key="index" 
             class="flex flex-col items-center gap-3">
          <div class="w-16 h-16 md:w-20 md:w-20 rounded-full shadow-md border border-stone-200 transition-transform hover:scale-110"
               :style="{ backgroundColor: color.hex }"></div>
          <span class="font-sans text-xs uppercase tracking-widest text-stone-500">{{ color.name }}</span>
        </div>
      </div>
      
      <p class="mt-12 text-sm md:text-base font-serif italic text-stone-500 reveal-delay-400">
        Но самое главное — это ваше присутствие и хорошее настроение!
      </p>
    </div>
  </section>
</template>
