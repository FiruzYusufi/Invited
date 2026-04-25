<script setup lang="ts">
import { ref, onMounted } from 'vue'

const particles = ref([])

onMounted(() => {
  // Список иконок для фона: сердечки, кольца, искры, лепестки/звезды
  const icons = ['ph:heart-fill', 'ph:ring-fill', 'ph:sparkle-fill', 'ph:star-four-fill', 'ph:flower-tulip-fill']
  
  // Палитра мягких цветов из нашего tailwind конфига, сделаем чуть ярче и насыщеннее для светлого фона
  const colors = ['text-powder-400', 'text-champagne-500', 'text-stone-300', 'text-champagne-400', 'text-rose-300']
  
  // Генерируем 45 частиц
  for (let i = 0; i < 45; i++) {
    const icon = icons[Math.floor(Math.random() * icons.length)]
    const isHighlight = icon === 'ph:heart-fill' || icon === 'ph:ring-fill'

    particles.value.push({
      id: i,
      icon,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100,
      size: (Math.random() * 1.4 + 0.8) * (isHighlight ? 1.3 : 1),
      animationDuration: Math.random() * 10 + 18,
      animationDelay: Math.random() * 12,
      opacity: Math.random() * 0.35 + (isHighlight ? 0.5 : 0.35),
      translateX: (Math.random() - 0.5) * 60
    })
  }
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-40 overflow-hidden">
    <Icon 
      v-for="p in particles" 
      :key="p.id"
      :name="p.icon"
      class="absolute bottom-[-10%]"
      :class="[p.color, 'drop-shadow-md']"
      :style="{
        left: `${p.left}%`,
        width: `${p.size}rem`,
        height: `${p.size}rem`,
        '--op': p.opacity,
        '--tx': `${p.translateX}vw`,
        animation: `floatUp ${p.animationDuration}s linear ${p.animationDelay}s infinite`
      }"
    />
  </div>
</template>

<style scoped>
@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: var(--op);
  }
  50% {
    transform: translateY(-60vh) translateX(var(--tx)) rotate(180deg) scale(1.2);
  }
  90% {
    opacity: var(--op);
  }
  100% {
    transform: translateY(-120vh) translateX(calc(var(--tx) * -1)) rotate(360deg) scale(0.8);
    opacity: 0;
  }
}
</style>
