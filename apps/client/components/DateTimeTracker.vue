<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const targetDate = new Date('2026-08-09T19:00:00')
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let timer = null

const calculateTimeLeft = () => {
  const difference = +targetDate - +new Date()
  
  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((difference / (1000 * 60 * 60)) % 24)
    minutes.value = Math.floor((difference / 1000 / 60) % 60)
    seconds.value = Math.floor((difference / 1000) % 60)
  }
}

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <section class="py-20 md:py-32 px-6 bg-white relative">
    <div class="max-w-4xl mx-auto text-center reveal">
      <h2 class="font-display text-4xl md:text-5xl text-stone-800 mb-12">Когда</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-center">
        <div class="text-xl md:text-2xl font-serif text-stone-600 reveal-delay-200">
          Август<br>
        </div>
        <div class="text-6xl md:text-8xl font-display text-champagne-600 border-x border-champagne-200 py-4 reveal-delay-300">
          9
        </div>
        <div class="text-xl md:text-2xl font-serif text-stone-600 reveal-delay-400">
          2026<br>
          <span class="text-lg italic text-stone-400 mt-2 block">Воскрсенье, 19:00</span>
        </div>
      </div>

      <div class="glass-card max-w-2xl mx-auto p-8 rounded-2xl reveal-delay-500 bg-champagne-50/50">
        <h3 class="font-sans text-sm tracking-[0.2em] uppercase text-stone-500 mb-6">До свадьбы осталось</h3>
        
        <div class="flex justify-center gap-4 md:gap-8 font-serif">
          <div class="flex flex-col items-center">
            <span class="text-3xl md:text-5xl text-stone-800 mb-2">{{ days }}</span>
            <span class="text-xs font-sans uppercase tracking-widest text-stone-400">Дней</span>
          </div>
          <div class="text-3xl md:text-5xl text-champagne-300">:</div>
          
          <div class="flex flex-col items-center">
            <span class="text-3xl md:text-5xl text-stone-800 mb-2">{{ hours.toString().padStart(2, '0') }}</span>
            <span class="text-xs font-sans uppercase tracking-widest text-stone-400">Часов</span>
          </div>
          <div class="text-3xl md:text-5xl text-champagne-300">:</div>
          
          <div class="flex flex-col items-center">
            <span class="text-3xl md:text-5xl text-stone-800 mb-2">{{ minutes.toString().padStart(2, '0') }}</span>
            <span class="text-xs font-sans uppercase tracking-widest text-stone-400">Минут</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
