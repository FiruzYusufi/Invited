<template>
  <div class="min-h-screen bg-milky">
    <nav class="bg-stone-800 text-white px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="font-display text-xl">Invited Admin</NuxtLink>
        <div class="flex items-center space-x-6">
          <NuxtLink to="/admin" class="hover:text-champagne-300 transition-colors">Дашборд</NuxtLink>
          <NuxtLink to="/admin/packages" class="hover:text-champagne-300 transition-colors">Пакеты</NuxtLink>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>
