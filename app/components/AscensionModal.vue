<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'
import { ref, computed, onMounted } from 'vue'

const player = usePlayerStore()
const { call } = useApiAction()

const showModal = ref(false)
const loading = ref(false)
const ascensionInfo = ref<any>(null)

const ASCENSION_PERKS = {
  eternal_qi: {
    id: 'eternal_qi',
    name: 'Vĩnh Hằng Linh Khí',
    description: 'Mỗi cấp tăng 10% tốc độ tu luyện vĩnh viễn',
    cost: 1,
    maxLevel: 10,
    effect: '+10% Qi/cấp'
  },
  treasure_hunter: {
    id: 'treasure_hunter',
    name: 'Thám Bảo Cao Thủ',
    description: 'Tăng 5% tỷ lệ rơi vật phẩm mỗi cấp',
    cost: 2,
    maxLevel: 5,
    effect: '+5% Drop/cấp'
  },
  wealthy_cultivator: {
    id: 'wealthy_cultivator',
    name: 'Phú Quý Tu Sĩ',
    description: 'Tăng 15% Linh Thạch thu được mỗi cấp',
    cost: 1,
    maxLevel: 8,
    effect: '+15% Stones/cấp'
  },
  realm_master: {
    id: 'realm_master',
    name: 'Mật Cảnh Chuyên Gia',
    description: 'Thêm 1 vé Mật Cảnh mỗi ngày (mỗi cấp)',
    cost: 3,
    maxLevel: 3,
    effect: '+1 Vé/cấp'
  },
  reincarnation_qi: {
    id: 'reincarnation_qi',
    name: 'Luân Hồi Đạo Tâm',
    description: 'Bắt đầu với 100 Qi mỗi lần Thăng Thiên (mỗi cấp)',
    cost: 2,
    maxLevel: 5,
    effect: '+100 Starting Qi/cấp'
  }
}

const open = async () => {
  showModal.value = true
  await loadInfo()
}

const close = () => {
  showModal.value = false
}

const loadInfo = async () => {
  loading.value = true
  try {
    const response = await call('ASCENSION_INFO') as any
    if (response.success) {
      ascensionInfo.value = response.data
    }
  } catch (e) {
    console.error('Failed to load ascension info', e)
  } finally {
    loading.value = false
  }
}

const performAscension = async () => {
  if (!confirm('Thăng Thiên sẽ reset toàn bộ tiến độ! Bạn có chắc chắn?')) return
  
  loading.value = true
  try {
    const response = await call('ASCENSION_PERFORM') as any
    if (response.success) {
      player.addLog(response.message || response.log)
      await loadInfo()
    } else {
      alert(response.message)
    }
  } catch (e) {
    console.error('Failed to ascend', e)
  } finally {
    loading.value = false
  }
}

const upgradePerk = async (perkId: string) => {
  loading.value = true
  try {
    const response = await call('ASCENSION_UPGRADE_PERK', { perkId }) as any
    if (response.success) {
      player.addLog(response.message || response.log)
      await loadInfo()
    } else {
      alert(response.message)
    }
  } catch (e) {
    console.error('Failed to upgrade perk', e)
  } finally {
    loading.value = false
  }
}

const getPerkLevel = (perkId: string): number => {
  const perk = ascensionInfo.value?.perks?.find((p: any) => p.perkId === perkId)
  return perk?.level || 0
}

defineExpose({ open, close })
</script>

<template>
  <BaseModal v-model="showModal" title="Thăng Thiên" max-width="max-w-4xl">
    <div v-if="loading && !ascensionInfo" class="text-center py-8">
      <p class="text-gray-500">Đang tải...</p>
    </div>

    <div v-else-if="ascensionInfo" class="space-y-4">
      <!-- Ascension Status -->
      <div class="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400">
        <div class="grid grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <p class="text-gray-600">Cấp Thăng Thiên:</p>
            <p class="text-2xl font-bold text-purple-700">{{ ascensionInfo.ascensionLevel }}</p>
          </div>
          <div>
            <p class="text-gray-600">Điểm Khả Dụng:</p>
            <p class="text-2xl font-bold text-purple-700">{{ ascensionInfo.availablePoints }}</p>
          </div>
        </div>
      </div>

      <!-- Ascension Progress -->
      <div class="p-4 bg-gray-50 border border-gray-300">
        <h4 class="font-bold mb-2">Tiến Độ Thăng Thiên</h4>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Qi Hiện Tại:</span>
            <span class="font-mono">{{ Math.floor(ascensionInfo.currentQi).toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Qi Yêu Cầu:</span>
            <span class="font-mono">{{ ascensionInfo.requiredQi.toLocaleString() }}</span>
          </div>
          <div class="w-full bg-gray-300 h-4 border border-gray-400">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
              :style="{ width: Math.min(100, (ascensionInfo.currentQi / ascensionInfo.requiredQi * 100)) + '%' }"
            ></div>
          </div>
        </div>

        <button
          @click="performAscension"
          :disabled="!ascensionInfo.canAscend || loading"
          class="w-full mt-4 px-4 py-3 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-purple-700 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ ascensionInfo.canAscend ? 'THĂNG THIÊN' : 'Chưa Đủ Qi' }}
        </button>
      </div>

      <!-- Perks -->
      <div class="space-y-3">
        <h4 class="font-bold text-lg border-b border-gray-300 pb-2">Năng Lực Vĩnh Viễn</h4>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div 
            v-for="perk in Object.values(ASCENSION_PERKS)" 
            :key="perk.id"
            class="p-3 border border-gray-300 hover:border-purple-400 transition-colors"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h5 class="font-bold text-sm">{{ perk.name }}</h5>
                <p class="text-xs text-gray-600 mt-1">{{ perk.description }}</p>
              </div>
              <span class="ml-2 px-2 py-1 text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                {{ getPerkLevel(perk.id) }} / {{ perk.maxLevel }}
              </span>
            </div>

            <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <div class="text-xs">
                <span class="text-gray-600">Hiệu ứng: </span>
                <span class="font-bold">{{ perk.effect }}</span>
              </div>
              <button
                @click="upgradePerk(perk.id)"
                :disabled="loading || getPerkLevel(perk.id) >= perk.maxLevel || ascensionInfo.availablePoints < perk.cost"
                class="px-3 py-1 text-xs font-bold border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Nâng Cấp ({{ perk.cost }}đ)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning -->
      <div class="p-3 bg-red-50 border border-red-300 text-xs text-red-700">
        ⚠️ <strong>Cảnh báo:</strong> Thăng Thiên sẽ reset toàn bộ tu vi, vật phẩm, trang bị, tông môn. Chỉ giữ lại Năng Lực Vĩnh Viễn!
      </div>
    </div>
  </BaseModal>
</template>
