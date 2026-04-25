<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const stats = ref({
  registrationsByDay: [],
  purchasesByDay: [],
  popularPackages: []
})
const loading = ref(true)
const token = useCookie('admin-token')

onMounted(async () => {
  try {
    const response = await $fetch('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response.success) {
      stats.value = response.analytics
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    loading.value = false
  }
})

useHead({
  title: 'Аналитика - Invited Admin'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/admin" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Аналитика</h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Популярные пакеты</h2>
          <div class="space-y-4">
            <div v-for="pkg in stats.popularPackages" :key="pkg.name" class="flex justify-between items-center">
              <span class="font-serif text-stone-700">{{ pkg.name }}</span>
              <div class="flex items-center">
                <div class="w-32 h-2 bg-stone-100 rounded-full mr-4 overflow-hidden">
                  <div class="h-full bg-champagne-500" :style="{ width: `${pkg.percentage}%` }"></div>
                </div>
                <span class="font-sans text-sm font-bold">{{ pkg.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Активность</h2>
          <p class="text-stone-500 font-serif italic">Графики активности будут доступны после накопления достаточного количества данных.</p>
        </div>
      </div>
    </div>
  </div>
</template>
