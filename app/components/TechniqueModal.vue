<script setup lang="ts">
import { TECHNIQUES } from '../../shared/constants'
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'

const player = usePlayerStore()
const { call } = useApiAction()

function owned(id: string) {
  return player as any && (player as any).techniques?.unlocked?.includes(id)
}

async function unlock(id: string) {
  const res = await call('TECH_UNLOCK', { id })
}

async function equip(id: string, slot: 'active' | 'passive') {
  const res = await call('TECH_EQUIP', { id, slot })
}
</script>

<template>
  <div class="space-y-3">
    <div class="text-sm text-gray-600">Kỹ thuật chủ động/bị động. Tối đa 1 chủ động, 2 bị động.</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="t in TECHNIQUES" :key="t.id" class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="font-bold">{{ t.name }} <span class="text-xs text-gray-500">({{ t.type }})</span></div>
            <div class="text-xs text-gray-600">Hiệu ứng: 
              <span v-if="t.effect.rateMult">x{{ t.effect.rateMult }}</span>
              <span v-if="t.effect.rateAdd"> +{{ t.effect.rateAdd }}/s</span>
            </div>
          </div>
          <div class="text-xs text-gray-600">
            Giá: <span class="font-bold">{{ t.cost.spiritStones || 0 }}</span> Linh Thạch
          </div>
        </div>
        <div class="flex gap-2">
          <button 
            v-if="!owned(t.id)"
            @click="unlock(t.id)"
            class="px-3 py-1 bg-white border-2 border-ink-black rounded text-sm font-bold hover:bg-gray-100">
            Lĩnh Ngộ
          </button>
          <button 
            v-else
            @click="equip(t.id, t.type === 'active' ? 'active' : 'passive')"
            class="px-3 py-1 bg-white border-2 border-ink-black rounded text-sm font-bold hover:bg-gray-100">
            Trang Bị
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
