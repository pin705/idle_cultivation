<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
import { usePlayerStore } from '../stores/player'

const { call } = useApiAction()
const player = usePlayerStore()

const missions = ref<any[]>([])
const loading = ref(false)

async function loadList() {
  const res = await call('MISSION_LIST')
  if (res?.success) missions.value = res.data.missions
}

async function assign(key: string) {
  loading.value = true
  try {
    await call('MISSION_ASSIGN', { key })
    await loadList()
  } finally { loading.value = false }
}

async function claim(key: string) {
  loading.value = true
  try {
    await call('MISSION_CLAIM', { key })
  } finally { loading.value = false }
}

onMounted(loadList)

function timeLeft(m: any) {
  const readyAt = new Date(m.assignedAt).getTime() + m.duration
  const diff = Math.max(0, Math.floor((readyAt - Date.now())/1000))
  return diff
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold mb-2">Bảng Nhiệm Vụ</div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="m in missions" :key="m.key" class="p-2 border-2 border-ink-black rounded bg-white">
          <div class="font-bold">{{ m.key }}</div>
          <div class="text-sm">Thời gian: {{ Math.floor(m.duration/1000) }}s</div>
          <button @click="assign(m.key)" :disabled="loading" class="mt-1 px-2 py-1 bg-ink-black text-white rounded disabled:opacity-50">Nhận</button>
        </div>
      </div>
    </div>

    <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold mb-2">Nhiệm Vụ Của Ta</div>
      <div v-if="(player as any).missions?.length" class="space-y-2">
        <div v-for="m in (player as any).missions" :key="m.key + (m.assignedAt||'')" class="p-2 border-2 border-ink-black rounded bg-white flex items-center justify-between">
          <div>
            <div class="font-bold">{{ m.key }}</div>
            <div class="text-sm">Còn lại: <span class="font-mono">{{ timeLeft(m) }}s</span></div>
          </div>
          <button @click="claim(m.key)" :disabled="timeLeft(m)>0 || m.claimed || loading" class="px-2 py-1 bg-seal-red text-white rounded disabled:opacity-50">Nhận thưởng</button>
        </div>
      </div>
      <div v-else class="text-sm text-gray-600">Chưa có nhiệm vụ.</div>
    </div>
  </div>
</template>
