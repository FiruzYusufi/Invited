<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

onMounted(() => {
  navigateTo('/')
})
</script>

<template>
  <div class="min-h-screen bg-milky flex items-center justify-center">
    <div class="text-stone-500 font-serif animate-pulse">Перенаправление...</div>
  </div>
</template>
