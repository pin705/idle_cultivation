<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { SECT_RANKS, SECT_SHOP_ITEMS, getSectRank } from '../../../shared/constants'
import { colors } from '../../styles/design-tokens'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const { call } = useApiAction()
const loading = ref(false)
const sectName = ref('')
const donateAmount = ref(100)

const currentRank = computed(() => {
  if (!player.player?.sect?.contribution) return SECT_RANKS[0]
  return getSectRank(player.player.sect.contribution)
})

const currentRankIndex = computed(() => {
  return SECT_RANKS.findIndex(r => r.name === currentRank.value.name)
})

const nextRank = computed(() => {
  if (currentRankIndex.value >= SECT_RANKS.length - 1) return null
  return SECT_RANKS[currentRankIndex.value + 1]
})

const progressToNext = computed(() => {
  if (!nextRank.value) return 100
  const current = player.player?.sect?.contribution || 0
  const required = nextRank.value.minContribution
  const base = currentRank.value.minContribution
  return ((current - base) / (required - base)) * 100
})

async function createSect() {
  loading.value = true
  try {
    await call('SECT_CREATE', { name: sectName.value })
    sectName.value = ''
  } finally {
    loading.value = false
  }
}

async function joinSect() {
  loading.value = true
  try {
    await call('SECT_JOIN', { name: sectName.value })
    sectName.value = ''
  } finally {
    loading.value = false
  }
}

async function leaveSect() {
  loading.value = true
  try {
    await call('SECT_LEAVE')
  } finally {
    loading.value = false
  }
}

async function donate() {
  loading.value = true
  try {
    await call('SECT_DONATE', { amount: donateAmount.value })
  } finally {
    loading.value = false
  }
}

async function buyShopItem(itemId: string) {
  loading.value = true
  try {
    await call('SECT_SHOP_BUY', { itemId })
  } finally {
    loading.value = false
  }
}

const hasSect = computed(() => !!player.player?.sect?.id)
</script>

