<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'

const player = usePlayerStore()
const { call } = useApiAction()

const condensing = ref(false)
const condenseAmount = ref(1)

async function condenseQi() {
  if (condensing.value) return
  if (condenseAmount.value <= 0) {
    player.addLog('Số lượng không hợp lệ')
    return
  }
  condensing.value = true
  await call('QI_CONDENSE', { amount: condenseAmount.value })
  condensing.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold">{{ player.name }}</h4>
        <p class="text-seal-red font-bold">{{ player.formattedRealm }}</p>
        <p class="text-sm text-gray-600">Đạo: <span class="font-bold capitalize">{{ (player as any).realmPath || 'none' }}</span></p>
      </div>
      <div class="text-sm text-gray-600">
        Tốc độ hấp thu: <span class="font-bold">{{ player.qiRate }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="font-bold mb-1">Thuộc Tính</div>
        <ul class="text-sm leading-6">
          <li>Khí: <span class="font-mono font-bold">{{ Math.floor(player.attributes.qi) }}</span></li>
          <li>Thể: <span class="font-mono font-bold">{{ player.attributes.body }}</span></li>
          <li>Thần: <span class="font-mono font-bold">{{ player.attributes.spirit }}</span></li>
          <li>Tư Chất: <span class="font-mono font-bold">{{ player.attributes.talent }}</span></li>
        </ul>
      </div>
      <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="font-bold mb-1">Công Pháp</div>
        <ul class="text-sm leading-6">
          <li>Đang vận: <span class="font-bold">{{ player.cultivation.activeTechnique }}</span></li>
          <li>Ngũ hành: <span class="font-bold capitalize">{{ player.cultivation.element }}</span></li>
          <li>Cơ sở: <span class="font-mono font-bold">{{ player.cultivation.baseRate }}</span> khí/giây</li>
        </ul>
      </div>
    </div>

    <!-- Qi Condensation Section -->
    <div class="p-4 border-2 border-seal-red rounded bg-red-50">
      <div class="font-bold mb-2 text-seal-red">Ngưng Kết Linh Khí</div>
      <p class="text-xs text-gray-600 mb-3">Chuyển hóa Linh Khí thành Linh Thạch (1000:1)</p>
      <div class="flex gap-2 items-center">
        <input 
          v-model.number="condenseAmount" 
          type="number" 
          min="1" 
          max="999" 
          class="flex-1 px-3 py-2 border-2 border-ink-black rounded font-mono text-center"
          placeholder="Số lượng Linh Thạch"
        />
        <button 
          @click="condenseQi"
          :disabled="condensing || player.attributes.qi < condenseAmount * 1000"
          class="px-4 py-2 bg-seal-red text-white font-bold rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ condensing ? 'Đang ngưng kết...' : 'Ngưng Kết' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">Chi phí: {{ condenseAmount * 1000 }} Linh Khí</p>
    </div>
  </div>
</template>
