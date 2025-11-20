<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { TECHNIQUES, REALMS, canUnlockTechnique } from '../../../shared/constants'
import { colors } from '../../styles/design-tokens'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const { call } = useApiAction()
const loading = ref(false)
const selectedTech = ref<string | null>(null)

const unlockedTechs = computed(() => {
  // Get unlocked techniques from inventory or a dedicated field
  return (player.inventory || []).filter((i: any) => i.type === 'technique').map((i: any) => i.id) || []
})
const activeTech = computed(() => player.cultivation?.activeTechnique || null)
const equippedPassives = computed(() => {
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
    await call('TECH_UNLOCK', { id: id })
  } finally {
    loading.value = false
  }
}

async function equipTechnique(id: string) {
  loading.value = true
  try {
    await call('TECH_EQUIP', { id: id })
  } finally {
    loading.value = false
  }
}

function getElementColor(element: string): string {
  return colors.element[element as keyof typeof colors.element] || colors.element.neutral
}

function getRealmName(realm: string): string {
  return realm
}

function getPathName(path: string): string {
  const paths: Record<string, string> = {
    sword: 'Kiếm Đạo',
    alchemy: 'Đan Đạo',
    body: 'Thể Tu',
    elementalist: 'Ngũ Hành'
  }
  return paths[path] || path
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
              :id="tech.id"
              :class="['technique-card', { 
                'technique-locked': !tech.unlocked,
                'technique-active': tech.isActive 
              }]"
              @click="selectedTech = tech.id"
            >
              <!-- Header -->
              <div class="tech-header">
                <div class="tech-name">{{ tech.name }}</div>
                <div class="tech-element" :style="{ color: getElementColor(tech.element) }">
                  {{ tech.element }}
                </div>
              </div>
              
              <!-- Description -->
              <div class="tech-description">{{ tech.description }}</div>
              
              <Divider spacing="sm" />
              
              <!-- Stats -->
              <div class="tech-stats">
                <div class="stat-item">
                  <span class="stat-label">Tốc độ:</span>
                  <span class="stat-value">+{{ ((tech.baseRate - 1) * 100).toFixed(0) }}%</span>
                </div>
              </div>
              
              <!-- Requirements -->
              <div v-if="!tech.unlocked" class="tech-requirements">
                <div class="req-title">Yêu cầu:</div>
                <div v-if="tech.requirements?.minRealm" class="req-item">
                  🏔️ {{ getRealmName(tech.requirements.minRealm) }}
                </div>
                <div v-if="tech.requirements?.minQi" class="req-item">
                  ⚡ {{ tech.requirements.minQi.toLocaleString() }} Qi
                </div>
                <div v-if="tech.requirements?.path" class="req-item">
                  🛤️ {{ getPathName(tech.requirements.path) }}
                </div>
                <div v-if="tech.cost" class="req-item">
                  💎 {{ tech.cost.toLocaleString() }} Linh Thạch
                </div>
              </div>
              
              <!-- Actions -->
              <div class="tech-actions">
                <Button 
                  v-if="!tech.unlocked && tech.canUnlock"
                  variant="primary" 
                  size="sm" 
                  full-width
                  :loading="loading"
                  @click.stop="unlockTechnique(tech.id)"
                >
                  Mở Khóa
                </Button>
                <Button 
                  v-else-if="tech.unlocked && !tech.isActive"
                  variant="accent" 
                  size="sm" 
                  full-width
                  :loading="loading"
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
              :id="tech.id"
              :class="['technique-card', { 
                'technique-locked': !tech.unlocked,
                'technique-active': tech.isPassiveEquipped 
              }]"
              @click="selectedTech = tech.id"
            >
              <!-- Header -->
              <div class="tech-header">
                <div class="tech-name">{{ tech.name }}</div>
                <div class="tech-element" :style="{ color: getElementColor(tech.element) }">
                  {{ tech.element }}
                </div>
              </div>
              
              <!-- Description -->
              <div class="tech-description">{{ tech.description }}</div>
              
              <Divider spacing="sm" />
              
              <!-- Stats -->
              <div class="tech-stats">
                <div v-if="tech.effect?.qiBonus" class="stat-item">
                  <span class="stat-label">Qi Bonus:</span>
                  <span class="stat-value">+{{ (tech.effect.qiBonus * 100).toFixed(0) }}%</span>
                </div>
                <div v-if="tech.effect?.stoneBonus" class="stat-item">
                  <span class="stat-label">Linh Thạch:</span>
                  <span class="stat-value">+{{ (tech.effect.stoneBonus * 100).toFixed(0) }}%</span>
                </div>
                <div v-if="tech.effect?.tribulationBonus" class="stat-item">
                  <span class="stat-label">Thiên Kiếp:</span>
                  <span class="stat-value">+{{ (tech.effect.tribulationBonus * 100).toFixed(0) }}%</span>
                </div>
              </div>
              
              <!-- Requirements -->
              <div v-if="!tech.unlocked" class="tech-requirements">
                <div class="req-title">Yêu cầu:</div>
                <div v-if="tech.requirements?.minRealm" class="req-item">
                  🏔️ {{ getRealmName(tech.requirements.minRealm) }}
                </div>
                <div v-if="tech.requirements?.minQi" class="req-item">
                  ⚡ {{ tech.requirements.minQi.toLocaleString() }} Qi
                </div>
                <div v-if="tech.cost" class="req-item">
                  💎 {{ tech.cost.toLocaleString() }} Linh Thạch
                </div>
              </div>
              
              <!-- Actions -->
              <div class="tech-actions">
                <Button 
                  v-if="!tech.unlocked && tech.canUnlock"
                  variant="primary" 
                  size="sm" 
                  full-width
                  :loading="loading"
                  @click.stop="unlockTechnique(tech.id)"
                >
                  Mở Khóa
                </Button>
                <Button 
                  v-else-if="tech.unlocked && !tech.isPassiveEquipped"
                  variant="accent" 
                  size="sm" 
                  full-width
                  :loading="loading"
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
  background-color: currentColor;
  color: white;
  opacity: 0.9;
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
  color: v-bind('colors.success');
  font-family: monospace;
}

.tech-requirements {
  padding: 0.75rem;
  background-color: v-bind('colors.bg.tertiary');
  border-radius: 0.25rem;
  font-size: 0.8125rem;
}

.req-title {
  font-weight: 600;
  color: v-bind('colors.text.primary');
  margin-bottom: 0.5rem;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: v-bind('colors.text.secondary');
}

.tech-actions {
  margin-top: auto;
}

.active-badge {
  padding: 0.5rem 1rem;
  background-color: v-bind('colors.success');
  color: white;
  text-align: center;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.locked-badge {
  padding: 0.5rem 1rem;
  background-color: v-bind('colors.bg.tertiary');
  color: v-bind('colors.text.secondary');
  text-align: center;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .techniques-grid {
    grid-template-columns: 1fr;
  }
}
</style>
