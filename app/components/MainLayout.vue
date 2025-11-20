<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import { useThemeStore } from '../stores/theme'
import { REALMS, getSectRank } from '../../shared/constants'
import Tabs from './ui/Tabs.vue'
import SettingsModal from './SettingsModal.vue'

const player = usePlayerStore()
const themeStore = useThemeStore()
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
  const p = player.player
  if (!p?.realm) return 0
  return (p.realm.progress / p.realm.maxProgress) * 100
})

const currentSectRank = computed(() => {
  const p = player.player
  if (!p?.sect?.contribution) return null
  return getSectRank(p.sect.contribution)
})

const qiRate = computed(() => {
  return player.player?.cultivation?.baseRate || 0
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
  <div class="flex min-h-screen font-serif"
       :style="{ backgroundColor: themeStore.colors.bgSecondary }">
    
    <!-- Sidebar -->
    <aside 
      :class="[
        'w-80 border-r-2 overflow-y-auto transition-all duration-300 relative flex-shrink-0',
        'lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0 z-50' : '-translate-x-full lg:w-16'
      ]"
      :style="{ 
        backgroundColor: themeStore.colors.bgPaper,
        borderColor: themeStore.colors.borderPrimary 
      }">
      
      <!-- Toggle Button -->
      <button 
        class="absolute -right-4 top-4 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold z-10 hover:scale-110 transition-transform"
        :style="{
          backgroundColor: themeStore.colors.accentPrimary,
          color: themeStore.colors.textInverse,
          borderColor: themeStore.colors.borderPrimary
        }"
        @click="toggleSidebar">
        <span>{{ sidebarOpen ? '←' : '→' }}</span>
      </button>

      <div v-if="sidebarOpen" class="p-6">
        <!-- Player Avatar & Name -->
        <div class="flex items-center gap-4 mb-8 pb-4 border-b-2"
             :style="{ borderColor: themeStore.colors.borderPrimary }">
          <div 
            class="w-16 h-16 rounded-full border-3 flex items-center justify-center text-3xl font-bold cursor-pointer relative group hover:scale-105 transition-transform"
            :style="{
              backgroundColor: themeStore.colors.accentPrimary,
              color: themeStore.colors.textInverse,
              borderColor: themeStore.colors.borderPrimary
            }"
            @click="openSettings">
            {{ player.player?.name?.[0] || '?' }}
            <div class="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-sm">⚙</span>
            </div>
          </div>
          <div class="flex-1">
            <div class="text-xl font-bold mb-1"
                 :style="{ color: themeStore.colors.textPrimary }">
              {{ player.player?.name || 'Tu Sĩ' }}
            </div>
            <div v-if="player.player?.activeTitle" 
                 class="text-sm font-semibold"
                 :style="{ color: themeStore.colors.accentGold }">
              {{ player.player.activeTitle }}
            </div>
          </div>
        </div>

        <!-- Realm Progress -->
        <div class="mb-6 pb-4 border-b"
             :style="{ borderColor: themeStore.colors.borderSecondary }">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Cảnh Giới
          </div>
          <div class="text-2xl font-bold mb-1 flex items-baseline gap-2"
               :style="{ color: themeStore.colors.textPrimary }">
            {{ player.player?.realm?.major || 'Luyện Khí' }}
            <span class="text-sm"
                  :style="{ color: themeStore.colors.textSecondary }">
              Tầng {{ player.player?.realm?.minor || 1 }}
            </span>
          </div>
          <div class="h-2 rounded-full border overflow-hidden my-2"
               :style="{ 
                 backgroundColor: themeStore.colors.bgTertiary,
                 borderColor: themeStore.colors.borderPrimary 
               }">
            <div class="h-full transition-all duration-300"
                 :style="{ 
                   width: realmProgress + '%',
                   backgroundColor: themeStore.colors.accentPrimary 
                 }"></div>
          </div>
          <div class="text-sm"
               :style="{ color: themeStore.colors.textSecondary }">
            {{ player.player?.realm?.progress || 0 }} / {{ player.player?.realm?.maxProgress || 100 }}
          </div>
        </div>

        <!-- Qi -->
        <div class="mb-6 pb-4 border-b"
             :style="{ borderColor: themeStore.colors.borderSecondary }">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Linh Khí
          </div>
          <div class="text-2xl font-bold font-mono mb-1"
               :style="{ color: themeStore.colors.textPrimary }">
            {{ Math.floor(player.player?.attributes?.qi || 0).toLocaleString() }}
          </div>
          <div class="text-sm"
               :style="{ color: themeStore.colors.textSecondary }">
            +{{ qiRate.toFixed(1) }}/giây
          </div>
        </div>

        <!-- Resources -->
        <div class="mb-6 pb-4 border-b"
             :style="{ borderColor: themeStore.colors.borderSecondary }">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Tài Nguyên
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 p-2 rounded border"
                 :style="{ 
                   backgroundColor: themeStore.colors.bgSecondary,
                   borderColor: themeStore.colors.borderSecondary 
                 }">
              <span class="text-xs font-medium">Linh Thạch:</span>
              <span class="font-semibold font-mono text-sm ml-auto"
                    :style="{ color: themeStore.colors.textPrimary }">
                {{ (player.player?.resources?.spiritStones || 0).toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center gap-2 p-2 rounded border"
                 :style="{ 
                   backgroundColor: themeStore.colors.bgSecondary,
                   borderColor: themeStore.colors.borderSecondary 
                 }">
              <span class="text-xs font-medium">Dược:</span>
              <span class="font-semibold font-mono text-sm ml-auto"
                    :style="{ color: themeStore.colors.textPrimary }">
                {{ (player.player?.resources?.herbs || 0).toLocaleString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mb-6 pb-4 border-b"
             :style="{ borderColor: themeStore.colors.borderSecondary }">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Thuộc Tính
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between text-sm">
              <span :style="{ color: themeStore.colors.textSecondary }">Thể Chất:</span>
              <span class="font-semibold font-mono"
                    :style="{ color: themeStore.colors.textPrimary }">
                {{ player.player?.attributes?.body || 10 }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span :style="{ color: themeStore.colors.textSecondary }">Thần Thức:</span>
              <span class="font-semibold font-mono"
                    :style="{ color: themeStore.colors.textPrimary }">
                {{ player.player?.attributes?.spirit || 10 }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span :style="{ color: themeStore.colors.textSecondary }">Thiên Phú:</span>
              <span class="font-semibold font-mono"
                    :style="{ color: themeStore.colors.textPrimary }">
                {{ player.player?.attributes?.talent || 5 }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sect Info -->
        <div v-if="player.player?.sect?.id" class="mb-6 pb-4 border-b"
             :style="{ borderColor: themeStore.colors.borderSecondary }">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Tông Môn
          </div>
          <div v-if="currentSectRank" 
               class="text-lg font-semibold mb-1"
               :style="{ color: themeStore.colors.accentGold }">
            {{ currentSectRank.name }}
          </div>
          <div class="text-sm"
               :style="{ color: themeStore.colors.textSecondary }">
            Công Hiến: {{ player.player?.sect?.contribution || 0 }}
          </div>
        </div>

        <!-- Equipment Preview -->
        <div class="mb-4">
          <div class="text-xs font-semibold uppercase tracking-wide mb-2"
               :style="{ color: themeStore.colors.textSecondary }">
            Trang Bị
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div 
              v-for="(label, slot) in slots" 
              :key="slot" 
              class="aspect-square flex items-center justify-center text-xs font-semibold rounded-lg border-2"
              :style="{ 
                backgroundColor: themeStore.colors.bgSecondary,
                borderColor: themeStore.colors.borderPrimary,
                color: themeStore.colors.textPrimary
              }">
              <span>{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation Tabs -->
      <div class="border-b-2 sticky top-0 z-10"
           :style="{ 
             backgroundColor: themeStore.colors.bgPaper,
             borderColor: themeStore.colors.borderPrimary 
           }">
        <Tabs v-model="currentTab" :tabs="tabs" />
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto p-8 lg:p-12">
        <slot :current-tab="currentTab" />
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal :show="showSettings" @close="closeSettings" />
    
    <!-- Mobile overlay -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="toggleSidebar"></div>
  </div>
</template>

<style scoped>
/* Minimal custom styles - most styling via Tailwind */
</style>
