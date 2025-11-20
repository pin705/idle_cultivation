<script setup lang="ts">
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { REALMS, TECHNIQUES } from '../../../shared/constants'
import { getCycleName, getEventName, getElementDisplayName } from '../../utils/game-helpers'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'
import { useThemeStore } from '../../stores/theme'

const player = usePlayerStore()
const themeStore = useThemeStore()
const { call } = useApiAction()
const loading = ref(false)

const activeTechnique = computed(() => {
  const techKey = player?.cultivation?.activeTechnique
  if (!techKey) return null
  return TECHNIQUES.find(t => t.key === techKey)
})

const worldCycle = computed(() => {
  return player?.world?.currentCycle || 'normal'
})

const worldEvent = computed(() => {
  return player?.world?.activeEvent?.type || null
})

const realmTimeline = computed(() => {
  const currentRealm = player?.realm?.major || 'Luyện Khí'
  const currentIndex = REALMS.indexOf(currentRealm)
  return REALMS.map((realm, index) => ({
    name: realm,
    completed: index < currentIndex,
    current: index === currentIndex,
    locked: index > currentIndex
  }))
})

async function breakthrough() {
  loading.value = true
  try {
    await call('BREAKTHROUGH')
  } finally {
    loading.value = false
  }
}

async function startTribulation() {
  loading.value = true
  try {
    await call('TRIB_PREPARE')
    await call('TRIB_START')
  } finally {
    loading.value = false
  }
}

async function condenseQi() {
  loading.value = true
  try {
    await call('QI_CONDENSE')
  } finally {
    loading.value = false
  }
}

const logs = computed(() => {
  return (player?.logs || []).slice(-10).reverse()
})

function getSectBonus() {
  // Helper function for displaying sect bonus percentage
  return 0 // Placeholder, will be calculated based on sect rank
}
</script>

