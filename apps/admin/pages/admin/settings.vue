<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const settings = ref({
  siteName: 'Invited',
  supportEmail: 'support@invited.com',
  maintenanceMode: false,
  allowRegistration: true
})

const loading = ref(false)
const saved = ref(false)

const saveSettings = () => {
  loading.value = true
  // Имитация сохранения
  setTimeout(() => {
    loading.value = false
    saved.value = true
    setTimeout(() => saved.value = false, 3000)
  }, 1000)
}

useHead({
  title: 'Настройки системы - Invited Admin'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/admin" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Настройки</h1>
      </div>

      <div class="glass-card p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Название сайта</label>
            <input v-model="settings.siteName" type="text" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
          </div>
          <div>
            <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email поддержки</label>
            <input v-model="settings.supportEmail" type="email" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
            <div>
              <h3 class="font-display text-lg text-stone-800">Режим техобслуживания</h3>
              <p class="text-stone-600 font-serif text-sm">Закрыть доступ к сайту для всех, кроме админов</p>
            </div>
            <button @click="settings.maintenanceMode = !settings.maintenanceMode" :class="['w-12 h-6 rounded-full transition-colors relative', settings.maintenanceMode ? 'bg-champagne-600' : 'bg-stone-300']">
              <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', settings.maintenanceMode ? 'left-7' : 'left-1']"></div>
            </button>
          </div>

          <div class="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
            <div>
              <h3 class="font-display text-lg text-stone-800">Регистрация пользователей</h3>
              <p class="text-stone-600 font-serif text-sm">Разрешить новым пользователям создавать аккаунты</p>
            </div>
            <button @click="settings.allowRegistration = !settings.allowRegistration" :class="['w-12 h-6 rounded-full transition-colors relative', settings.allowRegistration ? 'bg-champagne-600' : 'bg-stone-300']">
              <div :class="['absolute top-1 w-4 h-4 bg-white rounded-full transition-all', settings.allowRegistration ? 'left-7' : 'left-1']"></div>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4">
          <span v-if="saved" class="text-green-600 font-serif text-sm animate-fade-in">Настройки сохранены!</span>
          <button @click="saveSettings" :disabled="loading" class="bg-stone-800 text-white px-8 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300 disabled:opacity-50">
            {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
