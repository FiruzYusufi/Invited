<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const packages = ref([])
const showCreateModal = ref(false)
const editingPackage = ref(null)

const newPackage = ref({
  name: '',
  description: '',
  price: 0,
  inviteLimit: 10,
  features: []
})

const loadPackages = async () => {
  try {
    const token = useCookie('admin-token')
    const response = await $fetch('/api/packages', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response.success) {
      packages.value = response.packages
    }
  } catch (error) {
    console.error('Ошибка загрузки пакетов:', error)
  }
}

const createPackage = async () => {
  if (!newPackage.value.name) return
  
  try {
    const token = useCookie('admin-token')
    await $fetch('/api/packages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        ...newPackage.value,
        features: JSON.stringify(newPackage.value.features)
      }
    })
    
    showCreateModal.value = false
    resetForm()
    await loadPackages()
  } catch (error) {
    console.error('Ошибка создания пакета:', error)
  }
}

const togglePackageStatus = async (pkg) => {
  try {
    // await $fetch(`/api/admin/packages/${pkg.id}`, {
    //   method: 'PATCH',
    //   body: { isActive: !pkg.isActive }
    // })
    
    pkg.isActive = !pkg.isActive
  } catch (error) {
    console.error('Ошибка изменения статуса:', error)
  }
}

const resetForm = () => {
  newPackage.value = {
    name: '',
    description: '',
    price: 0,
    inviteLimit: 10,
    features: []
  }
  editingPackage.value = null
}

onMounted(() => {
  loadPackages()
})

useHead({
  title: 'Управление пакетами - Админ-панель'
})
</script>

<template>
  <div class="min-h-screen bg-milky">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <div class="flex items-center mb-4">
            <NuxtLink to="/admin" class="text-stone-500 hover:text-stone-700 mr-4">
              <Icon name="ph:arrow-left-light" class="w-6 h-6" />
            </NuxtLink>
            <h1 class="font-display text-4xl text-stone-800">Управление пакетами</h1>
          </div>
          <p class="text-stone-600 font-serif">Создавайте и редактируйте тарифные планы</p>
        </div>
        <button @click="showCreateModal = true" 
                class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
          Создать пакет
        </button>
      </div>

      <!-- Packages Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="pkg in packages" :key="pkg.id" class="glass-card p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-display text-xl text-stone-800 mb-1">{{ pkg.name }}</h3>
              <div class="text-2xl font-display text-champagne-600 mb-2">
                {{ pkg.price === 0 ? 'Бесплатно' : `₽${pkg.price}` }}
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="togglePackageStatus(pkg)"
                      class="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      :class="pkg.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                <Icon :name="pkg.isActive ? 'ph:check-light' : 'ph:x-light'" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <p class="text-stone-600 font-serif mb-4">{{ pkg.description }}</p>
          
          <div class="mb-4">
            <div class="text-sm text-stone-500 font-sans uppercase tracking-widest mb-2">Возможности:</div>
            <ul class="space-y-1">
              <li v-for="feature in pkg.features" :key="feature" 
                  class="text-stone-600 font-serif text-sm flex items-center">
                <Icon name="ph:check-light" class="w-4 h-4 text-champagne-600 mr-2" />
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="border-t border-stone-200 pt-4 mt-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-stone-500 font-serif">Лимит приглашений:</span>
              <span class="font-display text-stone-800">{{ pkg.inviteLimit }}</span>
            </div>
            <div class="flex justify-between items-center text-sm mt-2">
              <span class="text-stone-500 font-serif">Продаж:</span>
              <span class="font-display text-stone-800">{{ pkg.sales }}</span>
            </div>
          </div>

          <div class="flex space-x-2 mt-4">
            <button class="flex-1 border border-stone-300 text-stone-600 py-2 px-4 text-sm font-sans uppercase tracking-widest hover:bg-stone-100 transition-colors">
              Редактировать
            </button>
          </div>
        </div>
      </div>

      <!-- Create Package Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="font-display text-2xl text-stone-800">Создать новый пакет</h2>
            <button @click="showCreateModal = false" class="text-stone-500 hover:text-stone-700">
              <Icon name="ph:x-light" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="createPackage" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Название пакета
                </label>
                <input v-model="newPackage.name" 
                       type="text" 
                       required
                       class="w-full border border-stone-300 px-4 py-3 rounded-lg focus:outline-none focus:border-champagne-500 transition-colors" />
              </div>

              <div>
                <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Цена (₽)
                </label>
                <input v-model.number="newPackage.price" 
                       type="number" 
                       min="0"
                       class="w-full border border-stone-300 px-4 py-3 rounded-lg focus:outline-none focus:border-champagne-500 transition-colors" />
              </div>
            </div>

            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">
                Описание
              </label>
              <textarea v-model="newPackage.description" 
                        rows="3"
                        class="w-full border border-stone-300 px-4 py-3 rounded-lg focus:outline-none focus:border-champagne-500 transition-colors resize-none"></textarea>
            </div>

            <div>
              <label class="block font-sans text-xs uppercase tracking-widest text-stone-500 mb-2">
                Лимит приглашений
              </label>
              <input v-model.number="newPackage.inviteLimit" 
                     type="number" 
                     min="1"
                     class="w-full border border-stone-300 px-4 py-3 rounded-lg focus:outline-none focus:border-champagne-500 transition-colors" />
            </div>

            <div class="flex justify-end space-x-4">
              <button type="button" 
                      @click="showCreateModal = false"
                      class="border border-stone-300 text-stone-600 px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-stone-100 transition-colors">
                Отмена
              </button>
              <button type="submit" 
                      class="bg-champagne-600 text-white px-6 py-3 font-sans uppercase tracking-widest text-sm hover:bg-champagne-700 transition-colors">
                Создать пакет
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>