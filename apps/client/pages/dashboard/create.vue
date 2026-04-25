<script setup lang="ts">
await navigateTo('/')
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-4xl mx-auto px-6 py-8">
      <div class="flex items-center mb-8">
        <NuxtLink to="/dashboard" class="text-stone-500 hover:text-stone-700 mr-4">
          <Icon name="ph:arrow-left-light" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="font-display text-4xl text-stone-800">Создать приглашение</h1>
      </div>

      <form @submit.prevent="createInvitation" class="space-y-8">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded font-serif">
          {{ error }}
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Основная информация</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Название (необязательно)</label>
              <input v-model="form.title" type="text" placeholder="Например: Наша Свадьба" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя жениха *</label>
              <input v-model="form.groomName" type="text" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Имя невесты *</label>
              <input v-model="form.brideName" type="text" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Дата мероприятия *</label>
              <input v-model="form.eventDate" type="date" required class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Место проведения</label>
              <input v-model="form.location" type="text" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800" />
            </div>
            <div class="md:col-span-2">
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">Описание</label>
              <textarea v-model="form.description" rows="4" class="w-full bg-white/50 border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-champagne-500 transition-colors bg-transparent font-serif text-lg text-stone-800"></textarea>
            </div>
          </div>
        </div>

        <div class="glass-card p-8">
          <h2 class="font-display text-2xl text-stone-800 mb-6">Выберите тему</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="theme in themes" :key="theme.id" type="button" @click="form.theme = theme.id" :class="['p-4 border transition-all text-center', form.theme === theme.id ? 'border-stone-800 bg-stone-50' : 'border-stone-200 hover:border-stone-400']">
              <div class="flex justify-center space-x-1 mb-2">
                <div v-for="color in theme.colors" :key="color" :style="{ backgroundColor: color }" class="w-4 h-4 rounded-full border border-stone-200"></div>
              </div>
              <span class="font-sans text-xs uppercase tracking-widest text-stone-600">{{ theme.name }}</span>
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" :disabled="loading" class="bg-stone-800 text-white px-12 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300 disabled:opacity-50">
            {{ loading ? 'Создание...' : 'Создать приглашение' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
