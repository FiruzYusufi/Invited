<script setup lang="ts">
await navigateTo('/')
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="font-display text-4xl text-stone-800 mb-2">Добро пожаловать, {{ user?.name }}!</h1>
          <p class="text-stone-600 font-serif">Управляйте своими приглашениями</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-stone-500 font-sans">План: {{ user?.plan }}</span>
          <NuxtLink to="/dashboard/create" 
                    class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
            Создать приглашение
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="glass-card p-6 text-center">
          <div class="text-3xl font-display text-champagne-600 mb-2">{{ stats.totalInvitations }}</div>
          <div class="text-stone-600 font-serif">Приглашений</div>
        </div>
        <div class="glass-card p-6 text-center">
          <div class="text-3xl font-display text-powder-600 mb-2">{{ stats.totalViews }}</div>
          <div class="text-stone-600 font-serif">Просмотров</div>
        </div>
        <div class="glass-card p-6 text-center">
          <div class="text-3xl font-display text-gold mb-2">{{ stats.totalRSVPs }}</div>
          <div class="text-stone-600 font-serif">Ответов</div>
        </div>
        <div class="glass-card p-6 text-center">
          <div class="text-3xl font-display text-stone-600 mb-2">{{ stats.remainingInvites }}</div>
          <div class="text-stone-600 font-serif">Осталось</div>
        </div>
      </div>

      <!-- Recent Invitations -->
      <div class="glass-card p-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-display text-2xl text-stone-800">Мои приглашения</h2>
          <NuxtLink to="/dashboard/invitations" class="text-champagne-600 hover:text-champagne-700 font-serif">
            Посмотреть все
          </NuxtLink>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full mx-auto"></div>
          <p class="text-stone-600 font-serif mt-4">Загрузка...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <Icon name="ph:warning-light" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 font-serif">{{ error }}</p>
        </div>

        <div v-else-if="invitations.length === 0" class="text-center py-12">
          <Icon name="ph:envelope-light" class="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 class="font-display text-xl text-stone-600 mb-2">Пока нет приглашений</h3>
          <p class="text-stone-500 font-serif mb-6">Создайте свое первое приглашение прямо сейчас</p>
          <NuxtLink to="/dashboard/create" 
                    class="inline-block bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
            Создать приглашение
          </NuxtLink>
        </div>

        <div v-else class="space-y-4">
          <div v-for="invitation in invitations.slice(0, 5)" :key="invitation.id" 
               class="flex justify-between items-center p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
            <div class="flex-1">
              <h3 class="font-display text-lg text-stone-800">{{ invitation.title }}</h3>
              <p class="text-stone-600 font-serif text-sm">{{ invitation.groomName }} & {{ invitation.brideName }}</p>
              <p class="text-stone-500 text-xs mt-1">{{ new Date(invitation.eventDate).toLocaleDateString('ru-RU') }}</p>
            </div>
            <div class="flex items-center space-x-6 mr-4">
              <div class="text-center">
                <div class="text-xl font-display text-champagne-600">{{ invitation.viewCount }}</div>
                <div class="text-xs text-stone-500">просмотров</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-display text-powder-600">{{ invitation.rsvpCount }}</div>
                <div class="text-xs text-stone-500">ответов</div>
              </div>
            </div>
            <NuxtLink :to="`/invitation/${invitation.id}`" target="_blank"
                      class="text-champagne-600 hover:text-champagne-700">
              <Icon name="ph:arrow-square-out-light" class="w-6 h-6" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <NuxtLink to="/dashboard/create" class="glass-card p-6 hover:bg-white/80 transition-colors group">
          <Icon name="ph:plus-circle-light" class="w-12 h-12 text-champagne-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="font-display text-xl text-stone-800 mb-2">Создать приглашение</h3>
          <p class="text-stone-600 font-serif">Начните с красивого шаблона</p>
        </NuxtLink>

        <NuxtLink to="/dashboard/templates" class="glass-card p-6 hover:bg-white/80 transition-colors group">
          <Icon name="ph:palette-light" class="w-12 h-12 text-powder-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="font-display text-xl text-stone-800 mb-2">Шаблоны</h3>
          <p class="text-stone-600 font-serif">Выберите готовый дизайн</p>
        </NuxtLink>

        <NuxtLink to="/dashboard/analytics" class="glass-card p-6 hover:bg-white/80 transition-colors group">
          <Icon name="ph:chart-bar-light" class="w-12 h-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="font-display text-xl text-stone-800 mb-2">Аналитика</h3>
          <p class="text-stone-600 font-serif">Отслеживайте статистику</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>