<template>
  <div class="sect-tab">
    <div class="sect-layout">
      <!-- Left Column -->
      <div class="sect-col">
        <!-- Current Sect Info -->
        <Card v-if="hasSect" title="Thông Tin Tông Môn" shadow>
          <div class="sect-info">
            <div class="info-row">
              <span class="info-label">Chức Vị:</span>
              <span class="info-value rank-value">{{ currentRank.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Công Hiến:</span>
              <span class="info-value">{{ (player.player?.sect?.contribution || 0).toLocaleString() }}</span>
            </div>
          </div>
          
          <Divider spacing="sm" />
          
          <!-- Rank Progress -->
          <div v-if="nextRank" class="rank-progress">
            <div class="progress-header">
              <span>Tiến độ thăng chức</span>
              <span class="progress-next">{{ nextRank.name }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressToNext + '%' }"></div>
            </div>
            <div class="progress-info">
              Còn {{ nextRank.minContribution - (player.player?.sect?.contribution || 0) }} công hiến
            </div>
          </div>
          <div v-else class="rank-max">
            🎉 Đã đạt chức vị cao nhất!
          </div>
          
          <Divider spacing="sm" />
          
          <!-- Benefits -->
          <div class="benefits-section">
            <div class="section-title">Đặc Quyền Hiện Tại</div>
            <div class="benefits-list">
              <div class="benefit-item">
                <span class="benefit-icon">⚡</span>
                <span class="benefit-text">Tốc độ Tu Luyện: +{{ ((currentRank.benefits.qiBonus - 1) * 100).toFixed(0) }}%</span>
              </div>
              <div v-if="currentRank.benefits.shopDiscount" class="benefit-item">
                <span class="benefit-icon">💰</span>
                <span class="benefit-text">Giảm giá Cửa Hàng: {{ currentRank.benefits.shopDiscount }}%</span>
              </div>
            </div>
          </div>
          
          <Divider spacing="md" />
          
          <Button variant="danger" full-width :loading="loading" @click="leaveSect">
            Rời Tông Môn
          </Button>
        </Card>
        
        <!-- Join/Create Sect -->
        <Card v-if="!hasSect" title="Gia Nhập Tông Môn" shadow>
          <div class="join-sect-form">
            <input 
              v-model="sectName" 
              type="text" 
              placeholder="Tên tông môn" 
              class="sect-input"
            />
            <div class="button-group">
              <Button 
                variant="primary" 
                full-width 
                :disabled="!sectName"
                :loading="loading"
                @click="createSect"
              >
                Lập Tông Môn
              </Button>
              <Button 
                variant="secondary" 
                full-width 
                :disabled="!sectName"
                :loading="loading"
                @click="joinSect"
              >
                Gia Nhập
              </Button>
            </div>
          </div>
        </Card>
        
        <!-- Donate -->
        <Card v-if="hasSect" title="Cống Hiến Linh Thạch" shadow class="mt-4">
          <div class="donate-form">
            <div class="amount-selector">
              <button 
                v-for="amount in [100, 500, 1000, 5000]" 
                :key="amount"
                :class="['amount-btn', { active: donateAmount === amount }]"
                @click="donateAmount = amount"
              >
                {{ amount }}
              </button>
            </div>
            <input 
              v-model.number="donateAmount" 
              type="number" 
              class="sect-input"
              placeholder="Số lượng"
            />
            <Button 
              variant="accent" 
              full-width 
              size="lg"
              :disabled="donateAmount <= 0 || (player.player?.resources?.spiritStones || 0) < donateAmount"
              :loading="loading"
              @click="donate"
            >
              Đóng Góp {{ donateAmount.toLocaleString() }} 💎
            </Button>
          </div>
        </Card>
        
        <!-- All Ranks -->
        <Card title="Cấp Bậc Tông Môn" shadow class="mt-4">
          <div class="ranks-list">
            <div 
              v-for="(rank, index) in SECT_RANKS" 
              :key="rank.name"
              :class="['rank-item', { 'rank-current': index === currentRankIndex }]"
            >
              <div class="rank-header">
                <span class="rank-name">{{ rank.name }}</span>
                <span v-if="index === currentRankIndex" class="current-badge">✓ Hiện tại</span>
              </div>
              <div class="rank-requirement">
                Yêu cầu: {{ rank.minContribution.toLocaleString() }} công hiến
              </div>
              <div class="rank-benefits">
                <div class="rank-benefit">⚡ Qi +{{ ((rank.benefits.qiBonus - 1) * 100).toFixed(0) }}%</div>
                <div v-if="rank.benefits.shopDiscount" class="rank-benefit">
                  💰 Giảm giá {{ rank.benefits.shopDiscount }}%
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- Right Column: Contribution Shop -->
      <div class="sect-col">
        <Card v-if="hasSect" title="Cửa Hàng Công Hiến" shadow>
          <template #subtitle>
            Sử dụng công hiến để đổi vật phẩm độc quyền
          </template>
          
          <div class="shop-grid">
            <div 
              v-for="item in SECT_SHOP_ITEMS" 
              :key="item.id"
              class="shop-item"
            >
              <div class="shop-item-header">
                <div class="shop-item-name">{{ item.name }}</div>
                <div class="shop-item-type">{{ item.type }}</div>
              </div>
              
              <div class="shop-item-desc">{{ item.description }}</div>
              
              <Divider spacing="sm" />
              
              <div class="shop-item-footer">
                <div class="shop-item-cost">
                  <span class="cost-label">Chi phí:</span>
                  <span class="cost-value">{{ item.cost }} công hiến</span>
                </div>
                <div class="shop-item-req">
                  Yêu cầu: {{ SECT_RANKS[item.minRank]?.name }}
                </div>
                
                <Button 
                  variant="primary" 
                  size="sm" 
                  full-width
                  :disabled="currentRankIndex < item.minRank || (player.player?.sect?.contribution || 0) < item.cost"
                  :loading="loading"
                  @click="buyShopItem(item.id)"
                  class="mt-2"
                >
                  Mua
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card v-if="!hasSect" title="Cửa Hàng Công Hiến" shadow>
          <div class="no-sect-message">
            <p>Hãy gia nhập tông môn để truy cập cửa hàng công hiến</p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sect-tab {
  max-width: 1600px;
  margin: 0 auto;
}

.sect-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.sect-col {
  display: flex;
  flex-direction: column;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

/* Sect Info */
.sect-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
}

.info-label {
  color: v-bind('colors.text.secondary');
}

.info-value {
  font-weight: 700;
  font-family: monospace;
}

.rank-value {
  color: v-bind('colors.accent[900]');
  font-size: 1.125rem;
}

/* Rank Progress */
.rank-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
}

.progress-next {
  font-weight: 700;
  color: v-bind('colors.accent[900]');
}

.progress-bar {
  height: 10px;
  background-color: v-bind('colors.bg.tertiary');
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, v-bind('colors.accent[900]'), v-bind('colors.accent[700]'));
  transition: width 300ms ease;
}

