<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
onMounted(() => navigateTo('/invitations/create'))
</script>
<template><div></div></template>
