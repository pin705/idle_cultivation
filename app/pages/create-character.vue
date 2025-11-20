<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
const { call } = useApiAction()

const name = ref('')
const selectedDao = ref('')
const error = ref('')

const daos = [
  { 
    id: 'sword', 
    name: 'Kiếm Đạo', 
    desc: 'Chuyên về tấn công, sát phạt. Khởi đầu với Kim hệ.',
    stats: 'Khí: 15 | Thể: 12 | Thần: 8'
  },
  { 
    id: 'alchemy', 
    name: 'Đan Đạo', 
    desc: 'Chuyên về luyện đan, hỗ trợ. Khởi đầu với Hỏa hệ.',
    stats: 'Khí: 12 | Thể: 8 | Thần: 15'
  },
  { 
    id: 'body', 
    name: 'Thể Đạo', 
    desc: 'Lấy thân thể làm gốc, sức sống mãnh liệt. Khởi đầu với Thổ hệ.',
    stats: 'Khí: 8 | Thể: 20 | Thần: 5'
  },
  { 
    id: 'elementalist', 
    name: 'Pháp Đạo', 
    desc: 'Điều khiển ngũ hành, cân bằng. Khởi đầu với Thủy hệ.',
    stats: 'Khí: 12 | Thể: 10 | Thần: 12'
  }
]

const createCharacter = async () => {
  if (!name.value || !selectedDao.value) {
    error.value = 'Vui lòng nhập tên và chọn con đường tu luyện.'
    return
  }

  try {
    const response = await call('CREATE_CHARACTER', {
      name: name.value,
      dao: selectedDao.value
    }) as any

    if (response.success) {
      navigateTo('/')
    } else {
      error.value = response.message
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to create character'
  }
}
</script>

<template>
  <div class="min-h-screen bg-paper-white p-8 font-serif text-ink-black">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-12 uppercase tracking-widest border-b-4 border-ink-black pb-4">
        Khởi Tạo Nhân Vật
      </h1>

      <div class="mb-12 text-center">
        <label class="block text-xl font-bold mb-4">Đạo Hiệu Của Bạn</label>
        <input 
          v-model="name" 
          type="text" 
          class="w-full max-w-md p-4 text-xl text-center border-b-2 border-ink-black bg-transparent outline-none placeholder-gray-400 focus:border-seal-red transition-colors"
          placeholder="Nhập tên nhân vật..."
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div 
          v-for="dao in daos" 
          :key="dao.id"
          @click="selectedDao = dao.id"
          class="p-6 border-2 rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden group"
          :class="selectedDao === dao.id ? 'border-seal-red bg-gray-50 shadow-xl scale-105' : 'border-gray-300 hover:border-ink-black hover:shadow-md'"
        >
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <div class="w-24 h-24 bg-ink-black rounded-full blur-xl"></div>
          </div>
          
          <h3 class="text-2xl font-bold mb-2" :class="selectedDao === dao.id ? 'text-seal-red' : ''">
            {{ dao.name }}
          </h3>
          <p class="text-gray-600 mb-4 italic">{{ dao.desc }}</p>
          <div class="text-sm font-bold bg-gray-200 inline-block px-3 py-1 rounded">
            {{ dao.stats }}
          </div>
        </div>
      </div>

      <div v-if="error" class="text-red-600 text-center font-bold mb-6 text-lg">
        {{ error }}
      </div>

      <div class="text-center">
        <button 
          @click="createCharacter"
          class="px-12 py-4 bg-ink-black text-paper-white text-xl font-bold rounded shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!name || !selectedDao"
        >
          Bắt Đầu Tu Tiên
        </button>
      </div>
    </div>
  </div>
</template>
