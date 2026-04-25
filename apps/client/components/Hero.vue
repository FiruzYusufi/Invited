<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const props = defineProps({
  groom: String,
  bride: String,
  date: [String, Date]
})

const { y } = useWindowScroll()

const formattedDate = computed(() => {
  if (!props.date) return ''
  const d = new Date(props.date)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>

<template>
  <section class="relative h-screen w-full flex items-center justify-center overflow-hidden bg-hero-gradient">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-powder-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-champagne-300/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style="animation-duration: 4s;"></div>
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
      <div class="mb-4 text-sm tracking-[0.2em] uppercase text-champagne-700 font-sans tracking-widest">
        Мы женимся!
      </div>
      
      <h1 class="font-display text-6xl md:text-8xl lg:text-9xl text-stone-800 tracking-tight leading-none mb-6">
        {{ groom }}
        <span class="block text-4xl md:text-6xl text-champagne-600 font-serif italic my-2">&amp;</span>
        {{ bride }}
      </h1>
      
      <p class="mt-8 text-lg md:text-xl text-stone-600 max-w-xl mx-auto font-serif italic mb-12">
        «С любовью приглашаем вас разделить с нами самый важный день в нашей жизни»
      </p>
      
      <div class="text-xl md:text-2xl font-serif tracking-widest text-stone-800 border-t border-b border-champagne-300 py-3 px-8">
        {{ formattedDate }}
      </div>
    </div>

    <a href="#invitation" 
       class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-stone-500 hover:text-champagne-600 transition-colors duration-300"
       :style="{ opacity: Math.max(0, 1 - y / 300) }">
      <span class="text-xs uppercase tracking-widest mb-2 font-sans">Вниз</span>
      <Icon name="ph:caret-down-light" class="w-6 h-6 animate-bounce" />
    </a>
  </section>
</template>