<template>
  <div class="cultivation-tab">
    <div class="cultivation-grid">
      <!-- Left Column -->
      <div class="cultivation-col">
        <!-- Realm Progress -->
        <Card title="Tu Vi Cảnh Giới" shadow>
          <div class="realm-timeline">
            <div v-for="(realm, index) in realmTimeline" :key="realm.name" class="realm-step">
              <div :class="['realm-marker', { 
                'realm-completed': realm.completed, 
                'realm-current': realm.current,
                'realm-locked': realm.locked 
              }]">
                <span v-if="realm.completed">✓</span>
                <span v-else-if="realm.current">{{ player?.realm?.minor }}</span>
                <span v-else>🔒</span>
              </div>
              <div class="realm-name">{{ realm.name }}</div>
              <div v-if="index < realmTimeline.length - 1" class="realm-connector"></div>
            </div>
          </div>
        </Card>

        <!-- Active Technique -->
        <Card title="Công Pháp Tu Luyện" shadow class="mt-4">
          <div v-if="activeTechnique" class="technique-display">
            <div class="technique-header">
              <div class="technique-name">{{ activeTechnique.name }}</div>
              <div class="technique-element">
                {{ getElementDisplayName(activeTechnique.element) }}
              </div>
            </div>
            <div class="technique-desc">{{ activeTechnique.description }}</div>
            <Divider spacing="sm" />
            <div class="technique-stats">
              <div class="stat-item">
                <span>Tốc độ Tu Luyện:</span>
                <span class="stat-highlight">+{{ ((activeTechnique.baseRate - 1) * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="no-technique">
            <p>Chưa trang bị công pháp</p>
            <Button size="sm" @click="() => $emit('change-tab', 'techniques')">Chọn Công Pháp</Button>
          </div>
        </Card>

        <!-- World State -->
        <Card title="Thiên Địa Linh Khí" shadow class="mt-4">
          <div class="world-state">
            <div class="world-cycle">
              <div class="cycle-label">Chu Kỳ Ngũ Hành:</div>
              <div :class="['cycle-value', `cycle-${worldCycle}`]">{{ getCycleName(worldCycle) }}</div>
            </div>
            <div v-if="worldEvent" class="world-event">
              <div class="event-label">Sự Kiện:</div>
              <div class="event-value">{{ getEventName(worldEvent) }}</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="cultivation-col">
        <!-- Cultivation Rate Breakdown -->
        <Card title="Tốc Độ Tu Luyện" shadow>
          <div class="rate-breakdown">
            <div class="rate-total">
              <span>Tổng:</span>
              <span class="rate-value">+{{ (player?.cultivation?.baseRate || 1).toFixed(1) }} Qi/giây</span>
            </div>
            <Divider spacing="sm" />
            <div class="rate-factors">
              <div class="factor-item">
                <span>Cơ Bản:</span>
                <span>×1.0</span>
              </div>
              <div class="factor-item">
                <span>Công Pháp:</span>
                <span class="factor-positive">+{{ activeTechnique ? ((activeTechnique.baseRate - 1) * 100).toFixed(0) : 0 }}%</span>
              </div>
              <div class="factor-item">
                <span>Trang Bị:</span>
                <span class="factor-positive">+0%</span>
              </div>
              <div class="factor-item">
                <span>Chu Kỳ Thiên Địa:</span>
                <span class="factor-positive">+0%</span>
              </div>
              <div v-if="player?.sect?.contribution" class="factor-item">
                <span>Tông Môn:</span>
                <span class="factor-positive">+{{ getSectBonus() }}%</span>
              </div>
            </div>
          </div>
        </Card>

        <!-- Quick Actions -->
        <Card title="Hành Động" shadow class="mt-4">
          <div class="actions-grid">
            <Button variant="primary" size="lg" full-width :loading="loading" @click="breakthrough">
              Đột Phá Cảnh Giới
            </Button>
            <Button variant="accent" size="lg" full-width :loading="loading" @click="startTribulation">
              Độ Thiên Kiếp
            </Button>
            <Button variant="secondary" size="lg" full-width :loading="loading" @click="condenseQi">
              Ngưng Tụ Linh Khí
            </Button>
          </div>
        </Card>

        <!-- Recent Logs -->
        <Card title="Nhật Ký Tu Luyện" shadow class="mt-4">
          <div class="logs-container">
            <div v-for="(log, index) in logs" :key="index" class="log-entry">
              <span class="log-time">{{ new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }}</span>
              <span class="log-text">{{ log }}</span>
            </div>
            <div v-if="logs.length === 0" class="no-logs">
              Chưa có nhật ký
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cultivation-tab {
  max-width: 1400px;
  margin: 0 auto;
}

.cultivation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.cultivation-col {
  display: flex;
  flex-direction: column;
}

.mt-4 {
  margin-top: 1rem;
}

/* Realm Timeline */
.realm-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.realm-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.realm-marker {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid v-bind('colors.border.dark');
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: v-bind('colors.bg.secondary');
  color: v-bind('colors.text.secondary');
  z-index: 2;
}

.realm-completed {
  background-color: v-bind('colors.success');
  border-color: v-bind('colors.success');
  color: white;
}

.realm-current {
  background: linear-gradient(135deg, v-bind('colors.accent[900]'), v-bind('colors.accent[700]'));
  border-color: v-bind('colors.accent[900]');
  color: white;
  box-shadow: 0 0 20px rgba(127, 29, 29, 0.5);
}

.realm-locked {
  opacity: 0.4;
}

.realm-name {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: v-bind('colors.text.secondary');
}

.realm-connector {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  right: -50%;
  height: 2px;
  background-color: v-bind('colors.border.dark');
  z-index: 1;
}

/* Technique Display */
.technique-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.technique-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.technique-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: v-bind('colors.text.primary');
}

.technique-element {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background-color: currentColor;
  color: white;
  opacity: 0.9;
}

.technique-desc {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
  line-height: 1.5;
}

.technique-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-highlight {
  font-weight: 700;
  color: v-bind('colors.success');
}

.no-technique {
  text-align: center;
  padding: 2rem 0;
  color: v-bind('colors.text.secondary');
}

/* World State */
.world-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.world-cycle, .world-event {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cycle-label, .event-label {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
}

.cycle-value, .event-value {
  font-size: 1rem;
  font-weight: 700;
}

/* Rate Breakdown */
.rate-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rate-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 700;
}

.rate-value {
  color: v-bind('colors.success');
  font-family: monospace;
}

.rate-factors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.factor-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.factor-positive {
  color: v-bind('colors.success');
  font-weight: 600;
}

/* Actions */
.actions-grid {
  display: grid;
  gap: 0.75rem;
}

/* Logs */
.logs-container {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: v-bind('colors.bg.secondary');
  border-left: 3px solid v-bind('colors.accent[900]');
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.log-time {
  color: v-bind('colors.text.secondary');
  font-weight: 600;
  flex-shrink: 0;
}

.log-text {
  color: v-bind('colors.text.primary');
  flex: 1;
}

.no-logs {
  text-align: center;
  padding: 2rem;
  color: v-bind('colors.text.secondary');
}

@media (max-width: 1024px) {
  .cultivation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
