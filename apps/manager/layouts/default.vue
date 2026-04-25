<template>
  <div class="min-h-screen bg-milky">
    <nav class="bg-stone-800 text-white px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="font-display text-xl">Auraa Manager</NuxtLink>
        <div class="flex items-center space-x-6">
          <NuxtLink to="/clients" class="hover:text-champagne-300 transition-colors">Клиенты</NuxtLink>
          <NuxtLink to="/invitations" class="hover:text-champagne-300 transition-colors">Приглашения</NuxtLink>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>
