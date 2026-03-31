<script setup>
import { useReveal } from '~/composables/useReveal'

useReveal()

useHead({
  title: 'Пригласительное на свадьбу',
  meta: [
    { name: 'description', content: 'С любовью приглашаем вас разделить этот день с нами' }
  ]
})
</script>

<template>
  <div class="overflow-hidden relative bg-milky min-h-screen text-stone-800 font-sans selection:bg-powder-200">
    <AmbientBackground />
    <MusicPlayer />
    <Hero />
    <InvitationDecor />
    <DateTimeTracker />
    <LocationMap />
    <EventTimeline />
    <DressCode />
    <RsvpForm />
    
    <footer class="py-12 text-center text-sm text-stone-500 font-serif bg-champagne-50">
      <div class="reveal">
        <p>Будем счастливы разделить этот день вместе с вами!</p>
        <p class="mt-4 opacity-60">Created with love</p>
      </div>
    </footer>
  </div>
</template>
