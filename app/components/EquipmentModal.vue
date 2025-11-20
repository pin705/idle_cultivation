<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'

const player = usePlayerStore()
const { call } = useApiAction()

function slotName(s: string) {
  return { weapon: 'Vũ Khí', armor: 'Giáp', accessory: 'Pháp Bảo', talisman: 'Bùa Chú' }[s] || s
}

async function equip(uid: string, slot: string) {
  await call('EQUIP_ITEM', { uid, slot })
}

async function unequip(slot: string) {
  await call('UNEQUIP_ITEM', { slot })
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div v-for="s in ['weapon','armor','accessory','talisman']" :key="s" class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="font-bold mb-2">{{ slotName(s) }}</div>
        <div v-if="(player as any).equipment?.find((e: any) => e.slot === s)" class="flex items-center justify-between">
          <div class="text-sm">
            Trang bị: {{ (player as any).equipment?.find((e: any) => e.slot === s)?.itemId?.name || '???' }}
          </div>
          <button @click="unequip(s)" class="px-3 py-1 text-sm bg-white border-2 border-ink-black rounded hover:bg-gray-100">Tháo</button>
        </div>
        <div v-else class="text-sm text-gray-600">Chưa trang bị</div>
      </div>
    </div>

    <div>
      <div class="font-bold mb-2">Túi Trang Bị</div>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="inv in player.inventory" :key="inv.uid || inv._id" class="p-2 border-2 border-gray-300 rounded bg-white text-xs flex flex-col gap-1">
          <div class="font-bold">{{ inv.itemId?.name || '???' }}</div>
          <div class="text-gray-600">x{{ inv.count || 1 }}</div>
          <div class="flex gap-2 mt-1">
            <button v-if="inv.uid && inv.itemId?.type === 'equipment'" @click="equip(inv.uid, inv.itemId?.slot)" class="px-2 py-1 border-2 border-ink-black rounded text-xs">Trang Bị</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
