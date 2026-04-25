<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

useHead({
  title: 'Дашборд - Invited Manager'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="font-display text-4xl text-stone-800 mb-2">Панель менеджера</h1>
          <p class="text-stone-600 font-serif">Управление клиентами и приглашениями</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink to="/clients" class="glass-card p-8 hover:bg-white/80 transition-colors group">
          <Icon name="ph:users-light" class="w-12 h-12 text-champagne-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="font-display text-xl text-stone-800 mb-2">Клиенты</h3>
          <p class="text-stone-600 font-serif">Управление клиентскими аккаунтами</p>
        </NuxtLink>

        <NuxtLink to="/invitations" class="glass-card p-8 hover:bg-white/80 transition-colors group">
          <Icon name="ph:envelope-light" class="w-12 h-12 text-powder-600 mb-4 group-hover:scale-110 transition-transform" />
          <h3 class="font-display text-xl text-stone-800 mb-2">Приглашения</h3>
          <p class="text-stone-600 font-serif">Создание и настройка приглашений</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
