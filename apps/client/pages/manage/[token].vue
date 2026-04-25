<script setup lang="ts">
const route = useRoute()
const token = route.params.token

if (token === 'undefined' || !token) {
  await navigateTo('/')
}

definePageMeta({
  layout: false
})

const { data: manageData, refresh, pending } = await useFetch(`/api/manage/${token}`)

const invitation = computed(() => manageData.value?.invitation)
const rsvps = computed(() => manageData.value?.rsvps || [])
const guests = computed(() => manageData.value?.guests || [])
const stats = computed(() => manageData.value?.stats)

const activeTab = ref('guests') // 'guests' or 'rsvps'
const newGuest = ref({ name: '', phone: '' })
const isAdding = ref(false)
const isSendingSms = ref(false)

const addGuest = async () => {
  if (!newGuest.value.name || !token || token === 'undefined') return
  isAdding.value = true
  try {
    await $fetch(`/api/manage/guests`, {
      method: 'POST',
      body: { token, ...newGuest.value }
    })
    newGuest.value = { name: '', phone: '' }
    await refresh()
  } catch (e) {
    alert('Ошибка при добавлении гостя')
  } finally {
    isAdding.value = false
  }
}

const sendSms = async (guestId?: string) => {
  isSendingSms.value = true
  const guestIds = guestId ? [guestId] : guests.value.filter(g => !g.smsSent).map(g => g.id)
  
  if (guestIds.length === 0) {
    alert('Нет гостей для отправки SMS')
    isSendingSms.value = false
    return
  }

  try {
    const res = await $fetch('/api/manage/send-sms', {
      method: 'POST',
      body: { guestIds }
    })
    alert(res.message)
    await refresh()
  } catch (e) {
    alert('Ошибка при отправке SMS')
  } finally {
    isSendingSms.value = false
  }
}

const syncContacts = async () => {
  // Имитация синхронизации: добавляем несколько тестовых гостей
  const mockContacts = [
    { name: 'Алексей Иванов', phone: '+7 (900) 111-22-33' },
    { name: 'Мария Петрова', phone: '+7 (900) 444-55-66' },
    { name: 'Дмитрий Соколов', phone: '+7 (900) 777-88-99' }
  ]

  for (const contact of mockContacts) {
    await $fetch(`/api/manage/guests`, {
      method: 'POST',
      body: { token, ...contact }
    })
  }
  await refresh()
  alert('Контакты успешно синхронизированы!')
}

const copyInviteLink = () => {
  if (invitation.value) {
    const url = `${window.location.origin}/invitation/${invitation.value.id}`
    navigator.clipboard.writeText(url)
    alert('Ссылка на приглашение скопирована!')
  }
}

