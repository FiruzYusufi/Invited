<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const users = ref([])
const loading = ref(true)
const token = useCookie('admin-token')

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response.success) {
      users.value = response.users
    }
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Управление пользователями - Invited Admin'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/admin" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Пользователи</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else class="glass-card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-stone-800 text-white font-sans text-xs uppercase tracking-widest">
              <th class="px-6 py-4">Имя</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Роль</th>
              <th class="px-6 py-4">Дата регистрации</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-stone-50 transition-colors">
              <td class="px-6 py-4 font-serif">{{ user.name || '—' }}</td>
              <td class="px-6 py-4 font-serif">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-xs font-sans uppercase tracking-widest', 
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                  user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 font-serif text-sm text-stone-500">
                {{ new Date(user.createdAt).toLocaleDateString('ru-RU') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
