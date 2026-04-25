<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  invitationId: {
    type: String,
    required: true
  }
})

const form = ref({
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  attending: 'yes',
  guestCount: '1',
  message: '',
  dietaryReqs: ''
})

const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const submitForm = async () => {
  if (!form.value.guestName) {
    error.value = 'Пожалуйста, укажите ваше имя'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch(`/api/rsvp/${props.invitationId}`, {
      method: 'POST',
      body: {
        guestName: form.value.guestName,
        guestEmail: form.value.guestEmail || null,
        guestPhone: form.value.guestPhone || null,
        attending: form.value.attending === 'yes',
        guestCount: parseInt(form.value.guestCount) || 1,
        message: form.value.message || null,
        dietaryReqs: form.value.dietaryReqs || null
      }
    })

    if (response.success) {
      submitted.value = true
      successMessage.value = response.message
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Произошла ошибка при отправке ответа'
  } finally {
    loading.value = false
  }
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
        <p class="font-serif text-lg text-stone-600">{{ successMessage }}</p>
      </div>

      <form v-else @submit.prevent="submitForm" class="glass-card p-8 md:p-12 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя и Фамилия *</label>
          <input v-model="form.guestName" type="text" required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="Например, Иван Иванов" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
            <input v-model="form.guestEmail" type="email"
                   class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                   placeholder="your@email.com" />
          </div>
          
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Телефон</label>
            <input v-model="form.guestPhone" type="tel"
                   class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                   placeholder="+7 (999) 123-45-67" />
          </div>
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
            <select v-model="form.guestCount" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 appearance-none">
              <option value="1">1 человек</option>
              <option value="2">2 человека</option>
              <option value="3">3 человека</option>
              <option value="4">4 человека</option>
            </select>
          </div>
        </div>

        <div v-if="form.attending === 'yes'">
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Особенности питания</label>
          <input v-model="form.dietaryReqs" type="text"
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="Аллергии, вегетарианство и т.д." />
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Пожелания или комментарий</label>
          <textarea v-model="form.message" rows="3"
                    class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 resize-none placeholder-stone-400"
                    placeholder="Любимый трек для танцев, пожелания молодоженам..."></textarea>
        </div>

        <button type="submit" 
                :disabled="loading"
                class="w-full mt-8 bg-stone-800 text-white font-sans uppercase tracking-widest text-sm py-4 rounded-none hover:bg-champagne-700 transition-colors duration-300 disabled:opacity-50">
          {{ loading ? 'Отправка...' : 'Отправить' }}
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
