<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const form = ref({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const createClient = async () => {
  if (!form.value.email || !form.value.password) {
    error.value = 'Заполните обязательные поля'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const token = useCookie('manager-token')
    await $fetch('/api/clients', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        ...form.value,
        role: 'CLIENT'
      }
    })

    await navigateTo('/clients')
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка создания клиента'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Новый клиент - Invited Manager'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/clients" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Новый клиент</h1>
      </div>

      <form @submit.prevent="createClient" class="glass-card p-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя</label>
          <input v-model="form.name" type="text" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="Имя клиента" />
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email *</label>
          <input v-model="form.email" type="email" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="client@email.com" />
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Пароль *</label>
          <input v-model="form.password" type="password" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400" placeholder="••••••••" />
        </div>

        <div class="flex justify-end space-x-4">
          <NuxtLink to="/clients" class="border border-stone-300 text-stone-600 px-8 py-3 font-sans uppercase tracking-widest text-sm hover:bg-stone-100 transition-colors">
            Отмена
          </NuxtLink>
          <button type="submit" :disabled="loading" class="bg-champagne-600 text-white px-8 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors disabled:opacity-50">
            {{ loading ? 'Создание...' : 'Создать клиента' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
