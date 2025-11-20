<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { colors } from '../../styles/design-tokens'
import { SET_BONUS, calcEquipmentBonus, calcEnhancementCost, calcEnhancementSuccessRate, getEquipmentSellPrice } from '../../../shared/constants'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const { call } = useApiAction()
const loading = ref(false)
const selectedSlot = ref<string | null>(null)
const filterTier = ref<string>('all')
const filterElement = ref<string>('all')
const filterSlot = ref<string>('all')

const slots = [
  { id: 'weapon', name: 'Vũ Khí', icon: '⚔️' },
  { id: 'armor', name: 'Giáp Trụ', icon: '🛡️' },
  { id: 'helmet', name: 'Mũ Trụ', icon: '👑' },
  { id: 'boots', name: 'Hài Tử', icon: '👢' },
  { id: 'accessory', name: 'Phụ Kiện', icon: '💍' },
  { id: 'talisman', name: 'Bùa Chú', icon: '📿' }
]

const equipped = computed(() => {
  const eq: Record<string, any> = {}
  const equipment = player.player?.equipment || []
  equipment.forEach((e: any) => {
    eq[e.slot] = e
  })
  return eq
})

const inventory = computed(() => {
  let items = (player.player?.inventory || []).filter((i: any) => {
    const item = i.itemId
    if (!item || item.type !== 'equipment') return false
    if (filterTier.value !== 'all' && item.tier !== filterTier.value) return false
    if (filterElement.value !== 'all' && item.element !== filterElement.value) return false
    if (filterSlot.value !== 'all' && item.slot !== filterSlot.value) return false
    return true
  })
  return items
})

const setBonus = computed(() => {
  const equipment = player.player?.equipment || []
  const elements: Record<string, number> = {}
  equipment.forEach((e: any) => {
    const element = e.itemId?.element || 'neutral'
    elements[element] = (elements[element] || 0) + 1
  })
  
  const bonuses: Array<{ element: string; count: number; bonus: number }> = []
  Object.entries(elements).forEach(([element, count]) => {
    if (count >= 2) {
      bonuses.push({ 
        element, 
        count: count as number, 
        bonus: SET_BONUS[count as 2 | 4 | 6] || 1 
      })
    }
  })
  return bonuses
})

async function equipItem(uid: string, slot: string) {
  loading.value = true
  try {
    await call('EQUIP_ITEM', { uid, slot })
  } finally {
    loading.value = false
  }
}

async function unequipItem(slot: string) {
  loading.value = true
  try {
    await call('UNEQUIP_ITEM', { slot })
  } finally {
    loading.value = false
  }
}

async function enhanceItem(slot: string) {
  loading.value = true
  try {
    await call('EQUIP_ENHANCE', { slot })
  } finally {
    loading.value = false
  }
}

async function sellItem(uid: string) {
  loading.value = true
  try {
    await call('SHOP_SELL', { uid, qty: 1 })
  } finally {
    loading.value = false
  }
}

function getTierColor(tier: string): string {
  return colors.tier[tier as keyof typeof colors.tier] || colors.tier.common
}

function getElementColor(element: string): string {
  return colors.element[element as keyof typeof colors.element] || colors.element.neutral
}
</script>

