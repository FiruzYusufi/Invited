<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const invitations = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const token = useCookie('manager-token')
    const response = await $fetch('/api/invitations', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (response.success) {
      invitations.value = response.invitations
    }
  } catch (error) {
    console.error('Error loading invitations:', error)
  } finally {
    loading.value = false
  }
})

const copyClientLink = (token: string) => {
  if (!token) {
    alert('Ошибка: У этого приглашения отсутствует токен доступа. Пожалуйста, обратитесь в поддержку.')
    return
  }
  const url = `${window.location.origin.replace('3002', '3000')}/manage/${token}`
  navigator.clipboard.writeText(url)
  alert('Ссылка для личного кабинета клиента скопирована!')
}

useHead({
  title: 'Приглашения - Auraa Manager'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="font-display text-4xl text-stone-800">Приглашения</h1>
        <NuxtLink to="/invitations/create" class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
          Создать приглашение
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else-if="invitations.length === 0" class="text-center py-12 glass-card">
        <Icon name="ph:envelope-light" class="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 class="font-display text-xl text-stone-600">Пока нет приглашений</h3>
      </div>

      <div v-else class="space-y-4">
        <div v-for="invitation in invitations" :key="invitation.id" class="glass-card p-6 flex justify-between items-center">
          <div>
            <h3 class="font-display text-lg text-stone-800">{{ invitation.title }}</h3>
            <p class="text-stone-600 font-serif">{{ invitation.groomName }} & {{ invitation.brideName }}</p>
            <p class="text-stone-500 text-sm">{{ new Date(invitation.eventDate).toLocaleDateString('ru-RU') }}</p>
            <p class="text-xs text-stone-400 font-sans uppercase tracking-widest mt-1">Клиент: {{ invitation.clientName }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-center">
              <div class="text-xl font-display text-champagne-600">{{ invitation.viewCount }}</div>
              <div class="text-xs text-stone-500">просмотров</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-display text-powder-600">{{ invitation.rsvpCount }}</div>
              <div class="text-xs text-stone-500">ответов</div>
            </div>
            <NuxtLink :to="`http://localhost:3000/invitation/${invitation.id}`" target="_blank" class="text-stone-400 hover:text-champagne-600 transition-colors" title="Открыть приглашение">
              <Icon name="ph:arrow-square-out-light" class="w-6 h-6" />
            </NuxtLink>
            <button @click="copyClientLink(invitation.clientToken)" class="text-stone-400 hover:text-stone-800 transition-colors" title="Скопировать ссылку для клиента">
              <Icon name="ph:link-light" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
