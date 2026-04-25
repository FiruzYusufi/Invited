<script setup lang="ts">
await navigateTo('/')

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const selectedPlan = route.query.plan

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const register = async () => {
  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Заполните все поля'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password
      }
    })

    if (response.success) {
      // Сохраняем токен
      const token = useCookie('client-token')
      token.value = response.token

      // Перенаправляем в дашборд
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Регистрация - Invited'
})
</script>

<template>
  <div class="min-h-screen bg-hero-gradient flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="font-display text-4xl text-stone-800 mb-2">Создать аккаунт</h1>
        <p class="text-stone-600 font-serif">Начните создавать красивые приглашения</p>
        <p v-if="selectedPlan" class="text-champagne-600 font-serif text-sm mt-2">
          Выбранный план: {{ selectedPlan }}
        </p>
      </div>

      <form @submit.prevent="register" class="glass-card p-8 space-y-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя</label>
          <input v-model="form.name" 
                 type="text" 
                 required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="Ваше имя" />
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

        <div>
          <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Подтвердите пароль</label>
          <input v-model="form.confirmPassword" 
                 type="password" 
                 required
                 class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800 placeholder-stone-400"
                 placeholder="••••••••" />
        </div>

        <button type="submit" 
                :disabled="loading"
                class="w-full bg-stone-800 text-white font-sans uppercase tracking-widest text-sm py-4 hover:bg-champagne-700 transition-colors duration-300 disabled:opacity-50">
          {{ loading ? 'Создание...' : 'Создать аккаунт' }}
        </button>

        <div class="text-center">
          <p class="text-stone-600 font-serif">
            Уже есть аккаунт? 
            <NuxtLink to="/auth/login" class="text-champagne-600 hover:text-champagne-700 transition-colors">
              Войти
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>