<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'
import { calcEnhancementCost, calcEnhancementSuccessRate } from '../../shared/constants'

const player = usePlayerStore()
const { call } = useApiAction()

function slotName(s: string) {
  return { 
    weapon: 'Vũ Khí', 
    armor: 'Giáp', 
    helmet: 'Mũ Giáp',
    boots: 'Hài',
    accessory: 'Pháp Bảo', 
    talisman: 'Bùa Chú' 
  }[s] || s
}

async function equip(uid: string, slot: string) {
  await call('EQUIP_ITEM', { uid, slot })
}

async function unequip(slot: string) {
  await call('UNEQUIP_ITEM', { slot })
}

async function enhance(slot: string) {
  await call('EQUIP_ENHANCE', { slot })
}

function getEnhanceLevel(slot: string) {
  const eq = (player as any).equipment?.find((e: any) => e.slot === slot)
  return eq?.enhanceLevel || 0
}

function getEquipmentName(slot: string) {
  const eq = (player as any).equipment?.find((e: any) => e.slot === slot)
  return eq?.itemId?.name || '???'
}
</script>

<template>
  <div class="space-y-4">
    <!-- Equipment Slots (6 slots) -->
    <div class="p-4 border-2 border-seal-red rounded bg-red-50">
      <div class="font-bold text-xl mb-3 text-seal-red">⚔️ Trang Bị Hiện Tại (6 Ô)</div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="s in ['weapon','armor','helmet','boots','accessory','talisman']" :key="s" 
             class="p-3 border-2 border-ink-black rounded bg-white">
          <div class="font-bold mb-2 text-sm">{{ slotName(s) }}</div>
          <div v-if="(player as any).equipment?.find((e: any) => e.slot === s)" class="space-y-2">
            <div class="text-sm">
              <div class="font-bold">{{ getEquipmentName(s) }}</div>
              <div v-if="getEnhanceLevel(s) > 0" class="text-blue-600 font-bold">
                +{{ getEnhanceLevel(s) }}
              </div>
            </div>
            <div class="flex gap-1">
              <button @click="unequip(s)" 
                      class="flex-1 px-2 py-1 text-xs bg-gray-200 border-2 border-ink-black rounded hover:bg-gray-300">
                Tháo
              </button>
              <button @click="enhance(s)"
                      class="flex-1 px-2 py-1 text-xs bg-blue-500 text-white border-2 border-ink-black rounded hover:bg-blue-600">
                +{{ getEnhanceLevel(s) + 1 }}
              </button>
            </div>
            <div class="text-xs text-gray-600">
              <div>Chi phí: {{ calcEnhancementCost(getEnhanceLevel(s)) }} 💎</div>
              <div>Tỉ lệ: {{ Math.floor(calcEnhancementSuccessRate(getEnhanceLevel(s)) * 100) }}%</div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-400 text-center py-4">Chưa trang bị</div>
        </div>
      </div>
    </div>

    <!-- Enhancement Info -->
    <div class="p-3 bg-blue-50 border-2 border-blue-300 rounded text-sm">
      <div class="font-bold mb-1">💎 Hệ Thống Cường Hóa</div>
      <div class="text-xs text-gray-600 space-y-1">
        <div>• Mỗi cấp cường hóa tăng 10% hiệu quả trang bị</div>
        <div>• +1 đến +5: 100% thành công</div>
        <div>• +6 đến +9: Giảm tỉ lệ thành công, thất bại có thể giảm cấp</div>
        <div>• +10: Tối đa</div>
      </div>
    </div>

    <!-- Inventory -->
    <div class="p-4 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold text-xl mb-3">🎒 Túi Trang Bị</div>
      <div v-if="player.inventory.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        <div v-for="inv in player.inventory" :key="inv.uid || inv._id" 
             class="p-2 border-2 border-gray-300 rounded bg-white text-xs">
          <div class="font-bold mb-1">{{ inv.itemId?.name || '???' }}</div>
          <div class="text-gray-600 mb-1">x{{ inv.count || 1 }}</div>
          <div v-if="inv.enhanceLevel" class="text-blue-600 font-bold mb-1">+{{ inv.enhanceLevel }}</div>
          <button v-if="inv.uid && inv.itemId?.type === 'equipment'" 
                  @click="equip(inv.uid, inv.itemId?.slot)" 
                  class="w-full px-2 py-1 bg-seal-red text-white border-2 border-ink-black rounded text-xs hover:bg-red-700">
            Trang Bị
          </button>
        </div>
      </div>
      <div v-else class="text-sm text-gray-500 text-center py-8">Túi trống</div>
    </div>
  </div>
</template>
