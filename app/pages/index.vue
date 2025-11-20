<template>
  <div class="min-h-screen bg-paper-white text-ink-black font-serif relative overflow-hidden">
    <!-- Background Ink Effect -->
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/docs/assets/img/background-pattern.svg')]"></div>
    </div>

    <!-- Header -->
    <div class="relative z-10 text-center py-4 sm:py-6 border-b border-ink-black bg-white/90 backdrop-blur-sm shadow-lg">
      <h1 class="text-3xl sm:text-5xl font-bold tracking-widest">Tu Tiên Nhàn Rỗi</h1>
      <p class="text-xs sm:text-sm text-gray-600 mt-1">Phiên bản 0.0.1 · Ngũ Hành Cộng Hưởng</p>
    </div>
    
    <!-- Main Layout: 2 Columns -->
    <div class="relative z-10 container mx-auto px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 max-w-7xl">
      
      <!-- Left Column: Game Info & Actions -->
      <div class="lg:col-span-2 space-y-3 sm:space-y-6">
        
        <!-- Character Info Card -->
        <div class="p-4 sm:p-6  bg-white/90 backdrop-blur-sm shadow-lg">
          <div class="text-center mb-4">
            <h2 class="text-2xl sm:text-3xl font-bold mb-1">{{ player.name }}</h2>
            <p class="text-lg sm:text-xl text-seal-red font-bold">{{ player.formattedRealm }}</p>
          </div>

          <div class="mb-4 p-3 sm:p-4 bg-gray-50">
            <div class="flex justify-between items-center mb-2 text-sm sm:text-base">
              <span class="font-bold">Thiên Địa Chi Khí:</span>
              <span class="capitalize font-bold" :class="getElementColor(player.world.element)">
                {{ getElementName(player.world.element) }}
              </span>
            </div>
            <div class="w-full bg-gray-300 h-1.5 sm:h-2 overflow-hidden">
               <div class="bg-gray-600 h-full transition-all duration-1000 ease-linear" :style="{ width: (player.world.cycleTimer / player.world.cycleDuration * 100) + '%' }"></div>
            </div>
            
            <!-- World Cycle Indicator -->
            <div v-if="player.world.currentCycle && player.world.currentCycle !== 'normal'" class="mt-2 p-2 bg-purple-50 border border-purple-300 text-xs sm:text-sm">
              <span class="font-bold text-purple-700">{{ getWorldCycleName(player.world.currentCycle) }}</span>
            </div>
            
            <!-- World Event Indicator -->
            <div v-if="player.world.activeEvent?.type" class="mt-2 p-2 bg-yellow-50 border border-yellow-400 text-xs sm:text-sm animate-pulse">
              <span class="font-bold text-yellow-700">🌟 {{ getWorldEventName(player.world.activeEvent.type) }}</span>
            </div>
          </div>

          <div class="mb-4">
            <p class="mb-2 font-bold text-center text-sm sm:text-base">Công Pháp Đang Tu:</p>
            <div class="text-center p-2 bg-gray-100 border border-gray-300">
              <span class="font-bold text-base sm:text-lg">{{ player.cultivation.activeTechnique }}</span>
            </div>
          </div>

          <div class="mb-4 space-y-2">
            <div class="flex justify-between text-sm sm:text-base">
              <span>Linh Khí (Qi):</span>
              <span class="font-mono">{{ Math.floor(player.attributes.qi) }} / {{ player.realm.maxProgress }}</span>
            </div>
            <div class="w-full bg-gray-300 h-3 sm:h-4 overflow-hidden border border-ink-black">
              <div class="bg-gradient-to-r from-yellow-600 to-yellow-500 h-full transition-all duration-200" :style="{ width: (player.realm.progress / player.realm.maxProgress * 100) + '%' }"></div>
            </div>
            <div class="text-xs sm:text-sm text-gray-600 text-center">Tốc độ tu luyện: {{ player.qiRate }} khí/giây</div>
          </div>

          <p class="text-center text-sm sm:text-base italic text-gray-600 border-t border-gray-200 pt-3">
            "Đại đạo vô hình, sinh dục thiên địa..."
          </p>
        </div>

        <!-- Cultivation Menu Card -->
        <div class="p-4 sm:p-6  bg-white/90 backdrop-blur-sm shadow-lg">
          <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center pb-2 border-b border-gray-300">Tu Luyện & Quản Lý</h3>
          <CultivationMenu />
        </div>
      </div>

      <!-- Right Column: Fixed Game Log -->
      <div class="lg:col-span-1">
        <div class="lg:sticky lg:top-6">
          <div class="p-3 sm:p-4  bg-white/90 backdrop-blur-sm shadow-lg">
            <h3 class="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center pb-2 border-b border-gray-300">Nhật Ký Tu Luyện</h3>
            <GameLog />
          </div>
        </div>
      </div>
    </div>

    <!-- Offline Reward Modal -->
    <OfflineRewardModal 
      v-model="player.offlineReward.show"
      :message="player.offlineReward.message"
      :offline-time="player.offlineReward.offlineTime"
      :qi-gained="player.offlineReward.qiGained"
    />
  </div>
</template>

<script setup lang="ts">
import '../assets/css/main.css'
import { usePlayerStore } from '../stores/player'
import { useGameLoop } from '../composables/useGameLoop'
import GameLog from '../components/GameLog.vue'
// @ts-ignore - Vue SFC typing resolved at build time
import CultivationMenu from '../components/CultivationMenu.vue'
import OfflineRewardModal from '../components/OfflineRewardModal.vue'
import { useApiAction } from '../composables/useApiAction'

const { loggedIn, user, clear, fetch: fetchSession } = useUserSession()
const player = usePlayerStore()
const { call } = useApiAction()

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

// Auto-save every 5 seconds
let saveInterval: any
let tickInterval: any
let worldCheckInterval: any
onMounted(() => {
  // Server tick every 5 seconds for accurate cultivation
  tickInterval = setInterval(() => {
    if (loggedIn.value) {
      player.serverTick()
    }
  }, 5000)
  
  // World cycle check every 60 seconds
  worldCheckInterval = setInterval(() => {
    if (loggedIn.value) {
      call('WORLD_CHECK')
    }
  }, 60000)
  
  // Auto-save every 5 seconds
  // saveInterval = setInterval(() => {
  //   if (loggedIn.value) {
  //     player.saveGame()
  //   }
  // }, 5000)
})
onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
  if (saveInterval) clearInterval(saveInterval)
  if (worldCheckInterval) clearInterval(worldCheckInterval)
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

const getWorldCycleName = (cycle: string) => {
  const names: Record<string, string> = {
    normal: 'Bình Thường',
    eclipse: 'Nhật Thực',
    harmony: 'Ngũ Hành Hòa Hợp',
    chaos: 'Hỗn Loạn Thiên Địa'
  }
  return names[cycle] || cycle
}

const getWorldEventName = (eventType: string) => {
  const names: Record<string, string> = {
    meteor_shower: 'Khoáng Thạch Sao Băng',
    spirit_tide: 'Thủy Triều Linh Lực',
    cosmic_resonance: 'Vũ Trụ Cộng Hưởng'
  }
  return names[eventType] || eventType
}
</script>
