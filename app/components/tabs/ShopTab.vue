<template>
  <div class="shop-container">
    <!-- Sub Navigation -->
    <div class="sub-nav">
      <Button 
        :variant="activeView === 'shop' ? 'accent' : 'secondary'"
        size="lg"
        @click="activeView = 'shop'"
      >
        🛒 Cửa Hàng
      </Button>
      <Button 
        :variant="activeView === 'achievements' ? 'accent' : 'secondary'"
        size="lg"
        @click="activeView = 'achievements'"
      >
        🏆 Thành Tựu
      </Button>
    </div>

    <!-- Shop View -->
    <div v-if="activeView === 'shop'" class="shop-view">
    <!-- Filters -->
    <Card title="Bộ Lọc" class="filters-card">
      <div class="filters-grid">
        <div class="filter-group">
          <label>Cấp Bậc:</label>
          <div class="filter-buttons">
            <Button 
              v-for="tier in [0, 1, 2, 3, 4, 5]" 
              :key="tier"
              :variant="selectedTier === tier ? 'accent' : 'secondary'"
              size="sm"
              @click="selectedTier = tier"
            >
              {{ tier === 0 ? 'Tất Cả' : getTierName(tier) }}
            </Button>
          </div>
        </div>
        
        <div class="filter-group">
          <label>Loại Vật Phẩm:</label>
          <div class="filter-buttons">
            <Button 
              v-for="type in ['all', 'equipment', 'material', 'consumable', 'recipe', 'tool']" 
              :key="type"
              :variant="selectedType === type ? 'accent' : 'secondary'"
              size="sm"
              @click="selectedType = type"
            >
              {{ getTypeName(type) }}
            </Button>
          </div>
        </div>
      </div>
    </Card>

    <!-- Shop Catalog -->
    <div class="shop-section">
      <div class="section-header">
        <h2>Cửa Hàng Linh Bảo</h2>
        <div class="player-funds">
          <span class="funds-item">
            <span class="funds-icon">💎</span>
            <span class="funds-amount">{{ player.resources.spiritStones }}</span> Linh Thạch
          </span>
          <span class="funds-item">
            <span class="funds-icon">🌿</span>
            <span class="funds-amount">{{ player.resources.herbs }}</span> Thảo Dược
          </span>
        </div>
      </div>

      <div class="items-grid">
        <div v-for="shopItem in filteredItems" :key="shopItem.key" class="shop-item-card" :class="'tier-' + getTierColor(shopItem.tier)">
          <div class="item-tier-badge" :class="'badge-' + getTierColor(shopItem.tier)">
            {{ getTierName(shopItem.tier) }}
          </div>
          
          <div class="item-header">
            <div class="item-name" :class="'name-' + getTierColor(shopItem.tier)">{{ shopItem.name }}</div>
            <div class="item-slot" v-if="shopItem.item.slot">
              {{ getSlotName(shopItem.item.slot) }}
            </div>
          </div>

          <div class="item-details">
            <div v-if="shopItem.item.elementTag" class="item-element">
              <span :class="getElementColorClass(shopItem.item.elementTag)">
                {{ getElementName(shopItem.item.elementTag) }}
              </span>
            </div>
            
            <div v-if="shopItem.item.baseEffects" class="item-effects">
              <div v-if="shopItem.item.baseEffects.rateAdd" class="effect-item">
                +{{ shopItem.item.baseEffects.rateAdd }} Qi/s
              </div>
              <div v-if="shopItem.item.baseEffects.rateMult" class="effect-item">
                ×{{ shopItem.item.baseEffects.rateMult }} Tu Luyện
              </div>
            </div>
          </div>

          <div class="item-requirements" v-if="shopItem.minRealm">
            <span class="req-icon">🔒</span> Yêu cầu: {{ shopItem.minRealm }}
          </div>

          <div class="item-price">
            <div class="price-display">
              <span class="price-icon">💎</span>
              <span class="price-amount">{{ calculatePrice(shopItem) }}</span>
              <span v-if="hasSectDiscount" class="price-discount">
                (-{{ sectDiscountPercent }}%)
              </span>
            </div>
          </div>

          <Button 
            variant="accent" 
            size="sm" 
            @click="buyItem(shopItem)"
            :disabled="!canBuy(shopItem)"
            fullWidth
          >
            {{ canBuy(shopItem) ? 'Mua' : 'Không Đủ' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Sell Equipment Section -->
    <Divider text="Bán Trang Bị" />
    
    <div class="sell-section">
      <h2>Bán Trang Bị Không Dùng</h2>
      <p class="sell-description">Chọn trang bị trong kho để bán và nhận lại Linh Thạch</p>
      
      <div class="inventory-grid">
        <div 
          v-for="(item, idx) in sellableEquipment" 
          :key="idx"
          class="inventory-item-card"
          :class="'tier-' + item.tier"
        >
          <div class="item-name" :class="'name-' + item.tier">{{ item.name }}</div>
          <div class="item-info">
            <div class="item-slot">{{ getSlotName(item.slot) }}</div>
            <div v-if="item.elementTag" class="item-element">
              <span :class="getElementColorClass(item.elementTag)">
                {{ getElementName(item.elementTag) }}
              </span>
            </div>
          </div>
          <div class="sell-price">
            <span class="price-icon">💎</span> {{ getSellPrice(item) }}
          </div>
          <Button 
            variant="danger" 
            size="sm" 
            @click="sellItem(idx)"
            fullWidth
          >
            Bán
          </Button>
        </div>
      </div>
    </div>
    </div>

    <!-- Achievements View -->
    <AchievementsTab v-if="activeView === 'achievements'" />
  </div>
</template>

<script setup lang="ts">
import AchievementsTab from './AchievementsTab.vue'
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { SHOP_CATALOG, REALMS } from '../../../shared/constants'
import { getElementName, getElementColorClass } from '../../utils/game-helpers'
import { useThemeStore } from '../../stores/theme'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'
import Divider from '../ui/Divider.vue'

const activeView = ref('shop')
const player = usePlayerStore()
const themeStore = useThemeStore()
const { call } = useApiAction()

const selectedTier = ref(0)
const selectedType = ref('all')

const filteredItems = computed(() => {
  return SHOP_CATALOG.filter(item => {
    if (selectedTier.value !== 0 && item.tier !== selectedTier.value) return false
    if (selectedType.value !== 'all' && item.item.type !== selectedType.value) return false
    return true
  })
})

const sellableEquipment = computed(() => {
  return (player.inventory || []).filter((item: any) => item.type === 'equipment')
})

const hasSectDiscount = computed(() => {
  return player.sect?.name && player.sect.rank >= 1
})

const sectDiscountPercent = computed(() => {
  if (!player.sect?.rank) return 0
  return player.sect.rank * 5 // 5% per rank
})

const getTierName = (tier: number) => {
  const names: Record<number, string> = {
    1: 'Thường',
    2: 'Hiếm',
    3: 'Sử Thi',
    4: 'Huyền Thoại',
    5: 'Thần Thoại'
  }
  return names[tier] || 'Unknown'
}

const getTierColor = (tier: number) => {
  const colors: Record<number, string> = {
    1: 'common',
    2: 'rare',
    3: 'epic',
    4: 'legendary',
    5: 'mythic'
  }
  return colors[tier] || 'common'
}

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    all: 'Tất Cả',
    equipment: 'Trang Bị',
    material: 'Nguyên Liệu',
    consumable: 'Tiêu Hao',
    recipe: 'Phương',
    tool: 'Công Cụ'
  }
  return names[type] || type
}

