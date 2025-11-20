<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { TECHNIQUES, canUnlockTechnique } from '../../../shared/constants'
import { useThemeStore } from '../../stores/theme'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const themeStore = useThemeStore()
const { call } = useApiAction()
const loading = ref(false)
const selectedTech = ref<string | null>(null)

const unlockedTechs = computed(() => {
  // Get unlocked techniques from inventory or a dedicated field
  return (player.inventory || []).filter((i: any) => i.type === 'technique').map((i: any) => i.id) || []
})
const activeTech = computed(() => player.cultivation?.activeTechnique || null)
const equippedPassives = computed((): string[] => {
  // Passive techniques equipped - placeholder for now
  return []
})

const techniquesList = computed(() => {
  const currentRealm = typeof player.realm === 'string' ? player.realm : player.realm.major
  const currentMinor = typeof player.realm === 'string' ? 1 : player.realm.minor
  
  return TECHNIQUES.map(tech => {
    const unlocked = unlockedTechs.value.includes(tech.id)
    const canUnlock = !unlocked && canUnlockTechnique(tech, currentRealm, currentMinor, unlockedTechs.value)
    const isActive = activeTech.value === tech.id
    const isPassiveEquipped = equippedPassives.value.includes(tech.id)
    
    return {
      ...tech,
      unlocked,
      canUnlock,
      isActive,
      isPassiveEquipped
    }
  })
})

const categorizedTechs = computed(() => {
  const categories = {
    active: techniquesList.value.filter(t => t.type === 'active'),
    passive: techniquesList.value.filter(t => t.type === 'passive')
  }
  return categories
})

async function unlockTechnique(id: string) {
  loading.value = true
  try {
    await call('TECH_UNLOCK', { key: id })
  } finally {
    loading.value = false
  }
}

async function equipTechnique(id: string) {
  loading.value = true
  try {
    await call('TECH_EQUIP', { key: id })
  } finally {
    loading.value = false
  }
}

function getElementColor(element?: string): string {
  if (!element) return colors.element.neutral
  return colors.element[element as keyof typeof colors.element] || colors.element.neutral
}

function getElementName(element?: string): string {
  if (!element) return ''
  const names: Record<string, string> = {
    fire: '🔥 Hỏa',
    water: '💧 Thủy',
    wood: '🌿 Mộc',
    metal: '⚙️ Kim',
    earth: '🪨 Thổ'
  }
  return names[element] || element
}
</script>

