<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'
import { useThemeStore } from '../stores/theme'
import { REALMS, getSectRank } from '../../shared/constants'
import { ICONS, SPACING, SHADOWS, TYPOGRAPHY } from '../utils/ui-constants'
import Tabs from './ui/Tabs.vue'
import SettingsModal from './SettingsModal.vue'

const player = usePlayerStore()
const themeStore = useThemeStore()
const currentTab = ref('cultivation')
const sidebarOpen = ref(true)
const showSettings = ref(false)

const tabs = [
  { id: 'cultivation', label: '修炼', icon: ICONS.cultivation },
  { id: 'equipment', label: '装备', icon: ICONS.equipment },
  { id: 'techniques', label: '功法', icon: ICONS.techniques },
  { id: 'sect', label: '宗门', icon: ICONS.sect },
  { id: 'missions', label: '任务', icon: ICONS.missions },
  { id: 'shop', label: '商店', icon: ICONS.shop },
  { id: 'achievements', label: '成就', icon: ICONS.achievements },
  { id: 'ascension', label: '飞升', icon: ICONS.ascension }
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
  // Simplified - actual calculation in server
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
</script>

<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside :class="['sidebar', { 'sidebar-collapsed': !sidebarOpen }]">
      <!-- Toggle Button -->
      <button class="sidebar-toggle" @click="toggleSidebar">
        <span v-if="sidebarOpen">←</span>
        <span v-else">→</span>
      </button>

      <div v-if="sidebarOpen" class="sidebar-content">
        <!-- Player Avatar & Name -->
        <div class="player-header">
          <div class="player-avatar" @click="openSettings">
            {{ player.player?.name?.[0] || '?' }}
            <div class="avatar-overlay">
              <span class="settings-icon">{{ ICONS.settings }}</span>
            </div>
          </div>
          <div class="player-info">
            <div class="player-name">{{ player.player?.name || '修士' }}</div>
            <div v-if="player.player?.activeTitle" class="player-title">{{ player.player.activeTitle }}</div>
          </div>
        </div>

        <!-- Realm Progress -->
        <div class="stat-section">
          <div class="stat-label">Cảnh Giới</div>
          <div class="stat-value realm-value">
            {{ player.player?.realm?.major || 'Luyện Khí' }}
            <span class="realm-minor">Tầng {{ player.player?.realm?.minor || 1 }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: realmProgress + '%' }"></div>
          </div>
          <div class="stat-detail">{{ player.player?.realm?.progress || 0 }} / {{ player.player?.realm?.maxProgress || 100 }}</div>
        </div>

        <!-- Qi -->
        <div class="stat-section">
          <div class="stat-label">Linh Khí</div>
          <div class="stat-value">{{ Math.floor(player.player?.attributes?.qi || 0).toLocaleString() }}</div>
          <div class="stat-detail">+{{ qiRate.toFixed(1) }}/giây</div>
        </div>

        <!-- Resources -->
        <div class="stat-section">
          <div class="stat-label">Tài Nguyên</div>
          <div class="resource-grid">
            <div class="resource-item">
              <span class="resource-icon">💎</span>
              <span class="resource-amount">{{ (player.player?.resources?.spiritStones || 0).toLocaleString() }}</span>
            </div>
            <div class="resource-item">
              <span class="resource-icon">🌿</span>
              <span class="resource-amount">{{ (player.player?.resources?.herbs || 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stat-section">
          <div class="stat-label">Thuộc Tính</div>
          <div class="stats-grid">
            <div class="stat-row">
              <span class="stat-name">Thể Chất:</span>
              <span class="stat-num">{{ player.player?.attributes?.body || 10 }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Thần Thức:</span>
              <span class="stat-num">{{ player.player?.attributes?.spirit || 10 }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-name">Thiên Phú:</span>
              <span class="stat-num">{{ player.player?.attributes?.talent || 5 }}</span>
            </div>
          </div>
        </div>

        <!-- Sect Info -->
        <div v-if="player.player?.sect?.id" class="stat-section">
          <div class="stat-label">Tông Môn</div>
          <div v-if="currentSectRank" class="sect-rank">{{ currentSectRank.name }}</div>
          <div class="stat-detail">Công Hiến: {{ player.player?.sect?.contribution || 0 }}</div>
        </div>

        <!-- Equipment Preview -->
        <div class="stat-section">
          <div class="stat-label">装备</div>
          <div class="equipment-preview">
            <div v-for="slot in ['weapon', 'armor', 'helmet', 'boots', 'accessory', 'talisman']" :key="slot" class="equipment-slot">
              <span class="slot-icon">{{ getSlotIcon(slot) }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="content-area">
      <!-- Top Navigation Tabs -->
      <div class="content-header">
        <Tabs v-model="currentTab" :tabs="tabs" />
      </div>

      <!-- Tab Content -->
      <div class="content-body">
        <slot :current-tab="currentTab" />
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal :show="showSettings" @close="closeSettings" />
  </div>
</template>

<script lang="ts">
function getSlotIcon(slot: string): string {
  const icons: Record<string, string> = {
    weapon: ICONS.weapon,
    armor: ICONS.armor,
    helmet: ICONS.helmet,
    boots: ICONS.boots,
    accessory: ICONS.accessory,
    talisman: ICONS.talisman
  }
  return icons[slot] || '?'
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: v-bind('themeStore.colors.bgSecondary');
  font-family: v-bind('themeStore.colors.textPrimary');
}

/* Sidebar */
.sidebar {
  width: 320px;
  background-color: v-bind('themeStore.colors.bgPaper');
  border-right: 2px solid v-bind('themeStore.colors.borderPrimary');
  overflow-y: auto;
  transition: width 300ms ease;
  position: relative;
  flex-shrink: 0;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: -1rem;
  width: 2rem;
  height: 2rem;
  background-color: v-bind('themeStore.colors.accentPrimary');
  color: v-bind('themeStore.colors.textInverse');
  border: 2px solid v-bind('themeStore.colors.borderPrimary');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-weight: bold;
}

.sidebar-toggle:hover {
  background-color: v-bind('themeStore.colors.accentSecondary');
}

.sidebar-content {
  padding: 1.5rem;
}

/* Player Header */
.player-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid v-bind('themeStore.colors.borderPrimary');
}

.player-avatar {
  width: 64px;
  height: 64px;
  background: v-bind('themeStore.colors.accentPrimary');
  color: v-bind('themeStore.colors.textInverse');
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  border: 3px solid v-bind('themeStore.colors.borderPrimary');
  cursor: pointer;
  position: relative;
  transition: all 200ms ease;
}

.player-avatar:hover {
  border-color: v-bind('themeStore.colors.accentGold');
  transform: scale(1.05);
}

.player-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms ease;
}

.settings-icon {
  font-size: 1.5rem;
  color: v-bind('themeStore.colors.textInverse');
}

.player-info {
  flex: 1;
}

.player-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: v-bind('themeStore.colors.textPrimary');
  margin-bottom: 0.25rem;
}

.player-title {
  font-size: 0.875rem;
  color: v-bind('themeStore.colors.accentGold');
  font-weight: 600;
}

/* Stat Sections */
.stat-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid v-bind('themeStore.colors.borderSecondary');
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: v-bind('themeStore.colors.textSecondary');
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: v-bind('themeStore.colors.textPrimary');
  font-family: v-bind('TYPOGRAPHY.fontFamily.mono');
  margin-bottom: 0.25rem;
}

.realm-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.realm-minor {
  font-size: 0.875rem;
  color: v-bind('themeStore.colors.textSecondary');
}

.stat-detail {
  font-size: 0.875rem;
  color: v-bind('themeStore.colors.textSecondary');
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background-color: v-bind('themeStore.colors.bgTertiary');
  border: 1px solid v-bind('themeStore.colors.borderPrimary');
  border-radius: 999px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: v-bind('themeStore.colors.accentPrimary');
  transition: width 300ms ease;
}

/* Resources */
.resource-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: v-bind('themeStore.colors.bgSecondary');
  border: 1px solid v-bind('themeStore.colors.borderSecondary');
  border-radius: 0.375rem;
}

.resource-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.resource-amount {
  font-weight: 600;
  font-family: v-bind('TYPOGRAPHY.fontFamily.mono');
  font-size: 0.875rem;
  color: v-bind('themeStore.colors.textPrimary');
}

/* Stats Grid */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-name {
  color: v-bind('themeStore.colors.textSecondary');
}

.stat-num {
  font-weight: 600;
  font-family: v-bind('TYPOGRAPHY.fontFamily.mono');
  color: v-bind('themeStore.colors.textPrimary');
}

/* Sect */
.sect-rank {
  font-size: 1.125rem;
  font-weight: 600;
  color: v-bind('themeStore.colors.accentGold');
  margin-bottom: 0.25rem;
}

/* Equipment Preview */
.equipment-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.equipment-slot {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: v-bind('themeStore.colors.bgSecondary');
  border: 2px solid v-bind('themeStore.colors.borderPrimary');
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.slot-icon {
  color: v-bind('themeStore.colors.textPrimary');
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background-color: v-bind('themeStore.colors.bgPaper');
  border-bottom: 2px solid v-bind('themeStore.colors.borderPrimary');
  position: sticky;
  top: 0;
  z-index: 10;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    transform: translateX(0);
  }
  
  .sidebar-collapsed {
    transform: translateX(-100%);
  }
  
  .content-area {
    width: 100%;
  }
  
  .content-body {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 280px;
  }
  
  .player-avatar {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
  
  .player-name {
    font-size: 1.125rem;
  }
  
  .content-body {
    padding: 0.75rem;
  }
}
</style>
