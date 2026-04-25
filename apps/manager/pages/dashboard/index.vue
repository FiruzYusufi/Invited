<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
onMounted(() => navigateTo('/'))
</script>
<template><div></div></template>
