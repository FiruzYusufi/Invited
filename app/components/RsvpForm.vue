<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  attending: 'yes',
  guests: '1',
  message: ''
})

const submitted = ref(false)

const submitForm = () => {
  // Mock API call or form submission
  setTimeout(() => {
    submitted.value = true
  }, 800)
}
</script>

<template>
  <section class="py-20 md:py-32 px-6 bg-hero-gradient relative overflow-hidden">
    <!-- Decorative bubbles/bokeh -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-powder-200/30 rounded-full blur-[80px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-champagne-300/20 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="max-w-2xl mx-auto relative z-10 reveal">
      <h2 class="font-display text-4xl md:text-5xl text-stone-800 text-center mb-10">RSVP</h2>
      <p class="text-center font-serif text-lg text-stone-600 mb-12">
        Пожалуйста, подтвердите свое присутствие до 1 августа 2026 года
      </p>
      
      <div v-if="submitted" class="glass-card p-12 text-center animate-fade-in">
        <Icon name="ph:check-circle-light" class="w-16 h-16 text-champagne-500 mx-auto mb-6" />
        <h3 class="font-display text-3xl text-stone-800 mb-4">Спасибо!</h3>
        <p class="font-serif text-lg text-stone-600">Мы получили ваш ответ и очень ждем встречи с вами.</p>
      </div>

      <form v-else @submit.prevent="submitForm" class="glass-card p-8 md:p-12 space-y-6">
        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя и Фамилия</label>
          <input v-model="form.name" type="text" required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="Например, Иван Иванов" />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Присутствие</label>
            <select v-model="form.attending" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 appearance-none">
              <option value="yes">С радостью приду</option>
              <option value="no">К сожалению, не смогу</option>
            </select>
          </div>
          
          <div v-if="form.attending === 'yes'">
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Количество персон</label>
            <select v-model="form.guests" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 appearance-none">
              <option value="1">1 человек</option>
              <option value="2">2 человека</option>
              <option value="3">3 человека</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Пожелания или комментарий</label>
          <textarea v-model="form.message" rows="3"
                    class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 resize-none placeholder-stone-400"
                    placeholder="Аллергия на продукты, любимый трек для танцев..."></textarea>
        </div>

        <button type="submit" 
                class="w-full mt-8 bg-stone-800 text-white font-sans uppercase tracking-widest text-sm py-4 rounded-none hover:bg-champagne-700 transition-colors duration-300">
          Отправить
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238c5c34' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right .5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
