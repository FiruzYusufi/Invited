<script setup>
const programEvents = [
  {
    time: '14:30',
    title: 'Сбор гостей',
    description: 'Приветственный фуршет, музыка и знакомство',
    icon: 'ph:cheers-light'
  },
  {
    time: '15:30',
    title: 'Церемония',
    description: 'Трогательный момент обмена клятвами',
    icon: 'ph:heart-straight-light'
  },
  {
    time: '17:00',
    title: 'Праздничный банкет',
    description: 'Начало ужина, поздравления, танцы',
    icon: 'ph:wine-light'
  },
  {
    time: '21:30',
    title: 'Свадебный торт',
    description: 'Сладкое завершение вечера',
    icon: 'ph:cake-light'
  },
  {
    time: '23:00',
    title: 'Завершение вечера',
    description: 'Финальный аккорд и проводы гостей',
    icon: 'ph:sparkle-light'
  }
]
</script>

<template>
  <section class="py-20 md:py-32 px-6 bg-white">
    <div class="max-w-2xl mx-auto">
      <h2 class="font-display text-4xl md:text-5xl text-stone-800 mb-16 text-center reveal">Программа дня</h2>
      
      <div class="relative wrap overflow-hidden p-4">
        <!-- Connecting Line -->
        <div class="border-2-2 absolute border-opacity-20 border-champagne-400 h-full border" style="left: 50%"></div>
        
        <!-- Timeline Events -->
        <div v-for="(event, index) in programEvents" :key="index" 
             class="mb-12 flex justify-between items-center w-full reveal"
             :class="[ index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline' ]">
          
          <div class="order-1 w-5/12 timeline-spacer"></div>
          
          <div class="z-20 flex items-center order-1 w-12 h-12 rounded-full shadow-md text-champagne-600 bg-white border border-champagne-100 flex-shrink-0 justify-center">
            <Icon :name="event.icon" class="w-6 h-6" />
          </div>
          
          <div class="order-1 text-center md:text-left rounded-lg w-5/12 timeline-content px-2 md:px-6 py-4"
               :class="[ index % 2 === 0 ? 'text-right md:text-right' : 'text-left' ]">
            <p class="mb-2 text-2xl font-display text-champagne-600">{{ event.time }}</p>
            <h4 class="mb-2 font-serif text-lg md:text-xl text-stone-800">{{ event.title }}</h4>
            <p class="text-sm md:text-base leading-snug tracking-wide text-opacity-100 text-stone-500 font-sans italic">
              {{ event.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 768px) {
  .border-2-2 {
    left: 24px !important;
  }
  .left-timeline, .right-timeline {
    flex-direction: row !important;
  }
  .timeline-spacer {
    display: none;
  }
  .left-timeline .timeline-content, .right-timeline .timeline-content {
    width: 100%;
    padding-left: 2rem;
    text-align: left !important;
  }
}
</style>
