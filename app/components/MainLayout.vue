<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import { REALMS, getSectRank } from '../../shared/constants'
import Tabs from './ui/Tabs.vue'
import SettingsModal from './SettingsModal.vue'

const player = usePlayerStore()
const currentTab = ref('cultivation')
const sidebarOpen = ref(true)
const showSettings = ref(false)

const tabs = [
  { id: 'cultivation', label: 'Tu Luyện' },
  { id: 'equipment', label: 'Trang Bị' },
  { id: 'techniques', label: 'Kỹ Năng' },
  { id: 'sect', label: 'Tông Môn' },
  { id: 'missions', label: 'Nhiệm Vụ' },
  { id: 'shop', label: 'Cửa Hàng' },
  { id: 'achievements', label: 'Thành Tựu' },
  { id: 'ascension', label: 'Thăng Thiên' }
]

const realmProgress = computed(() => {
  if (!player.realm) return 0
  return (player.realm.progress / player.realm.maxProgress) * 100
})

const currentSectRank = computed(() => {
  if (!player.sect?.contribution) return null
  return getSectRank(player.sect.contribution)
})

const qiRate = computed(() => {
  return player.cultivation?.baseRate || 0
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const openSettings = () => {
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

const slots = {
  weapon: 'Vũ Khí',
  armor: 'Giáp',
  helmet: 'Mũ',
  boots: 'Giày',
  accessory: 'Phụ Kiện',
  talisman: 'Bùa'
}
</script>

<template>
  <div class="flex min-h-screen font-serif bg-paper-aged">
    
    <!-- Sidebar -->
    <aside 
      :class="[
        'w-80 border-r-2 border-ink overflow-y-auto scrollbar-ink transition-all duration-300 relative flex-shrink-0',
        'lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 z-50' : '-translate-x-full lg:w-16'
      ]"
      class="bg-paper">
      
      <!-- Toggle Button -->
      <button 
        class="absolute -right-4 top-4 w-8 h-8 rounded-full border-2 border-ink bg-seal text-paper flex items-center justify-center font-bold z-10 hover:scale-110 hover:bg-seal-light transition-all"
        @click="toggleSidebar">
        <span>{{ sidebarOpen ? '←' : '→' }}</span>
      </button>

      <div v-if="sidebarOpen" class="p-6">
        <!-- Player Avatar & Name -->
        <div class="flex items-center gap-4 mb-8 pb-4 border-b-2 border-ink">
          <div 
            class="w-16 h-16 rounded-full border-3 border-ink bg-seal text-paper flex items-center justify-center text-3xl font-bold cursor-pointer relative group hover:scale-105 transition-transform"
            @click="openSettings">
            {{ player.name?.[0] || '?' }}
            <div class="absolute inset-0 rounded-full bg-ink/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-sm">⚙</span>
            </div>
          </div>
          <div class="flex-1">
            <div class="text-xl font-bold mb-1 text-ink">
              {{ player.name || 'Tu Sĩ' }}
            </div>
            <div v-if="(player as any).activeTitle" class="text-sm font-semibold text-gold">
              {{ (player as any).activeTitle }}
            </div>
          </div>
        </div>

        <!-- Realm Progress -->
        <div class="mb-6 pb-4 border-b border-ink-light">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Cảnh Giới
          </div>
          <div class="text-2xl font-bold mb-1 flex items-baseline gap-2 text-ink">
            {{ player.realm?.major || 'Luyện Khí' }}
            <span class="text-sm text-ink-light">
              Tầng {{ player.realm?.minor || 1 }}
            </span>
          </div>
          <div class="h-2 rounded-full border-2 border-ink overflow-hidden my-2 bg-paper-dark">
            <div 
              class="h-full transition-all duration-300 bg-seal"
              :style="{ width: realmProgress + '%' }"></div>
          </div>
          <div class="text-sm text-ink-light">
            {{ player.realm?.progress || 0 }} / {{ player.realm?.maxProgress || 100 }}
          </div>
        </div>

        <!-- Qi -->
        <div class="mb-6 pb-4 border-b border-ink-light">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Linh Khí
          </div>
          <div class="text-2xl font-bold font-mono mb-1 text-ink">
            {{ Math.floor(player.attributes?.qi || 0).toLocaleString() }}
          </div>
          <div class="text-sm text-ink-light">
            +{{ qiRate.toFixed(1) }}/giây
          </div>
        </div>

        <!-- Resources -->
        <div class="mb-6 pb-4 border-b border-ink-light">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Tài Nguyên
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 p-2 border border-ink-light bg-paper-aged">
              <span class="text-xs font-medium">Linh Thạch:</span>
              <span class="font-semibold font-mono text-sm ml-auto text-ink">
                {{ (player.resources?.spiritStones || 0).toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center gap-2 p-2 border border-ink-light bg-paper-aged">
              <span class="text-xs font-medium">Dược:</span>
              <span class="font-semibold font-mono text-sm ml-auto text-ink">
                {{ (player.resources?.herbs || 0).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-6 pb-4 border-b border-ink-light">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Thuộc Tính
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-sm">
              <span class="text-ink-light">Thể Chất:</span>
              <span class="font-semibold font-mono text-ink">
                {{ player.attributes?.body || 10 }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-light">Thần Thức:</span>
              <span class="font-semibold font-mono text-ink">
                {{ player.attributes?.spirit || 10 }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-ink-light">Thiên Phú:</span>
              <span class="font-semibold font-mono text-ink">
                {{ player.attributes?.talent || 5 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sect Info -->
        <div v-if="player.sect?.id" class="mb-6 pb-4 border-b border-ink-light">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Tông Môn
          </div>
          <div v-if="currentSectRank" class="text-lg font-semibold mb-1 text-gold">
            {{ currentSectRank.name }}
          </div>
          <div class="text-sm text-ink-light">
            Công Hiến: {{ player.sect?.contribution || 0 }}
          </div>
        </div>

        <!-- Equipment Preview -->
        <div class="mb-4">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-light">
            Trang Bị
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="(label, slot) in slots" 
              :key="slot" 
              class="aspect-square flex items-center justify-center text-xs font-semibold border-2 border-ink bg-paper-aged text-ink">
              <span>{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation Tabs -->
      <div class="border-b-2 border-ink sticky top-0 z-10 bg-paper">
        <Tabs v-model="currentTab" :tabs="tabs" />
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto scrollbar-ink p-8 lg:p-12">
        <slot :current-tab="currentTab" />
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal :show="showSettings" @close="closeSettings" />
    
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-ink/50 z-40 lg:hidden"
      @click="toggleSidebar"></div>
  </div>
</template>
