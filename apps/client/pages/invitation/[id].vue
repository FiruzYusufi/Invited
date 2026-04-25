<script setup lang="ts">
import { useReveal } from '~/composables/useReveal'

definePageMeta({
  layout: false
})

const route = useRoute()
const invitationId = route.params.id

if (invitationId === 'undefined' || !invitationId) {
  await navigateTo('/')
}

useReveal()

// Загрузка данных приглашения
const { data: invitationData } = await useFetch(`/api/invitations/${invitationId}`)
const invitation = computed(() => invitationData.value?.invitation)

useHead({
  title: invitation.value ? `Приглашение ${invitation.value.groomName} & ${invitation.value.brideName}` : 'Приглашение не найдено',
  meta: [
    { name: 'description', content: 'С любовью приглашаем вас разделить с нами самый важный день в нашей жизни' }
  ]
})
</script>

<template>
  <div v-if="invitation" class="overflow-hidden relative bg-milky min-h-screen text-stone-800 font-sans selection:bg-powder-200">
    <AmbientBackground />
    <MusicPlayer />
    <Hero :groom="invitation.groomName" :bride="invitation.brideName" :date="invitation.eventDate" />
    <InvitationDecor />
    <DateTimeTracker :date="invitation.eventDate" />
    <LocationMap :location="invitation.location" />
    <EventTimeline />
    <DressCode />
    <RsvpForm :invitation-id="invitationId" />
    
    <footer class="py-12 text-center text-sm text-stone-500 font-serif bg-champagne-50">
      <div class="reveal">
        <p>Будем счастливы разделить этот день вместе с вами!</p>
      </div>
    </footer>
  </div>

  <div v-else class="min-h-screen bg-milky flex flex-col items-center justify-center px-6 text-center">
    <div class="glass-card p-12 max-w-lg w-full animate-fade-in">
      <Icon name="ph:heart-break-light" class="w-20 h-20 text-powder-400 mb-6 mx-auto" />
      <h1 class="font-display text-4xl text-stone-800 mb-4">404</h1>
      <p class="text-stone-600 font-serif text-lg mb-8">
        Приглашение не найдено или неактивно
      </p>
      <NuxtLink to="/" class="inline-block bg-stone-800 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300">
        Go back home
      </NuxtLink>
    </div>
  </div>
</template>