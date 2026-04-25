<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const form = ref({
  title: '',
  groomName: '',
  brideName: '',
  eventDate: '',
  location: '',
  description: '',
  theme: 'champagne',
  clientId: ''
})

const clients = ref([])
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const token = useCookie('manager-token')
    const response = await $fetch('/api/clients', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response.success) {
      clients.value = response.clients
    }
  } catch (err) {
    console.error('Error loading clients:', err)
  }
})

const themes = [
  { id: 'champagne', name: 'Шампань', colors: ['#f6ebd4', '#dea861', '#ad723a'] },
  { id: 'powder', name: 'Пудровый', colors: ['#f5dce4', '#d56a91', '#a23758'] },
  { id: 'sage', name: 'Шалфей', colors: ['#e8f5e8', '#7fb069', '#556b2f'] },
  { id: 'lavender', name: 'Лаванда', colors: ['#f0e6ff', '#9d7bbe', '#6b46c1'] }
]

const createInvitation = async () => {
  if (!form.value.groomName || !form.value.brideName || !form.value.eventDate || !form.value.clientId) {
    error.value = 'Заполните обязательные поля'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const token = useCookie('manager-token')
    await $fetch('/api/invitations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: form.value
    })

    await navigateTo('/invitations')
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка создания приглашения'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Создать приглашение - Invited Manager'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/invitations" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Создать приглашение</h1>
      </div>

      <form @submit.prevent="createInvitation" class="space-y-8">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Клиент</h2>
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Выберите клиента *</label>
            <select v-model="form.clientId" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800">
              <option value="">Выберите клиента</option>
              <option v-for="client in clients" :key="client.id" :value="client.id">{{ client.name || client.email }}</option>
            </select>
          </div>
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Основная информация</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Название мероприятия</label>
              <input v-model="form.title" type="text" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="Свадьба, День рождения..." />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Дата мероприятия *</label>
              <input v-model="form.eventDate" type="date" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя жениха *</label>
              <input v-model="form.groomName" type="text" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="Имя жениха" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя невесты *</label>
              <input v-model="form.brideName" type="text" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="Имя невесты" />
            </div>
          </div>
          <div class="mt-6">
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Место проведения</label>
            <input v-model="form.location" type="text" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="Адрес или название места" />
          </div>
          <div class="mt-6">
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Описание</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 resize-none placeholder-stone-400" placeholder="Дополнительная информация о мероприятии..."></textarea>
          </div>
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Выберите тему</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="theme in themes" :key="theme.id" @click="form.theme = theme.id" class="cursor-pointer p-4 rounded-lg border-2 transition-all hover:scale-105" :class="form.theme === theme.id ? 'border-champagne-500 bg-champagne-50' : 'border-stone-200 hover:border-stone-300'">
              <div class="flex space-x-2 mb-3">
                <div v-for="color in theme.colors" :key="color" class="w-6 h-6 rounded-full" :style="{ backgroundColor: color }"></div>
              </div>
              <h3 class="font-display text-lg text-stone-800">{{ theme.name }}</h3>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <NuxtLink to="/invitations" class="border border-stone-300 text-stone-600 px-8 py-3 font-sans uppercase tracking-widest text-sm hover:bg-stone-100 transition-colors">Отмена</NuxtLink>
          <button type="submit" :disabled="loading" class="bg-champagne-600 text-white px-8 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors disabled:opacity-50">
            {{ loading ? 'Создание...' : 'Создать приглашение' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
