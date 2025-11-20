<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'
import { colors, spacing, shadows, breakpoints } from '../styles/design-tokens'
import { REALMS, getSectRank } from '../../shared/constants'
import Tabs from './ui/Tabs.vue'

const player = usePlayerStore()
const currentTab = ref('cultivation')
const sidebarOpen = ref(true)

const tabs = [
  { id: 'cultivation', label: 'Tu Luyện', icon: '⚡' },
  { id: 'equipment', label: 'Trang Bị', icon: '⚔️' },
  { id: 'techniques', label: 'Kỹ Thuật', icon: '📜' },
  { id: 'sect', label: 'Tông Môn', icon: '🏛️' },
  { id: 'missions', label: 'Nhiệm Vụ', icon: '📋' },
  { id: 'shop', label: 'Cửa Hàng', icon: '🏪' },
  { id: 'achievements', label: 'Thành Tựu', icon: '🏆' },
  { id: 'ascension', label: 'Thăng Thiên', icon: '✨' }
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
          <div class="player-avatar">
            {{ player.player?.name?.[0] || '?' }}
          </div>
          <div class="player-info">
            <div class="player-name">{{ player.player?.name || 'Tu Sĩ' }}</div>
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
          <div class="stat-label">Trang Bị</div>
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
  </div>
</template>

<script lang="ts">
function getSlotIcon(slot: string): string {
  const icons: Record<string, string> = {
    weapon: '⚔️',
    armor: '🛡️',
    helmet: '👑',
    boots: '👢',
    accessory: '💍',
    talisman: '📿'
  }
  return icons[slot] || '❓'
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background-color: v-bind('colors.bg.secondary');
}

/* Sidebar */
.sidebar {
  width: 320px;
  background-color: v-bind('colors.bg.paper');
  border-right: 2px solid v-bind('colors.border.dark');
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
  background-color: v-bind('colors.accent[900]');
  color: white;
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: v-bind('shadows.md');
}

.sidebar-toggle:hover {
  background-color: v-bind('colors.accent[800]');
}

.sidebar-content {
  padding: v-bind('spacing.lg');
}

/* Player Header */
.player-header {
  display: flex;
  align-items: center;
  gap: v-bind('spacing.md');
  margin-bottom: v-bind('spacing.xl');
  padding-bottom: v-bind('spacing.md');
  border-bottom: 2px solid v-bind('colors.border.dark');
}

.player-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, v-bind('colors.accent[900]'), v-bind('colors.accent[700]'));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  border: 3px solid v-bind('colors.border.dark');
  box-shadow: v-bind('shadows.lg');
}

.player-info {
  flex: 1;
}

.player-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: v-bind('colors.text.primary');
  margin-bottom: 0.25rem;
}

.player-title {
  font-size: 0.875rem;
  color: v-bind('colors.accent[900]');
  font-weight: 600;
}

/* Stat Sections */
.stat-section {
  margin-bottom: v-bind('spacing.lg');
  padding-bottom: v-bind('spacing.md');
  border-bottom: 1px solid v-bind('colors.border.light');
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: v-bind('colors.text.secondary');
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: v-bind('colors.text.primary');
  font-family: monospace;
  margin-bottom: 0.25rem;
}

.realm-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.realm-minor {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
}

.stat-detail {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background-color: v-bind('colors.bg.tertiary');
  border: 1px solid v-bind('colors.border.dark');
  border-radius: 999px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, v-bind('colors.accent[900]'), v-bind('colors.accent[700]'));
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
  background-color: v-bind('colors.bg.secondary');
  border: 1px solid v-bind('colors.border.light');
  border-radius: 0.375rem;
}

.resource-icon {
  font-size: 1.25rem;
}

.resource-amount {
  font-weight: 600;
  font-family: monospace;
  font-size: 0.875rem;
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
  color: v-bind('colors.text.secondary');
}

.stat-num {
  font-weight: 600;
  font-family: monospace;
}

/* Sect */
.sect-rank {
  font-size: 1.125rem;
  font-weight: 600;
  color: v-bind('colors.accent[900]');
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
  background-color: v-bind('colors.bg.secondary');
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  font-size: 1.5rem;
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background-color: v-bind('colors.bg.paper');
  border-bottom: 2px solid v-bind('colors.border.dark');
  position: sticky;
  top: 0;
  z-index: 10;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  padding: v-bind('spacing.xl');
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
}
</style>
