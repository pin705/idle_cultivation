<script setup lang="ts">
import { TECHNIQUES, canUnlockTechnique } from '../../shared/constants'
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'

const player = usePlayerStore()
const { call } = useApiAction()

function owned(id: string) {
  return player as any && (player as any).techniques?.unlocked?.includes(id)
}

function canUnlock(t: any) {
  return canUnlockTechnique(
    t, 
    player.realm.major, 
    player.realm.minor, 
    (player as any).techniques?.unlocked || []
  )
}

function getTechniquesByTier() {
  const tiers: any = {
    'Luyện Khí': [],
    'Trúc Cơ': [],
    'Kim Đan': [],
    'Nguyên Anh': [],
    'Hóa Thần': []
  }
  
  TECHNIQUES.forEach(t => {
    const realm = t.minRealm || 'Luyện Khí'
    if (tiers[realm]) tiers[realm].push(t)
  })
  
  return tiers
}

const techniquesByTier = computed(() => getTechniquesByTier())

async function unlock(id: string) {
  await call('TECH_UNLOCK', { id })
}

async function equip(id: string, slot: 'active' | 'passive') {
  await call('TECH_EQUIP', { id, slot })
}

function getElementColor(element?: string) {
  const colors: any = {
    metal: 'text-gray-600',
    wood: 'text-green-600',
    water: 'text-blue-600',
    fire: 'text-red-600',
    earth: 'text-yellow-700'
  }
  return element ? colors[element] || 'text-gray-500' : 'text-gray-500'
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-3 bg-blue-50 border-2 border-blue-300 rounded text-sm">
      <div class="font-bold mb-1">Hệ Thống Công Pháp</div>
      <div class="text-xs text-gray-600">Tối đa: 1 chủ động, 2 bị động. Công pháp mới mở khóa theo cảnh giới.</div>
    </div>

    <div class="space-y-3">
      <div v-for="(techs, realm) in techniquesByTier" :key="realm" v-show="techs.length > 0">
        <div class="font-bold text-seal-red mb-2 pb-1 border-b-2 border-ink-black">{{ realm }}</div>
        <div class="grid grid-cols-1 gap-2">
          <div 
            v-for="t in techs" 
            :key="t.id" 
            class="p-3 border-2 rounded transition-all"
            :class="[
              owned(t.id) ? 'border-green-500 bg-green-50' : 
              canUnlock(t) ? 'border-ink-black bg-white' : 
              'border-gray-300 bg-gray-100 opacity-60'
            ]"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-bold">{{ t.name }}</span>
                  <span class="text-xs px-2 py-0.5 rounded" :class="t.type === 'active' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'">
                    {{ t.type === 'active' ? 'Chủ động' : 'Bị động' }}
                  </span>
                  <span v-if="t.element" :class="getElementColor(t.element)" class="text-xs font-bold">
                    {{ t.element }}
                  </span>
                </div>
                <div class="text-xs text-gray-600 space-y-0.5">
                  <div>
                    Hiệu ứng: 
                    <span v-if="t.effect.rateMult" class="font-mono">×{{ t.effect.rateMult }}</span>
                    <span v-if="t.effect.rateAdd" class="font-mono"> +{{ t.effect.rateAdd }}/s</span>
                  </div>
                  <div v-if="t.cost.spiritStones || t.cost.herbs">
                    Chi phí: 
                    <span v-if="t.cost.spiritStones" class="font-mono">{{ t.cost.spiritStones }} Linh Thạch</span>
                    <span v-if="t.cost.herbs" class="font-mono ml-2">{{ t.cost.herbs }} Thảo Dược</span>
                  </div>
                  <div v-if="t.minRealm && t.minRealmMinor" class="text-seal-red">
                    Yêu cầu: {{ t.minRealm }} {{ t.minRealmMinor }}
                  </div>
                  <div v-if="t.requires && t.requires.length > 0" class="text-purple-600">
                    Tiên quyết: {{ t.requires.join(', ') }}
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <button 
                  v-if="!owned(t.id)"
                  @click="unlock(t.id)"
                  :disabled="!canUnlock(t)"
                  class="px-3 py-1.5 bg-seal-red text-white border-2 border-ink-black rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                  {{ canUnlock(t) ? 'Lĩnh Ngộ' : 'Khóa' }}
                </button>
                <button 
                  v-else
                  @click="equip(t.id, t.type === 'active' ? 'active' : 'passive')"
                  class="px-3 py-1.5 bg-green-600 text-white border-2 border-ink-black rounded text-xs font-bold hover:bg-green-700 transition-colors whitespace-nowrap">
                  Trang Bị
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
