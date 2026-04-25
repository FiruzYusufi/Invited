<script setup lang="ts">
import { useReveal } from '~/composables/useReveal'

useReveal()

useHead({
  title: 'Auraa - Создайте идеальные приглашения',
  meta: [
    { name: 'description', content: 'Создавайте красивые онлайн приглашения для ваших мероприятий. Менеджер все сделает за вас.' }
  ]
})

// Получаем пакеты
const packagesData = await $fetch('/api/packages')
const packages = packagesData?.packages || []
</script>

<template>
  <div class="overflow-hidden relative bg-milky min-h-screen text-stone-800 font-sans selection:bg-powder-200">
    <AmbientBackground />
    
    <!-- Hero Section -->
    <section class="relative h-screen w-full flex items-center justify-center overflow-hidden bg-hero-gradient">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-powder-200/40 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-champagne-300/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style="animation-duration: 4s;"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in-up max-w-4xl mx-auto">
        <div class="mb-6 text-sm tracking-[0.2em] uppercase text-champagne-700 font-sans">
          Создайте идеальное приглашение
        </div>
        
        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl text-stone-800 tracking-tight leading-none mb-8">
          Auraa
        </h1>
        
        <p class="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto font-serif italic mb-12 leading-relaxed">
          Создавайте красивые персонализированные приглашения для ваших особых моментов. 
          Свадьбы, дни рождения, корпоративы — мы поможем сделать каждое мероприятие незабываемым.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink to="https://t.me/your_manager" target="_blank"
                    class="bg-stone-800 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300">
            Связаться с менеджером
          </NuxtLink>
          <NuxtLink to="#features" 
                    class="border border-stone-800 text-stone-800 px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-stone-800 hover:text-white transition-colors duration-300">
            Узнать больше
          </NuxtLink>
        </div>
      </div>

      <a href="#features" 
         class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-stone-500 hover:text-champagne-600 transition-colors duration-300">
        <span class="text-xs uppercase tracking-widest mb-2 font-sans">Узнать больше</span>
        <Icon name="ph:caret-down-light" class="w-6 h-6 animate-bounce" />
      </a>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 md:py-32 px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 reveal">
          <h2 class="font-display text-4xl md:text-5xl text-stone-800 mb-6">Возможности</h2>
          <p class="text-xl text-stone-600 font-serif max-w-2xl mx-auto">
            Все что нужно для создания идеального приглашения
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center reveal reveal-delay-100">
            <div class="w-16 h-16 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:palette-light" class="w-8 h-8 text-champagne-600" />
            </div>
            <h3 class="font-display text-2xl text-stone-800 mb-4">Красивый дизайн</h3>
            <p class="text-stone-600 font-serif">Элегантные темы и возможность полной кастомизации под ваш стиль</p>
          </div>

          <div class="text-center reveal reveal-delay-200">
            <div class="w-16 h-16 bg-powder-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:device-mobile-light" class="w-8 h-8 text-powder-600" />
            </div>
            <h3 class="font-display text-2xl text-stone-800 mb-4">Адаптивность</h3>
            <p class="text-stone-600 font-serif">Идеально выглядит на всех устройствах — от телефона до компьютера</p>
          </div>

          <div class="text-center reveal reveal-delay-300">
            <div class="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="ph:chart-bar-light" class="w-8 h-8 text-gold" />
            </div>
            <h3 class="font-display text-2xl text-stone-800 mb-4">Аналитика</h3>
            <p class="text-stone-600 font-serif">Отслеживайте просмотры, ответы гостей и управляйте списком приглашенных</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 md:py-32 px-6 bg-champagne-50">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 reveal">
          <h2 class="font-display text-4xl md:text-5xl text-stone-800 mb-6">Тарифы</h2>
          <p class="text-xl text-stone-600 font-serif max-w-2xl mx-auto">
            Выберите подходящий пакет для вашего мероприятия
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(pkg, index) in packages" :key="pkg.id" 
               class="glass-card p-8 text-center reveal"
               :class="`reveal-delay-${(index + 1) * 100}`">
            <h3 class="font-display text-2xl text-stone-800 mb-4">{{ pkg.name }}</h3>
            <div class="mb-6">
              <span class="text-4xl font-display text-stone-800">{{ pkg.price === 0 ? 'Бесплатно' : `₽${pkg.price}` }}</span>
              <span v-if="pkg.price > 0" class="text-stone-500 font-serif">/пакет</span>
            </div>
            <p class="text-stone-600 font-serif mb-8">{{ pkg.description }}</p>
            
            <ul class="text-left space-y-3 mb-8">
              <li v-for="feature in pkg.features" :key="feature" class="flex items-center text-stone-600 font-serif">
                <Icon name="ph:check-light" class="w-5 h-5 text-champagne-600 mr-3 flex-shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <NuxtLink to="https://t.me/your_manager" target="_blank"
                      class="block w-full bg-stone-800 text-white py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300">
              Выбрать пакет
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 md:py-32 px-6 bg-stone-800 text-white">
      <div class="max-w-4xl mx-auto text-center reveal">
        <h2 class="font-display text-4xl md:text-5xl mb-6">Готовы создать идеальное приглашение?</h2>
        <p class="text-xl font-serif mb-8 text-stone-300">
          Присоединяйтесь к тысячам довольных клиентов, которые уже создали незабываемые моменты
        </p>
        <NuxtLink to="https://t.me/your_manager" target="_blank"
                  class="inline-block bg-champagne-600 text-white px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors duration-300">
          Написать менеджеру
        </NuxtLink>
      </div>
    </section>

    <footer class="py-12 text-center text-sm text-stone-500 font-serif bg-milky">
      <div class="reveal">
        <p>&copy; 2026 Auraa. Создавайте незабываемые моменты.</p>
        <div class="mt-4 space-x-6">
          <NuxtLink to="/support" class="hover:text-champagne-600 transition-colors">Поддержка</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-champagne-600 transition-colors">Конфиденциальность</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>