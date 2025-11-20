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

onMounted(fetchShop)
</script>

<template>
  <div class="space-y-3">
    <div class="text-sm text-gray-600">Linh Thạch: <span class="font-bold">{{ player.resources.spiritStones }}</span></div>
    <div v-if="loading" class="text-sm">Đang tải cửa hàng…</div>
    <div v-else class="grid grid-cols-1 gap-2">
      <div v-for="it in items" :key="it.key" class="p-3 border-2 border-ink-black rounded bg-gray-50 flex items-center justify-between">
        <div>
          <div class="font-bold">{{ it.name }}</div>
          <div class="text-xs text-gray-600">Giá: {{ it.price }} | Đã mua: {{ it.count }}</div>
        </div>
        <button @click="buy(it.key)" class="px-3 py-1 bg-white border-2 border-ink-black rounded text-sm font-bold hover:bg-gray-100">Mua</button>
      </div>
    </div>
  </div>
</template>
