<template>
  <div class="min-h-screen bg-milky">
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-2xl text-stone-800 opacity-50">Auraa</NuxtLink>
      </div>
    </nav>
    <main class="pt-20">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout for public pages
</script>