const getSlotName = (slot: string) => {
  const names: Record<string, string> = {
    weapon: 'Vũ Khí',
    armor: 'Giáp',
    helmet: 'Mũ',
    boots: 'Hài',
    accessory: 'Phụ Kiện',
    talisman: 'Bùa'
  }
  return names[slot] || slot
}

const calculatePrice = (shopItem: any) => {
  let price = shopItem.basePrice
  
  // Apply sect discount
  if (hasSectDiscount.value) {
    price = Math.floor(price * (1 - sectDiscountPercent.value / 100))
  }
  
  return price
}

const canBuy = (shopItem: any) => {
  // Check realm requirement
  if (shopItem.minRealm) {
    const currentRealm = typeof player.realm === 'string' ? player.realm : player.realm.major
    const realmIndex = REALMS.indexOf(currentRealm)
    const reqIndex = REALMS.indexOf(shopItem.minRealm)
    if (realmIndex < reqIndex) return false
  }
  
  // Check funds
  const price = calculatePrice(shopItem)
  if (player.resources.spiritStones < price) return false
  
  return true
}

const getSellPrice = (item: any) => {
  // Sell for 50% of base price
  const shopItem = SHOP_CATALOG.find(s => s.item.tier === item.tier && s.item.slot === item.slot)
  return shopItem ? Math.floor(shopItem.basePrice * 0.5) : 10
}

const buyItem = async (shopItem: any) => {
  const result = await call('SHOP_BUY', { key: shopItem.key })
  if (result.success) {
    // Item purchased
  }
}

const sellItem = async (index: number) => {
  const result = await call('SHOP_SELL', { index })
  if (result.success) {
    // Item sold
  }
}
</script>

<style scoped>
.sub-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.shop-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.shop-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.filters-card {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02));
}

.filters-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-group label {
  font-weight: 700;
  font-size: 0.875rem;
  color: #111827;
  text-transform: uppercase;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.shop-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.player-funds {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.funds-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #111827;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #111827;
}

.funds-icon {
  font-size: 1.25rem;
}

.funds-amount {
  color: #dc2626;
  font-size: 1.125rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.shop-item-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.shop-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tier-common { border-color: #6b7280; }
.tier-rare { border-color: #3b82f6; }
.tier-epic { border-color: #a855f7; }
.tier-legendary { border-color: #f97316; }
.tier-mythic { border-color: #dc2626; }

.item-tier-badge {
  position: absolute;
  top: -10px;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid #111827;
  color: white;
}

.badge-common { background: #6b7280; }
.badge-rare { background: #3b82f6; }
.badge-epic { background: #a855f7; }
.badge-legendary { background: #f97316; }
.badge-mythic { background: linear-gradient(135deg, #dc2626, #7f1d1d); }

.item-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.item-name {
  font-weight: 700;
  font-size: 1.125rem;
}

.name-common { color: #6b7280; }
.name-rare { color: #3b82f6; }
.name-epic { color: #a855f7; }
.name-legendary { color: #f97316; }
.name-mythic { 
  background: linear-gradient(135deg, #dc2626, #7f1d1d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item-slot {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-element {
  font-size: 0.875rem;
  font-weight: 700;
}

.element-metal { color: #d4af37; }
.element-wood { color: #10b981; }
.element-water { color: #3b82f6; }
.element-fire { color: #ef4444; }
.element-earth { color: #92400e; }
.element-none { color: #6b7280; }

.item-effects {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
}

.item-requirements {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
  font-weight: 600;
}

.item-price {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.price-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.price-icon {
  font-size: 1.25rem;
}

.price-amount {
  font-size: 1.125rem;
  color: #111827;
}

.price-discount {
  font-size: 0.875rem;
  color: #059669;
}

.sell-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sell-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.sell-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.inventory-item-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.sell-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #059669;
  padding: 0.5rem;
  background: #f0fdf4;
  border-radius: 0.375rem;
}
</style>
