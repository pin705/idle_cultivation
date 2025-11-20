<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
import { usePlayerStore } from '../stores/player'

const { call } = useApiAction()
const player = usePlayerStore()

const info = ref<any>(null)
const loading = ref(false)
const useTalisman = ref(false)
const now = ref(Date.now())
let timer: any

onMounted(() => {
  refresh()
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(timer))

async function refresh() {
  const res = await call('TRIB_PREPARE')
  if (res?.success) info.value = res.data
}

async function start() {
  loading.value = true
  try {
    await call('TRIB_START', { useTalisman: useTalisman.value })
  } finally {
    loading.value = false
  }
}

async function resolve() {
  loading.value = true
  try {
    await call('TRIB_RESOLVE')
    await refresh()
  } finally {
    loading.value = false
  }
}

const timeLeft = computed(() => {
  const endsAt = (player as any).tribulation?.endsAt ? new Date((player as any).tribulation.endsAt).getTime() : 0
  const diff = Math.max(0, Math.floor((endsAt - now.value) / 1000))
  return diff
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="(player as any).tribulation?.active" class="p-3 border-2 border-ink-black rounded bg-yellow-50">
      <div class="font-bold mb-1">Thiên Kiếp đang diễn ra</div>
      <div class="text-sm">Thời gian còn lại: <span class="font-mono font-bold">{{ timeLeft }}s</span></div>
      <button @click="resolve" :disabled="timeLeft>0 || loading" class="mt-2 px-3 py-1 bg-seal-red text-white rounded disabled:opacity-50">
        Kết thúc Thiên Kiếp
      </button>
    </div>

    <div v-else class="p-3 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold mb-1">Chuẩn bị Thiên Kiếp</div>
      <div v-if="info" class="text-sm">
        Độ khó: <span class="font-bold">{{ info.difficulty }}</span> · Chi phí: <span class="font-bold">{{ info.cost.qi }}</span> khí
      </div>
      <div class="mt-2 flex items-center gap-2 text-sm">
        <input id="talisman" type="checkbox" v-model="useTalisman" class="border-2 border-ink-black">
        <label for="talisman">Dùng Bùa Hộ Thân (nếu có)</label>
      </div>
      <button @click="start" :disabled="loading" class="mt-2 px-3 py-1 bg-ink-black text-white rounded disabled:opacity-50">
        Bắt đầu Thiên Kiếp
      </button>
    </div>
  </div>
</template>
