<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const clients = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const token = useCookie('manager-token')
    const response = await $fetch('/api/clients', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    if (response.success) {
      clients.value = response.clients
    }
  } catch (error) {
    console.error('Error loading clients:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Клиенты - Invited Manager'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="font-display text-4xl text-stone-800">Клиенты</h1>
        <NuxtLink to="/clients/create" class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
          Добавить клиента
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else-if="clients.length === 0" class="text-center py-12 glass-card">
        <Icon name="ph:users-light" class="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <h3 class="font-display text-xl text-stone-600">Пока нет клиентов</h3>
      </div>

      <div v-else class="glass-card overflow-hidden">
        <table class="w-full">
          <thead class="bg-stone-100">
            <tr>
              <th class="text-left px-6 py-3 font-sans text-xs uppercase tracking-widest text-stone-500">Имя</th>
              <th class="text-left px-6 py-3 font-sans text-xs uppercase tracking-widest text-stone-500">Email</th>
              <th class="text-left px-6 py-3 font-sans text-xs uppercase tracking-widest text-stone-500">Роль</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.id" class="border-t border-stone-200">
              <td class="px-6 py-4 font-serif text-stone-800">{{ client.name || '-' }}</td>
              <td class="px-6 py-4 font-serif text-stone-600">{{ client.email }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-sans uppercase tracking-wider" :class="client.role === 'CLIENT' ? 'bg-champagne-100 text-champagne-700' : 'bg-powder-100 text-powder-700'">
                  {{ client.role }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