<template>
  <div class="equipment-tab">
    <div class="equipment-grid">
      <!-- Left: Equipped Items -->
      <div class="equipped-section">
        <Card title="Trang Bị Hiện Tại" shadow>
          <div class="equipment-slots">
            <div v-for="slot in slots" :key="slot.id" class="equipment-slot-card">
              <div class="slot-header">
                <span class="slot-icon">{{ slot.icon }}</span>
                <span class="slot-name">{{ slot.name }}</span>
              </div>
              
              <div v-if="equipped[slot.id]" class="equipped-item">
                <div class="item-info">
                  <div class="item-name" :style="{ color: getTierColor(equipped[slot.id].itemId?.tier) }">
                    {{ equipped[slot.id].itemId?.name }}
                    <span v-if="equipped[slot.id].enhanceLevel" class="enhance-level">+{{ equipped[slot.id].enhanceLevel }}</span>
                  </div>
                  <div class="item-stats">
                    <div v-for="(value, stat) in equipped[slot.id].itemId?.stats" :key="stat" class="stat-line">
                      {{ stat }}: +{{ value }}
                    </div>
                  </div>
                </div>
                <div class="item-actions">
                  <Button size="sm" variant="secondary" @click="unequipItem(slot.id)" :loading="loading">
                    Tháo
                  </Button>
                  <Button 
                    size="sm" 
                    variant="accent" 
                    @click="enhanceItem(slot.id)" 
                    :loading="loading"
                    :disabled="(equipped[slot.id].enhanceLevel || 0) >= 10"
                  >
                    Cường Hóa
                  </Button>
                </div>
                
                <!-- Enhancement Info -->
                <div v-if="(equipped[slot.id].enhanceLevel || 0) < 10" class="enhance-info">
                  <div class="enhance-cost">
                    Chi phí: {{ calcEnhancementCost(equipped[slot.id].enhanceLevel || 0) }} 💎
                  </div>
                  <div class="enhance-rate">
                    Tỷ lệ: {{ calcEnhancementSuccessRate(equipped[slot.id].enhanceLevel || 0) }}%
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-slot">
                <span class="empty-icon">{{ slot.icon }}</span>
                <span class="empty-text">Trống</span>
              </div>
            </div>
          </div>
          
          <Divider spacing="md" />
          
          <!-- Set Bonuses -->
          <div class="set-bonus-section">
            <div class="section-title">Hiệu Ứng Set</div>
            <div v-if="setBonus.length > 0" class="set-bonuses">
              <div v-for="bonus in setBonus" :key="bonus.element" class="set-bonus-item">
                <span class="bonus-element" :style="{ color: getElementColor(bonus.element) }">
                  {{ bonus.element }}
                </span>
                <span class="bonus-count">{{ bonus.count }} món</span>
                <span class="bonus-value">×{{ bonus.bonus.toFixed(2) }}</span>
              </div>
            </div>
            <div v-else class="no-set">
              Chưa có hiệu ứng set (cần ít nhất 2 món cùng nguyên tố)
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Right: Inventory -->
      <div class="inventory-section">
        <Card title="Kho Đồ" shadow>
          <!-- Filters -->
          <div class="filters">
            <select v-model="filterTier" class="filter-select">
              <option value="all">Tất cả cấp độ</option>
              <option value="common">Thường</option>
              <option value="rare">Hiếm</option>
              <option value="epic">Sử Thi</option>
              <option value="legendary">Huyền Thoại</option>
              <option value="mythic">Thần Thoại</option>
            </select>
            
            <select v-model="filterElement" class="filter-select">
              <option value="all">Tất cả nguyên tố</option>
              <option value="metal">Kim</option>
              <option value="wood">Mộc</option>
              <option value="water">Thủy</option>
              <option value="fire">Hỏa</option>
              <option value="earth">Thổ</option>
              <option value="neutral">Trung Lập</option>
            </select>
            
            <select v-model="filterSlot" class="filter-select">
              <option value="all">Tất cả loại</option>
              <option v-for="slot in slots" :key="slot.id" :value="slot.id">{{ slot.name }}</option>
            </select>
          </div>
          
          <Divider spacing="sm" />
          
          <!-- Inventory Grid -->
          <div class="inventory-grid">
            <div v-for="item in inventory" :key="item.uid" class="inventory-item">
              <div class="item-header">
                <span class="item-name" :style="{ color: getTierColor(item.itemId?.tier) }">
                  {{ item.itemId?.name }}
                  <span v-if="item.enhanceLevel" class="enhance-level">+{{ item.enhanceLevel }}</span>
                </span>
                <span class="item-tier-badge" :style="{ backgroundColor: getTierColor(item.itemId?.tier) }">
                  {{ item.itemId?.tier }}
                </span>
              </div>
              
              <div class="item-element" :style="{ color: getElementColor(item.itemId?.element) }">
                {{ item.itemId?.element }}
              </div>
              
              <div class="item-stats-mini">
                <div v-for="(value, stat) in item.itemId?.stats" :key="stat" class="stat-mini">
                  {{ stat }}: +{{ value }}
                </div>
              </div>
              
              <div class="item-actions-compact">
                <Button 
                  size="sm" 
                  variant="primary" 
                  full-width
                  @click="equipItem(item.uid, item.itemId?.slot)" 
                  :loading="loading"
                >
                  Trang Bị
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  full-width
                  @click="sellItem(item.uid)" 
                  :loading="loading"
                >
                  Bán ({{ getEquipmentSellPrice(item.itemId?.tier || 'common', item.enhanceLevel || 0) }} 💎)
                </Button>
              </div>
            </div>
            
            <div v-if="inventory.length === 0" class="no-items">
              Không có trang bị trong kho
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipment-tab {
  max-width: 1600px;
  margin: 0 auto;
}

.equipment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Equipped Section */
.equipment-slots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.equipment-slot-card {
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: v-bind('colors.bg.secondary');
}

.slot-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: v-bind('colors.text.primary');
}

.slot-icon {
  font-size: 1.5rem;
}

.slot-name {
  font-size: 0.875rem;
}

.equipped-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-weight: 700;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.enhance-level {
  background-color: v-bind('colors.accent[900]');
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}

.item-stats {
  font-size: 0.8125rem;
  color: v-bind('colors.text.secondary');
}

.stat-line {
  padding: 0.125rem 0;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.enhance-info {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: v-bind('colors.bg.tertiary');
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: v-bind('colors.text.secondary');
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 0.5rem;
  opacity: 0.4;
}

.empty-icon {
  font-size: 2.5rem;
}

.empty-text {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
}

/* Set Bonuses */
.set-bonus-section {
  margin-top: 1rem;
}

.section-title {
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: v-bind('colors.text.primary');
}

.set-bonuses {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.set-bonus-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: v-bind('colors.bg.secondary');
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.bonus-element {
  font-weight: 700;
  text-transform: capitalize;
}

.bonus-count {
  color: v-bind('colors.text.secondary');
}

.bonus-value {
  margin-left: auto;
  font-weight: 700;
  color: v-bind('colors.success');
}

.no-set {
  padding: 1rem;
  text-align: center;
  color: v-bind('colors.text.secondary');
  font-size: 0.875rem;
}

/* Filters */
.filters {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.25rem;
  background-color: v-bind('colors.bg.primary');
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: v-bind('colors.accent[900]');
}

/* Inventory Grid */
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.inventory-item {
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  padding: 0.75rem;
  background-color: v-bind('colors.bg.paper');
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 200ms ease;
}

.inventory-item:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('colors.shadows.md');
  border-color: v-bind('colors.accent[900]');
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;
}

.item-tier-badge {
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;
}

.item-element {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.item-stats-mini {
  font-size: 0.75rem;
  color: v-bind('colors.text.secondary');
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.item-actions-compact {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

.no-items {
  grid-column: 1 / -1;
  padding: 3rem 1rem;
  text-align: center;
  color: v-bind('colors.text.secondary');
}

@media (max-width: 1200px) {
  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .equipment-slots {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .equipment-slots {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters {
    grid-template-columns: 1fr;
  }
  
  .inventory-grid {
    grid-template-columns: 1fr;
  }
}
</style>
