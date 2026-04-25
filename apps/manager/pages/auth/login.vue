<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const login = async () => {
  if (!form.value.email || !form.value.password) {
    error.value = 'Заполните все поля'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      const token = useCookie('manager-token')
      token.value = response.token

      await navigateTo('/')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Вход - Invited Manager'
})
</script>

<template>
  <div class="min-h-screen bg-hero-gradient flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="font-display text-4xl text-stone-800 mb-2">Invited Manager</h1>
        <p class="text-stone-600 font-serif">Вход для менеджеров</p>
      </div>

      <form @submit.prevent="login" class="glass-card p-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Email</label>
          <input v-model="form.email"
                 type="email"
                 required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="your@email.com" />
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Пароль</label>
          <input v-model="form.password"
                 type="password"
                 required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="••••••••" />
        </div>

        <button type="submit"
                :disabled="loading"
                class="w-full bg-stone-800 text-white font-sans uppercase tracking-widest text-sm py-4 hover:bg-champagne-700 transition-colors duration-300 disabled:opacity-50">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>