<template>
  <div class="techniques-tab">
    <div class="techniques-layout">
      <!-- Active Techniques -->
      <div class="techniques-section">
        <Card title="Công Pháp Tu Luyện (Active)" shadow>
          <template #subtitle>
            Chọn 1 công pháp để tu luyện, tăng tốc độ tích lũy Qi
          </template>
          
          <div class="techniques-grid">
            <div 
              v-for="tech in categorizedTechs.active" 
              :key="tech.id"
              :class="['technique-card', { 
                'technique-locked': !tech.unlocked,
                'technique-active': tech.isActive 
              }]"
              @click="selectedTech = tech.id"
            >
              <!-- Header -->
              <div class="tech-header">
                <div class="tech-name">{{ tech.name }}</div>
                <div v-if="tech.element" class="tech-element" :style="{ color: getElementColor(tech.element) }">
                  {{ getElementName(tech.element) }}
                </div>
              </div>
              
              <!-- Description -->
              <div class="tech-description">{{ tech.name }} - Kỹ thuật chủ động</div>
              
              <Divider spacing="sm" />
              
              <!-- Stats -->
              <div class="tech-stats" v-if="tech.effect">
                <div class="stat-item" v-if="tech.effect.rateMult && tech.effect.rateMult !== 1">
                  <span class="stat-label">Tu Luyện:</span>
                  <span class="stat-value">×{{ tech.effect.rateMult }}</span>
                </div>
                <div class="stat-item" v-if="tech.effect.rateAdd">
                  <span class="stat-label">Qi/s:</span>
                  <span class="stat-value">+{{ tech.effect.rateAdd }}</span>
                </div>
              </div>
              
              <!-- Requirements -->
              <div v-if="!tech.unlocked" class="tech-requirements">
                <div class="req-title">Yêu cầu:</div>
                <div v-if="tech.minRealm" class="req-item">
                  🏔️ {{ tech.minRealm }}
                </div>
                <div v-if="tech.minRealmMinor" class="req-item">
                  🔢 Tầng {{ tech.minRealmMinor }}
                </div>
                <div v-if="tech.requires && tech.requires.length > 0" class="req-item">
                  🔗 Yêu cầu: {{ tech.requires.length }} kỹ thuật
                </div>
                <div v-if="tech.cost?.spiritStones" class="req-item">
                  💎 {{ tech.cost.spiritStones.toLocaleString() }} Linh Thạch
                </div>
                <div v-if="tech.cost?.herbs" class="req-item">
                  🌿 {{ tech.cost.herbs.toLocaleString() }} Linh Dược
                </div>
              </div>
              
              <!-- Actions -->
              <div class="tech-actions">
                <Button 
                  v-if="!tech.unlocked && tech.canUnlock"
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  :disabled="loading"
                  @click.stop="unlockTechnique(tech.id)"
                >
                  Mở Khóa
                </Button>
                <Button 
                  v-else-if="tech.unlocked && !tech.isActive"
                  variant="accent" 
                  size="sm" 
                  fullWidth
                  :disabled="loading"
                  @click.stop="equipTechnique(tech.id)"
                >
                  Trang Bị
                </Button>
                <div v-else-if="tech.isActive" class="active-badge">
                  ✓ Đang Sử Dụng
                </div>
                <div v-else class="locked-badge">
                  🔒 Chưa Đủ Điều Kiện
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Passive Techniques -->
      <div class="techniques-section">
        <Card title="Kỹ Năng Bị Động (Passive)" shadow>
          <template #subtitle>
            Các kỹ năng bổ trợ tự động kích hoạt
          </template>
          
          <div class="techniques-grid">
            <div 
              v-for="tech in categorizedTechs.passive" 
              :key="tech.id"
              :class="['technique-card', { 
                'technique-locked': !tech.unlocked,
                'technique-active': tech.isPassiveEquipped 
              }]"
              @click="selectedTech = tech.id"
            >
              <!-- Header -->
              <div class="tech-header">
                <div class="tech-name">{{ tech.name }}</div>
                <div v-if="tech.element" class="tech-element" :style="{ color: getElementColor(tech.element) }">
                  {{ getElementName(tech.element) }}
                </div>
              </div>
              
              <!-- Description -->
              <div class="tech-description">{{ tech.name }} - Kỹ thuật bị động</div>
              
              <Divider spacing="sm" />
              
              <!-- Stats -->
              <div class="tech-stats" v-if="tech.effect">
                <div class="stat-item" v-if="tech.effect.rateMult && tech.effect.rateMult !== 1">
                  <span class="stat-label">Tu Luyện:</span>
                  <span class="stat-value">×{{ tech.effect.rateMult }}</span>
                </div>
                <div class="stat-item" v-if="tech.effect.rateAdd">
                  <span class="stat-label">Qi/s:</span>
                  <span class="stat-value">+{{ tech.effect.rateAdd }}</span>
                </div>
              </div>
              
              <!-- Requirements -->
              <div v-if="!tech.unlocked" class="tech-requirements">
                <div class="req-title">Yêu cầu:</div>
                <div v-if="tech.minRealm" class="req-item">
                  🏔️ {{ tech.minRealm }}
                </div>
                <div v-if="tech.minRealmMinor" class="req-item">
                  🔢 Tầng {{ tech.minRealmMinor }}
                </div>
                <div v-if="tech.requires && tech.requires.length > 0" class="req-item">
                  🔗 Yêu cầu: {{ tech.requires.length }} kỹ thuật
                </div>
                <div v-if="tech.cost?.spiritStones" class="req-item">
                  💎 {{ tech.cost.spiritStones.toLocaleString() }} Linh Thạch
                </div>
                <div v-if="tech.cost?.herbs" class="req-item">
                  🌿 {{ tech.cost.herbs.toLocaleString() }} Linh Dược
                </div>
              </div>
              
              <!-- Actions -->
              <div class="tech-actions">
                <Button 
                  v-if="!tech.unlocked && tech.canUnlock"
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  :disabled="loading"
                  @click.stop="unlockTechnique(tech.id)"
                >
                  Mở Khóa
                </Button>
                <Button 
                  v-else-if="tech.unlocked && !tech.isPassiveEquipped"
                  variant="accent" 
                  size="sm" 
                  fullWidth
                  :disabled="loading"
                  @click.stop="equipTechnique(tech.id)"
                >
                  Trang Bị
                </Button>
                <div v-else-if="tech.isPassiveEquipped" class="active-badge">
                  ✓ Đã Trang Bị
                </div>
                <div v-else class="locked-badge">
                  🔒 Chưa Đủ Điều Kiện
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.techniques-tab {
  max-width: 1600px;
  margin: 0 auto;
}

.techniques-layout {
  display: grid;
  gap: 1.5rem;
}

.techniques-section {
  width: 100%;
}

.techniques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.technique-card {
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: v-bind('colors.bg.paper');
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.technique-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.technique-locked {
  opacity: 0.6;
}

.technique-active {
  border-color: v-bind('colors.accent[900]');
  background: linear-gradient(135deg, v-bind('colors.bg.paper'), rgba(127, 29, 29, 0.05));
  box-shadow: 0 0 20px rgba(127, 29, 29, 0.2);
}

.tech-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.75rem;
}

.tech-name {
  font-size: 1rem;
  font-weight: 700;
  color: v-bind('colors.text.primary');
  flex: 1;
}

.tech-element {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.tech-description {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
  line-height: 1.5;
  flex: 1;
}

.tech-stats {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.stat-label {
  color: v-bind('colors.text.secondary');
}

.stat-value {
  font-weight: 700;
  color: v-bind('colors.accent[800]');
}

.tech-requirements {
  border-top: 1px solid v-bind('colors.border.light');
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.req-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: v-bind('colors.text.secondary');
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.req-item {
  font-size: 0.75rem;
  color: v-bind('colors.text.secondary');
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.tech-actions {
  margin-top: auto;
  padding-top: 0.5rem;
}

.active-badge,
.locked-badge {
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.active-badge {
  background-color: rgba(34, 197, 94, 0.1);
  color: rgb(22, 163, 74);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.locked-badge {
  background-color: rgba(107, 114, 128, 0.1);
  color: rgb(107, 114, 128);
  border: 1px solid rgba(107, 114, 128, 0.3);
}
</style>
