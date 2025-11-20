<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import { usePlayerStore } from '../stores/player'
import { useApiAction } from '../composables/useApiAction'
import { ref, computed, onMounted } from 'vue'

const player = usePlayerStore()
const { call } = useApiAction()

const showModal = ref(false)
const realms = ref<any[]>([])
const tickets = ref(3)
const activeRun = ref<any>(null)
const loading = ref(false)

const open = () => {
  showModal.value = true
  loadRealms()
}

const close = () => {
  showModal.value = false
}

const loadRealms = async () => {
  loading.value = true
  try {
    const response = await call('REALM_LIST') as any
    if (response.success) {
      realms.value = response.data.realms || []
      tickets.value = response.data.tickets || 0
      activeRun.value = response.data.activeRun || null
      player.secretRealms.tickets = tickets.value
      player.secretRealms.activeRun = activeRun.value
    }
  } catch (e) {
    console.error('Failed to load realms', e)
  } finally {
    loading.value = false
  }
}

const enterRealm = async (realmKey: string) => {
  loading.value = true
  try {
    const response = await call('REALM_ENTER', { realmKey }) as any
    if (response.success) {
      player.addLog(response.message || response.log)
      await loadRealms()
    } else {
      alert(response.message)
    }
  } catch (e) {
    console.error('Failed to enter realm', e)
  } finally {
    loading.value = false
  }
}

const completeRealm = async () => {
  loading.value = true
  try {
    const response = await call('REALM_COMPLETE') as any
    if (response.success) {
      player.addLog(response.message || response.log)
      await loadRealms()
    } else {
      alert(response.message)
    }
  } catch (e) {
    console.error('Failed to complete realm', e)
  } finally {
    loading.value = false
  }
}

const timeRemaining = computed(() => {
  if (!activeRun.value?.endsAt) return 0
  const now = Date.now()
  const end = new Date(activeRun.value.endsAt).getTime()
  return Math.max(0, Math.floor((end - now) / 1000))
})

const isRealmComplete = computed(() => timeRemaining.value === 0 && activeRun.value?.realmKey)

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    common: 'text-gray-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-yellow-600'
  }
  return colors[tier] || 'text-gray-600'
}

defineExpose({ open, close })
</script>

<template>
  <BaseModal v-model="showModal" title="Mật Cảnh" max-width="max-w-4xl">
    <div class="space-y-4">
      <!-- Tickets Info -->
      <div class="p-3 bg-gray-50 border border-gray-300 flex justify-between items-center">
        <span class="font-bold text-sm sm:text-base">Vé Mật Cảnh:</span>
        <span class="text-xl sm:text-2xl font-bold text-seal-red">{{ tickets }}</span>
      </div>

      <!-- Active Run -->
      <div v-if="activeRun?.realmKey" class="p-4 bg-yellow-50 border border-yellow-400">
        <h4 class="font-bold text-base sm:text-lg mb-2">Đang Thám Hiểm</h4>
        <p class="text-sm mb-2">Mật Cảnh: <span class="font-bold">{{ activeRun.realmKey }}</span></p>
        <div class="flex justify-between items-center">
          <span class="text-sm">Thời gian còn lại:</span>
          <span class="font-mono text-lg font-bold">{{ formatTime(timeRemaining) }}</span>
        </div>
        <button 
          v-if="isRealmComplete"
          @click="completeRealm"
          :disabled="loading"
          class="w-full mt-3 px-4 py-2 bg-seal-red text-white font-bold border border-ink-black hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Nhận Thưởng
        </button>
      </div>

      <!-- Realms List -->
      <div class="space-y-3">
        <h4 class="font-bold text-base sm:text-lg border-b border-gray-300 pb-2">Danh Sách Mật Cảnh</h4>
        
        <div v-if="loading && realms.length === 0" class="text-center py-8 text-gray-500">
          Đang tải...
        </div>

        <div v-else-if="realms.length === 0" class="text-center py-8 text-gray-500">
          Chưa có Mật Cảnh nào
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div 
            v-for="realm in realms" 
            :key="realm.key"
            class="p-3 border border-gray-300 hover:border-seal-red transition-colors"
          >
            <div class="flex justify-between items-start mb-2">
              <h5 class="font-bold text-sm sm:text-base">{{ realm.name }}</h5>
              <span class="text-xs font-bold px-2 py-1 border" :class="getTierColor(realm.tier)">
                {{ realm.tier }}
              </span>
            </div>
            
            <p class="text-xs text-gray-600 mb-2 line-clamp-2">{{ realm.description }}</p>
            
            <div class="text-xs space-y-1 mb-3">
              <div class="flex justify-between">
                <span>Thời gian:</span>
                <span class="font-mono">{{ Math.floor(realm.duration / 60) }} phút</span>
              </div>
              <div class="flex justify-between">
                <span>Chi phí:</span>
                <span class="font-bold">{{ realm.ticketCost }} vé</span>
              </div>
              <div class="flex justify-between">
                <span>Yêu cầu:</span>
                <span class="font-bold">{{ realm.requirements?.minRealm || 'Không' }}</span>
              </div>
            </div>

            <!-- Rewards Preview -->
            <div class="bg-gray-50 p-2 mb-2 text-xs">
              <div class="font-bold mb-1">Phần thưởng:</div>
              <div class="space-y-0.5 text-gray-700">
                <div v-if="realm.rewards?.qi">Qi: {{ realm.rewards.qi.min }}-{{ realm.rewards.qi.max }}</div>
                <div v-if="realm.rewards?.spiritStones">Linh Thạch: {{ realm.rewards.spiritStones.min }}-{{ realm.rewards.spiritStones.max }}</div>
                <div v-if="realm.rewards?.herbs">Thảo Dược: {{ realm.rewards.herbs.min }}-{{ realm.rewards.herbs.max }}</div>
              </div>
            </div>

            <button 
              @click="enterRealm(realm.key)"
              :disabled="loading || tickets < realm.ticketCost || activeRun?.realmKey"
              class="w-full px-3 py-2 text-sm font-bold border border-ink-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ activeRun?.realmKey ? 'Đang Thám Hiểm' : 'Bước Vào' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
