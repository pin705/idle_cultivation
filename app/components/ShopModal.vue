<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
import { usePlayerStore } from '../stores/player'

const { call } = useApiAction()
const player = usePlayerStore()
const items = ref<any[]>([])
const loading = ref(false)

async function fetchShop() {
  loading.value = true
  const res = await call('SHOP_LIST')
  if (res?.data) items.value = res.data
  loading.value = false
}

async function buy(key: string) {
  await call('SHOP_BUY', { key, qty: 1 })
  await fetchShop()
}

function getTierColor(tier: number) {
  const colors = ['text-gray-600', 'text-green-600', 'text-blue-600', 'text-purple-600', 'text-orange-600']
  return colors[tier - 1] || 'text-gray-600'
}

function getTierName(tier: number) {
  const names = ['Cơ Bản', 'Hiếm', 'Sử Thi', 'Huyền Thoại', 'Thần Thoại']
  return names[tier - 1] || 'Cơ Bản'
}

onMounted(fetchShop)
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-between items-center pb-2 border-b-2 border-ink-black">
      <div class="text-sm text-gray-600">Linh Thạch: <span class="font-bold font-mono">{{ player.resources.spiritStones }}</span></div>
      <div class="text-xs text-gray-500">{{ items.length }} vật phẩm</div>
    </div>
    <div v-if="loading" class="text-sm text-center py-8 text-gray-500">Đang tải cửa hàng…</div>
    <div v-else class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
      <div 
        v-for="it in items" 
        :key="it.key" 
        class="p-3 border-2 border-ink-black rounded bg-white hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold">{{ it.name }}</span>
              <span v-if="it.tier" :class="getTierColor(it.tier)" class="text-xs font-bold">
                [{{ getTierName(it.tier) }}]
              </span>
            </div>
            <div class="text-xs text-gray-600 space-y-0.5">
              <div>Giá: <span class="font-mono font-bold">{{ it.price }}</span> Linh Thạch</div>
              <div v-if="it.minRealm" class="text-seal-red">Yêu cầu: {{ it.minRealm }}</div>
              <div class="text-gray-500">Đã mua: {{ it.count }} lần</div>
            </div>
          </div>
          <button 
            @click="buy(it.key)" 
            :disabled="player.resources.spiritStones < it.price"
            class="px-3 py-1.5 bg-seal-red text-white border-2 border-ink-black rounded text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            Mua
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
