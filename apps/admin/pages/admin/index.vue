<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const stats = ref({
  totalUsers: 0,
  totalInvitations: 0,
  totalRsvps: 0,
  totalPurchases: 0
})

const recentUsers = ref([])
const packages = ref([])
const token = useCookie('admin-token')

onMounted(async () => {
  try {
    const [statsRes, packagesRes] = await Promise.all([
      $fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token.value}` }
      }),
      $fetch('/api/packages', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    ])

    if (statsRes.success) {
      stats.value = statsRes.stats
      recentUsers.value = statsRes.stats.recentUsers || []
    }

    if (packagesRes.success) {
      packages.value = packagesRes.packages
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

useHead({
  title: 'Админ-панель - Invited'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="font-display text-4xl text-stone-800 mb-2">Админ-панель</h1>
          <p class="text-stone-600 font-serif">Управление платформой Invited</p>
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/admin/packages" 
                    class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
            Управление пакетами
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="glass-card p-6 text-center">
          <Icon name="ph:users-light" class="w-8 h-8 text-champagne-600 mx-auto mb-3" />
          <div class="text-3xl font-display text-stone-800 mb-2">{{ stats.totalUsers.toLocaleString() }}</div>
          <div class="text-stone-600 font-serif">Пользователей</div>
        </div>
        
        <div class="glass-card p-6 text-center">
          <Icon name="ph:envelope-light" class="w-8 h-8 text-powder-600 mx-auto mb-3" />
          <div class="text-3xl font-display text-stone-800 mb-2">{{ stats.totalInvitations.toLocaleString() }}</div>
          <div class="text-stone-600 font-serif">Приглашений</div>
        </div>
        
        <div class="glass-card p-6 text-center">
          <Icon name="ph:check-circle-light" class="w-8 h-8 text-gold mx-auto mb-3" />
          <div class="text-3xl font-display text-stone-800 mb-2">{{ stats.totalRsvps.toLocaleString() }}</div>
          <div class="text-stone-600 font-serif">RSVP</div>
        </div>
        
        <div class="glass-card p-6 text-center">
          <Icon name="ph:package-light" class="w-8 h-8 text-stone-600 mx-auto mb-3" />
          <div class="text-3xl font-display text-stone-800 mb-2">{{ stats.totalPurchases }}</div>
          <div class="text-stone-600 font-serif">Покупок</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Packages Overview -->
        <div class="glass-card p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-display text-2xl text-stone-800">Пакеты</h2>
            <NuxtLink to="/admin/packages" class="text-champagne-600 hover:text-champagne-700 font-serif">
              Управление
            </NuxtLink>
          </div>

          <div class="space-y-4">
            <div v-for="pkg in packages" :key="pkg.id" 
                 class="flex justify-between items-center p-4 bg-white/50 rounded-lg">
              <div>
                <h3 class="font-display text-lg text-stone-800">{{ pkg.name }}</h3>
                <p class="text-stone-600 font-serif">{{ pkg.price === 0 ? 'Бесплатно' : `₽${pkg.price}` }}</p>
              </div>
              <div class="text-right">
                <div class="text-lg font-display text-champagne-600">{{ pkg.inviteLimit }}</div>
                <div class="text-stone-500 text-sm font-serif">приглашений</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Быстрые действия</h2>
          
          <div class="space-y-4">
            <NuxtLink to="/admin/users" 
                      class="flex items-center p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors group">
              <Icon name="ph:users-light" class="w-8 h-8 text-champagne-600 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 class="font-display text-lg text-stone-800">Управление пользователями</h3>
                <p class="text-stone-600 font-serif text-sm">Просмотр и модерация аккаунтов</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/invitations" 
                      class="flex items-center p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors group">
              <Icon name="ph:envelope-light" class="w-8 h-8 text-powder-600 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 class="font-display text-lg text-stone-800">Приглашения</h3>
                <p class="text-stone-600 font-serif text-sm">Модерация контента</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/analytics" 
                      class="flex items-center p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors group">
              <Icon name="ph:chart-bar-light" class="w-8 h-8 text-gold mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 class="font-display text-lg text-stone-800">Аналитика</h3>
                <p class="text-stone-600 font-serif text-sm">Детальная статистика</p>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/settings" 
                      class="flex items-center p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors group">
              <Icon name="ph:gear-light" class="w-8 h-8 text-stone-600 mr-4 group-hover:scale-110 transition-transform" />
              <div>
                <h3 class="font-display text-lg text-stone-800">Настройки</h3>
                <p class="text-stone-600 font-serif text-sm">Конфигурация системы</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>