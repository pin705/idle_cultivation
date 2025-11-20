<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
import { usePlayerStore } from '../stores/player'
import { SECT_RANKS, SECT_SHOP_ITEMS, getSectRank } from '../../shared/constants'

const { call } = useApiAction()
const player = usePlayerStore()

const name = ref('')
const amount = ref(0)
const loading = ref(false)

const currentRank = computed(() => {
  if (!(player as any).sect) return null
  return getSectRank((player as any).sect.contribution || 0)
})

const currentRankIndex = computed(() => {
  if (!currentRank.value) return -1
  return SECT_RANKS.findIndex(r => r.name === currentRank.value?.name)
})

const nextRank = computed(() => {
  if (currentRankIndex.value < 0 || currentRankIndex.value >= SECT_RANKS.length - 1) return null
  return SECT_RANKS[currentRankIndex.value + 1]
})

async function createSect() {
  loading.value = true
  try {
    await call('SECT_CREATE', { name: name.value })
  } finally { loading.value = false }
}
async function joinSect() {
  loading.value = true
  try {
    await call('SECT_JOIN', { name: name.value })
  } finally { loading.value = false }
}
async function donate() {
  loading.value = true
  try {
    await call('SECT_DONATE', { amount: amount.value })
  } finally { loading.value = false }
}

async function leave() {
  loading.value = true
  try {
    await call('SECT_LEAVE')
  } finally { loading.value = false }
}

async function buyShopItem(itemId: string) {
  loading.value = true
  try {
    await call('SECT_SHOP_BUY', { itemId })
  } finally { loading.value = false }
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold mb-2">Tông Môn</div>
      <div class="text-sm">Trạng thái: <span class="font-bold">{{ (player as any).sect?.id ? 'Đã gia nhập' : 'Chưa có' }}</span></div>
      <div v-if="(player as any).sect?.id" class="text-sm">Cống hiến: <span class="font-mono font-bold">{{ (player as any).sect?.contribution || 0 }}</span></div>
      
      <!-- Rank Display -->
      <div v-if="currentRank" class="mt-2 space-y-1">
        <div class="text-sm font-bold text-seal-red">{{ currentRank.name }}</div>
        <div class="text-xs">• Qi +{{ ((currentRank.benefits.qiBonus - 1) * 100).toFixed(0) }}%</div>
        <div v-if="currentRank.benefits.shopDiscount" class="text-xs">• Giảm giá shop {{ currentRank.benefits.shopDiscount }}%</div>
        <div v-if="nextRank" class="text-xs text-gray-600 mt-1">
          Thăng chức: {{ nextRank.minContribution - ((player as any).sect?.contribution || 0) }} công hiến nữa
        </div>
      </div>
      
      <div v-if="(player as any).sect?.id" class="mt-2">
        <button @click="leave" :disabled="loading" class="px-3 py-1 bg-white border-2 border-ink-black rounded disabled:opacity-50">Rời Môn</button>
      </div>
    </div>

    <div class="p-3 border-2 border-ink-black rounded bg-gray-50 space-y-2">
      <div class="font-bold">Tạo / Tham Gia</div>
      <input v-model="name" placeholder="Tên tông môn" class="w-full px-3 py-1 border-2 border-ink-black rounded" />
      <div class="flex gap-2">
        <button @click="createSect" :disabled="loading || !name" class="px-3 py-1 bg-ink-black text-white rounded disabled:opacity-50">Lập Môn</button>
        <button @click="joinSect" :disabled="loading || !name" class="px-3 py-1 bg-white border-2 border-ink-black rounded disabled:opacity-50">Gia Nhập</button>
      </div>
    </div>

    <div class="p-3 border-2 border-ink-black rounded bg-gray-50 space-y-2">
      <div class="font-bold">Cống Hiến</div>
      <input type="number" v-model.number="amount" placeholder="Số Linh Thạch" class="w-full px-3 py-1 border-2 border-ink-black rounded" />
      <button @click="donate" :disabled="loading || amount<=0" class="px-3 py-1 bg-seal-red text-white rounded disabled:opacity-50">Đóng Góp</button>
    </div>
    
    <!-- Sect Shop -->
    <div v-if="(player as any).sect?.id" class="p-3 border-2 border-ink-black rounded bg-gray-50 space-y-2">
      <div class="font-bold">Cửa Hàng Công Hiến</div>
      <div class="text-xs text-gray-600 mb-2">Dùng công hiến để đổi kỹ thuật và trang bị độc quyền</div>
      
      <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        <div v-for="item in SECT_SHOP_ITEMS" :key="item.id" 
             class="p-2 border border-ink-black rounded bg-white">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-bold text-sm">{{ item.name }}</div>
              <div class="text-xs text-gray-600">{{ item.description }}</div>
              <div class="text-xs mt-1">
                <span class="text-seal-red font-mono">{{ item.cost }} công hiến</span>
                <span class="ml-2 text-gray-500">Yêu cầu: {{ SECT_RANKS[item.minRank]?.name || '?' }}</span>
              </div>
            </div>
            <button 
              @click="buyShopItem(item.id)"
              :disabled="loading || currentRankIndex < item.minRank || ((player as any).sect?.contribution || 0) < item.cost"
              class="px-2 py-1 text-xs bg-ink-black text-white rounded disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap ml-2">
              Mua
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
