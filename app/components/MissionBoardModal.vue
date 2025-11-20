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

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

function getMissionTypeColor(type: string) {
  return type === 'daily' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
}

const dailyMissions = computed(() => missions.value.filter(m => m.type === 'daily'))
const repeatableMissions = computed(() => missions.value.filter(m => m.type === 'repeatable'))
</script>

<template>
  <div class="space-y-4">
    <!-- Daily Missions -->
    <div class="p-4 border-2 border-yellow-500 rounded bg-yellow-50">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl font-bold text-yellow-700">⭐ Nhiệm Vụ Hằng Ngày</span>
        <span class="text-xs text-gray-600">(Làm mới mỗi 24h)</span>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div v-for="m in dailyMissions" :key="m.key" class="p-3 border-2 border-yellow-400 rounded bg-white">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="font-bold mb-1">{{ m.name }}</div>
              <div class="text-xs text-gray-600 mb-2">{{ m.description }}</div>
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                  +{{ m.rewards.spiritStones || 0 }} 💎
                </span>
                <span v-if="m.rewards.herbs" class="px-2 py-0.5 bg-green-100 text-green-700 rounded">
                  +{{ m.rewards.herbs }} 🌿
                </span>
                <span v-if="m.rewards.qi" class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                  +{{ m.rewards.qi }} ⚡
                </span>
                <span v-if="m.duration > 0" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  ⏱️ {{ formatTime(m.duration) }}
                </span>
              </div>
            </div>
            <button 
              @click="assign(m.key)" 
              :disabled="loading"
              class="px-3 py-1.5 bg-yellow-500 text-white border-2 border-ink-black rounded text-sm font-bold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
              Nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Repeatable Missions -->
    <div class="p-4 border-2 border-blue-500 rounded bg-blue-50">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl font-bold text-blue-700">🔄 Nhiệm Vụ Lặp Lại</span>
        <span class="text-xs text-gray-600">(Làm không giới hạn)</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div v-for="m in repeatableMissions" :key="m.key" class="p-3 border-2 border-blue-400 rounded bg-white">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="font-bold mb-1 text-sm">{{ m.name }}</div>
              <div class="text-xs text-gray-600 mb-1">{{ m.description }}</div>
              <div class="flex flex-wrap gap-1 text-xs">
                <span class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +{{ m.rewards.spiritStones || 0 }} 💎
                </span>
                <span v-if="m.rewards.herbs" class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +{{ m.rewards.herbs }} 🌿
                </span>
                <span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {{ formatTime(m.duration) }}
                </span>
              </div>
            </div>
            <button 
              @click="assign(m.key)" 
              :disabled="loading"
              class="px-2 py-1 bg-blue-500 text-white border-2 border-ink-black rounded text-xs font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
              Nhận
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Missions -->
    <div class="p-4 border-2 border-seal-red rounded bg-red-50">
      <div class="font-bold text-xl mb-3 text-seal-red">📋 Nhiệm Vụ Đang Làm</div>
      <div v-if="(player as any).missions?.length" class="space-y-2">
        <div v-for="m in (player as any).missions" :key="m.key + (m.assignedAt||'')" 
             class="p-3 border-2 border-ink-black rounded bg-white">
          <div class="flex items-center justify-between gap-3">
            <div class="flex-1">
              <div class="font-bold">{{ m.key }}</div>
              <div class="text-sm text-gray-600">
                <span v-if="timeLeft(m) > 0">Còn lại: <span class="font-mono text-seal-red">{{ timeLeft(m) }}s</span></span>
                <span v-else-if="!m.claimed" class="text-green-600 font-bold">✓ Hoàn thành!</span>
                <span v-else class="text-gray-400">Đã nhận thưởng</span>
              </div>
            </div>
            <button 
              @click="claim(m.key)" 
              :disabled="timeLeft(m) > 0 || m.claimed || loading"
              class="px-3 py-1.5 bg-seal-red text-white border-2 border-ink-black rounded text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {{ m.claimed ? 'Đã nhận' : 'Nhận thưởng' }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-sm text-gray-500 text-center py-8">Chưa có nhiệm vụ nào đang làm</div>
    </div>
  </div>
</template>