.progress-info {
  font-size: 0.8125rem;
  color: v-bind('colors.text.secondary');
  text-align: center;
}

.rank-max {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  color: v-bind('colors.success');
  background-color: rgba(34, 197, 94, 0.1);
  border-radius: 0.5rem;
}

/* Benefits */
.benefits-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-weight: 700;
  color: v-bind('colors.text.primary');
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  background-color: v-bind('colors.bg.secondary');
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.benefit-icon {
  font-size: 1.25rem;
}

.benefit-text {
  color: v-bind('colors.text.primary');
  font-weight: 500;
}

/* Join/Create Form */
.join-sect-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sect-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: v-bind('colors.bg.primary');
  transition: border-color 200ms ease;
}

.sect-input:focus {
  outline: none;
  border-color: v-bind('colors.accent[900]');
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

/* Donate Form */
.donate-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.amount-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.amount-btn {
  padding: 0.625rem;
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.375rem;
  background-color: v-bind('colors.bg.secondary');
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.amount-btn:hover {
  background-color: v-bind('colors.bg.tertiary');
}

.amount-btn.active {
  background-color: v-bind('colors.accent[900]');
  color: white;
  border-color: v-bind('colors.accent[900]');
}

/* Ranks List */
.ranks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rank-item {
  padding: 1rem;
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  background-color: v-bind('colors.bg.secondary');
  transition: all 200ms ease;
}

.rank-current {
  border-color: v-bind('colors.accent[900]');
  background: linear-gradient(135deg, v-bind('colors.bg.secondary'), rgba(127, 29, 29, 0.05));
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rank-name {
  font-weight: 700;
  font-size: 1rem;
  color: v-bind('colors.text.primary');
}

.current-badge {
  padding: 0.25rem 0.75rem;
  background-color: v-bind('colors.success');
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.rank-requirement {
  font-size: 0.8125rem;
  color: v-bind('colors.text.secondary');
  margin-bottom: 0.5rem;
}

.rank-benefits {
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
}

.rank-benefit {
  color: v-bind('colors.text.primary');
}

/* Shop Grid */
.shop-grid {
  display: grid;
  gap: 1rem;
  max-height: 700px;
  overflow-y: auto;
}

.shop-item {
  border: 2px solid v-bind('colors.border.dark');
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: v-bind('colors.bg.paper');
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shop-item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.75rem;
}

.shop-item-name {
  font-weight: 700;
  font-size: 1rem;
  color: v-bind('colors.text.primary');
  flex: 1;
}

.shop-item-type {
  padding: 0.25rem 0.625rem;
  background-color: v-bind('colors.accent[900]');
  color: white;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.shop-item-desc {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
  line-height: 1.5;
}

.shop-item-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shop-item-cost {
  display: flex;
  justify-content: space-between;
  font-size: 0.9375rem;
}

.cost-label {
  color: v-bind('colors.text.secondary');
}

.cost-value {
  font-weight: 700;
  color: v-bind('colors.accent[900]');
  font-family: monospace;
}

.shop-item-req {
  font-size: 0.8125rem;
  color: v-bind('colors.text.secondary');
}

.no-sect-message {
  padding: 3rem 1rem;
  text-align: center;
  color: v-bind('colors.text.secondary');
}

@media (max-width: 1024px) {
  .sect-layout {
    grid-template-columns: 1fr;
  }
}
</style>
