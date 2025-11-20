<template>
  <div class="min-h-screen bg-paper-white text-ink-black font-serif flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Background Ink Effect -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/docs/assets/img/background-pattern.svg')]"></div>
    </div>

    <h1 class="text-6xl font-bold mb-8 z-10 tracking-widest drop-shadow-lg">
      Tu Tiên Nhàn Rỗi
    </h1>
    
    <div class="z-10 p-8 border-4 border-ink-black rounded-lg bg-white/80 backdrop-blur-sm shadow-2xl max-w-md w-full text-center">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2">{{ player.name }}</h2>
        <p class="text-xl text-seal-red font-bold">{{ player.formattedRealm }}</p>
      </div>

      <div class="mb-6 p-4 bg-gray-100 rounded border border-gray-300">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">Thiên Địa Chi Khí:</span>
          <span class="capitalize font-bold" :class="getElementColor(player.world.element)">
            {{ getElementName(player.world.element) }}
          </span>
        </div>
        <div class="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
           <div class="bg-gray-500 h-full transition-all duration-1000 ease-linear" :style="{ width: (player.world.cycleTimer / player.world.cycleDuration * 100) + '%' }"></div>
        </div>
      </div>

      <div class="mb-6">
        <p class="mb-2 font-bold">Công Pháp Đang Vận:</p>
        <div class="grid grid-cols-5 gap-2">
          <button 
            v-for="el in ['metal', 'wood', 'water', 'fire', 'earth']" 
            :key="el"
            @click="player.cultivation.element = el"
            class="p-2 rounded border-2 transition-all duration-200 text-xs font-bold capitalize"
            :class="[
              player.cultivation.element === el ? 'border-ink-black bg-gray-200 scale-110' : 'border-transparent bg-white hover:bg-gray-50',
              getElementColor(el)
            ]"
          >
            {{ getElementName(el) }}
          </button>
        </div>
      </div>

      <div class="mb-6 space-y-2">
        <div class="flex justify-between">
          <span>Linh Khí (Qi):</span>
          <span class="font-mono">{{ Math.floor(player.attributes.qi) }} / {{ player.realm.maxProgress }}</span>
        </div>
        <div class="w-full bg-gray-300 h-4 rounded-full overflow-hidden border border-ink-black">
          <div class="bg-jade-green h-full transition-all duration-200" :style="{ width: (player.realm.progress / player.realm.maxProgress * 100) + '%' }"></div>
        </div>
        <div class="text-sm text-gray-600">Tốc độ: {{ player.qiRate }}</div>
      </div>

      <p class="text-lg mb-6 italic">
        "Đại đạo vô hình, sinh dục thiên địa..."
      </p>
      
      <button @click="player.gatherQi(10)" class="px-8 py-3 bg-ink-black text-paper-white text-lg font-bold rounded hover:bg-gray-800 transition-all duration-300 border-2 border-transparent hover:border-seal-red active:scale-95">
        Thổ Nạp (+10 Qi)
      </button>
        <CultivationMenu />

      <div class="flex gap-4 justify-center mt-6">
        <button @click="player.saveGame()" class="px-4 py-2 bg-gray-200 text-ink-black rounded hover:bg-gray-300 transition-colors text-sm font-bold border border-gray-400">
          Lưu Game
        </button>
        <button @click="player.loadGame()" class="px-4 py-2 bg-gray-200 text-ink-black rounded hover:bg-gray-300 transition-colors text-sm font-bold border border-gray-400">
          Tải Game
        </button>
      </div>
      
      <div class="mt-6">
        <p class="mb-2 font-bold">Nhật Ký:</p>
        <GameLog />
      </div>

      <div class="mt-4 text-center">
        <button @click="logout" :disabled="loggingOut" class="text-xs text-red-500 hover:underline">{{ loggingOut ? 'Đang thoát…' : 'Đăng Xuất' }}</button>
      </div>
    </div>

    <div class="absolute bottom-4 text-sm text-gray-500">
      Phiên bản 0.0.1 - Ngũ Hành Cộng Hưởng
    </div>
  </div>
</template>

<script setup lang="ts">
import '../assets/css/main.css'
import { usePlayerStore } from '../stores/player'
import { useGameLoop } from '../composables/useGameLoop'
import GameLog from '../components/GameLog.vue'
// @ts-ignore - Vue SFC typing resolved at build time
import CultivationMenu from '../components/CultivationMenu.vue'
import { useApiAction } from '../composables/useApiAction'

const { loggedIn, user, clear, fetch: fetchSession } = useUserSession()
const player = usePlayerStore()
const { call } = useApiAction()
const loggingOut = ref(false)

// Auto-load or redirect
onMounted(async () => {
  if (loggedIn.value) {
    try {
      const response = await call('LOAD') as any
      if (response.success) {
        // Check offline progress after load
        player.checkOfflineProgress()
      } else if (response.notFound) {
        navigateTo('/create-character')
      }
    } catch (e) {
      console.error('Failed to load', e)
    }
  } else {
    navigateTo('/login')
  }
})

// Start game loop
useGameLoop((dt) => {
  if (loggedIn.value) {
    player.tick(dt)
  }
})

const getElementName = (el: string) => {
  const names: Record<string, string> = { metal: 'Kim', wood: 'Mộc', water: 'Thủy', fire: 'Hỏa', earth: 'Thổ', none: 'Vô' }
  return names[el] || el
}

const getElementColor = (el: string) => {
  const colors: Record<string, string> = {
    metal: 'text-gray-600',
    wood: 'text-green-600',
    water: 'text-blue-600',
    fire: 'text-red-600',
    earth: 'text-yellow-600',
    none: 'text-gray-400'
  }
  return colors[el] || 'text-black'
}

async function logout() {
  try {
    loggingOut.value = true
    await call('AUTH_LOGOUT')
    await fetchSession()
    clear()
    navigateTo('/login')
  } finally {
    loggingOut.value = false
  }
}
</script>
