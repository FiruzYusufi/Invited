<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const invitations = ref([])
const loading = ref(true)
const token = useCookie('admin-token')

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/invitations', {
      headers: { Authorization: `Bearer ${token.value}` }
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

useHead({
  title: 'Управление приглашениями - Invited Admin'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/admin" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Приглашения</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <div v-for="inv in invitations" :key="inv.id" class="glass-card p-6 flex justify-between items-center">
          <div>
            <h3 class="font-display text-lg text-stone-800">{{ inv.title }}</h3>
            <p class="text-stone-600 font-serif">{{ inv.groomName }} & {{ inv.brideName }}</p>
            <p class="text-xs text-stone-400 font-sans uppercase tracking-widest mt-1">
              Создано: {{ new Date(inv.createdAt).toLocaleDateString('ru-RU') }}
            </p>
          </div>
          <div class="flex items-center space-x-6">
            <div class="text-center">
              <div class="text-xl font-display text-champagne-600">{{ inv.viewCount }}</div>
              <div class="text-xs text-stone-500 font-serif">просмотров</div>
            </div>
            <div class="text-center">
              <div class="text-xl font-display text-powder-600">{{ inv.rsvpCount }}</div>
              <div class="text-xs text-stone-500 font-serif">ответов</div>
            </div>
            <NuxtLink :to="`/invitation/${inv.id}`" target="_blank" class="text-stone-400 hover:text-champagne-600 transition-colors">
              <Icon name="ph:arrow-square-out-light" class="w-6 h-6" />
            </NuxtLink>
          </div>
        </div>
        
        <div v-if="invitations.length === 0" class="text-center py-12 glass-card">
          <Icon name="ph:envelope-light" class="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 class="font-display text-xl text-stone-600">Приглашений пока нет</h3>
        </div>
      </div>
    </div>
  </div>
</template>