useHead({
  title: invitation.value ? `Управление: ${invitation.value.groomName} & ${invitation.value.brideName}` : 'Загрузка...'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <!-- Header simple -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="font-display text-2xl text-stone-800 opacity-50">Auraa</div>
      </div>
    </nav>

    <div v-if="pending" class="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div class="animate-spin w-12 h-12 border-4 border-champagne-600 border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="!manageData?.success" class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
      <div class="glass-card p-12 max-w-lg w-full animate-fade-in">
        <Icon name="ph:warning-light" class="w-20 h-20 text-red-400 mb-6 mx-auto" />
        <h1 class="font-display text-4xl text-stone-800 mb-4">Ошибка доступа</h1>
        <p class="text-stone-600 font-serif text-lg mb-8">
          Ссылка недействительна или приглашение было удалено.
        </p>
        <NuxtLink to="/" class="inline-block bg-stone-800 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300">
          Go back home
        </NuxtLink>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="font-display text-5xl text-stone-800 mb-4">Список гостей</h1>
        <p class="text-stone-600 font-serif text-xl italic">
          {{ invitation.groomName }} & {{ invitation.brideName }} — {{ new Date(invitation.eventDate).toLocaleDateString('ru-RU') }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="glass-card p-8 text-center border-t-4 border-champagne-500">
          <div class="text-4xl font-display text-stone-800 mb-2">{{ stats.totalGuestsCount }}</div>
          <div class="text-stone-500 font-sans uppercase tracking-widest text-xs">Приглашено</div>
        </div>
        <div class="glass-card p-8 text-center border-t-4 border-blue-500">
          <div class="text-4xl font-display text-stone-800 mb-2">{{ stats.smsSentCount }}</div>
          <div class="text-stone-500 font-sans uppercase tracking-widest text-xs">SMS отправлено</div>
        </div>
        <div class="glass-card p-8 text-center border-t-4 border-green-500">
          <div class="text-4xl font-display text-stone-800 mb-2">{{ stats.attending }}</div>
          <div class="text-stone-500 font-sans uppercase tracking-widest text-xs">Придут</div>
        </div>
        <div class="glass-card p-8 text-center border-t-4 border-gold">
          <div class="text-4xl font-display text-stone-800 mb-2">{{ stats.totalGuests }}</div>
          <div class="text-stone-500 font-sans uppercase tracking-widest text-xs">Итого гостей</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col md:flex-row gap-4 mb-12">
        <button @click="copyInviteLink" class="flex-1 bg-stone-800 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors flex items-center justify-center">
          <Icon name="ph:copy-light" class="mr-2 w-5 h-5" />
          Копировать ссылку
        </button>
        <button @click="syncContacts" class="flex-1 border-2 border-stone-800 text-stone-800 px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-stone-800 hover:text-white transition-colors flex items-center justify-center">
          <Icon name="ph:address-book-light" class="mr-2 w-5 h-5" />
          Синхронизировать контакты
        </button>
        <button @click="sendSms()" :disabled="isSendingSms" class="flex-1 bg-champagne-600 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors flex items-center justify-center disabled:opacity-50">
          <Icon name="ph:paper-plane-tilt-light" class="mr-2 w-5 h-5" />
          {{ isSendingSms ? 'Отправка...' : 'Отправить всем SMS' }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-8 mb-8 border-b border-stone-200">
        <button @click="activeTab = 'guests'" :class="['pb-4 font-display text-xl transition-all relative', activeTab === 'guests' ? 'text-stone-800' : 'text-stone-400 hover:text-stone-600']">
          Список приглашенных
          <div v-if="activeTab === 'guests'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800"></div>
        </button>
        <button @click="activeTab = 'rsvps'" :class="['pb-4 font-display text-xl transition-all relative', activeTab === 'rsvps' ? 'text-stone-800' : 'text-stone-400 hover:text-stone-600']">
          Ответы (RSVP)
          <div v-if="activeTab === 'rsvps'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-800"></div>
        </button>
      </div>

      <!-- Guest Management Tab -->
      <div v-if="activeTab === 'guests'" class="animate-fade-in">
        <div class="glass-card p-8 mb-8">
          <h3 class="font-display text-2xl text-stone-800 mb-6">Добавить гостя</h3>
          <form @submit.prevent="addGuest" class="flex flex-col md:flex-row gap-4">
            <input v-model="newGuest.name" type="text" placeholder="Имя гостя" required class="flex-1 bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg" />
            <input v-model="newGuest.phone" type="tel" placeholder="Телефон" class="flex-1 bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg" />
            <button type="submit" :disabled="isAdding" class="bg-stone-800 text-white px-8 py-3 font-sans uppercase tracking-widest text-xs hover:bg-champagne-700 transition-colors disabled:opacity-50">
              {{ isAdding ? 'Добавление...' : 'Добавить' }}
            </button>
          </form>
        </div>

        <div class="glass-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-stone-50 text-stone-500 font-sans text-xs uppercase tracking-widest">
                  <th class="px-8 py-4">Имя</th>
                  <th class="px-8 py-4">Телефон</th>
                  <th class="px-8 py-4 text-center">Статус SMS</th>
                  <th class="px-8 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                <tr v-for="guest in guests" :key="guest.id" class="hover:bg-stone-50/50 transition-colors">
                  <td class="px-8 py-6 font-serif text-lg text-stone-800">{{ guest.name }}</td>
                  <td class="px-8 py-6 text-stone-600 font-serif">{{ guest.phone || '—' }}</td>
                  <td class="px-8 py-6 text-center">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-tighter', 
                      guest.smsSent ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-400']">
                      {{ guest.smsSent ? 'Отправлено' : 'Не отправлено' }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <button @click="sendSms(guest.id)" :disabled="isSendingSms" class="text-champagne-600 hover:text-champagne-800 font-sans text-xs uppercase tracking-widest flex items-center justify-end ml-auto">
                      <Icon name="ph:paper-plane-tilt-light" class="mr-1 w-4 h-4" />
                      Отправить SMS
                    </button>
                  </td>
                </tr>
                <tr v-if="guests.length === 0">
                  <td colspan="4" class="px-8 py-20 text-center">
                    <Icon name="ph:users-light" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p class="text-stone-500 font-serif">Список пуст. Добавьте гостей или синхронизируйте контакты!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RSVP Tab -->
      <div v-if="activeTab === 'rsvps'" class="animate-fade-in">
        <div class="glass-card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-stone-50 text-stone-500 font-sans text-xs uppercase tracking-widest">
                  <th class="px-8 py-4">Имя гостя</th>
                  <th class="px-8 py-4 text-center">Статус</th>
                  <th class="px-8 py-4 text-center">Кол-во гостей</th>
                  <th class="px-8 py-4">Сообщение</th>
                  <th class="px-8 py-4">Дата ответа</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                <tr v-for="rsvp in rsvps" :key="rsvp.id" class="hover:bg-stone-50/50 transition-colors">
                  <td class="px-8 py-6 font-serif text-lg text-stone-800">{{ rsvp.name }}</td>
                  <td class="px-8 py-6 text-center">
                    <span :class="['px-3 py-1 rounded-full text-[10px] font-sans uppercase tracking-tighter', 
                      rsvp.status === 'ATTENDING' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                      {{ rsvp.status === 'ATTENDING' ? 'Придет' : 'Не придет' }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-center font-serif text-lg">{{ rsvp.guests }}</td>
                  <td class="px-8 py-6 font-serif text-stone-600 italic max-w-xs truncate">{{ rsvp.message || '—' }}</td>
                  <td class="px-8 py-6 text-stone-400 font-sans text-xs">
                    {{ new Date(rsvp.createdAt).toLocaleDateString('ru-RU') }}
                  </td>
                </tr>
                <tr v-if="rsvps.length === 0">
                  <td colspan="5" class="px-8 py-20 text-center">
                    <Icon name="ph:users-three-light" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <p class="text-stone-500 font-serif">Ответов пока нет. Отправьте ссылку вашим гостям!</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  @apply bg-white/70 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl;
}
</style>
