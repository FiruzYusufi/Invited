<script setup lang="ts">
import { ref } from 'vue'

const isPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const toggleMusic = async () => {
  if (!audioRef.value) {
    console.warn('Audio element is not ready yet')
    return
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  try {
    await audioRef.value.play()
    isPlaying.value = true
  } catch (err) {
    console.error('Не удалось воспроизвести музыку:', err)
    // здесь можно добавить UI уведомление для пользователя
  }
}
</script>

<template>
  <div class="fixed top-6 right-6 z-50 animate-fade-in">
    <button 
      @click="toggleMusic"
      class="w-12 h-12 rounded-full glass flex items-center justify-center text-stone-600 hover:text-champagne-600 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg group">
      
      <Icon v-if="isPlaying" name="ph:speaker-high-light" class="w-6 h-6 transition-transform" />
      <Icon v-else name="ph:speaker-slash-light" class="w-6 h-6 transition-transform" />
      
      <!-- Optional rotating border effect -->
      <div class="absolute inset-0 rounded-full border border-champagne-300 opacity-0 group-hover:opacity-100 transition-opacity" :class="{ 'animate-spin-slow opacity-100': isPlaying }"></div>
    </button>
    
    <!-- Используем классическую мелодию (Gymnopédie No. 1 - Kevin MacLeod) -->
    <audio ref="audioRef" loop preload="auto">
      <source src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Gymnop%C3%A9die_No._1_-_Kevin_MacLeod.ogg" type="audio/ogg" />
      <!-- fallback for browsers that не поддерживают ogg -->
      <source src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Gymnop%C3%A9die_No._1_-_Kevin_MacLeod.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>
