<script setup lang="ts">
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import { useThemeColors } from '../../composables/useThemeColors'
import { REALMS, TECHNIQUES, WORLD_CYCLES } from '../../../shared/constants'
import Card from '../ui/Card.vue'
import Button from '../ui/Button.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const { call } = useApiAction()
const { getElementColorClass, getElementName } = useThemeColors()
const loading = ref(false)

const activeTechnique = computed(() => {
  const techKey = player?.cultivation?.activeTechnique
  if (!techKey) return null
  return TECHNIQUES.find(t => t.id === techKey)
})

const worldCycle = computed(() => {
  return player?.world?.currentCycle || 'normal'
})

const worldEvent = computed(() => {
  return player?.world?.activeEvent?.type || null
})

function getCycleName(cycle: string) {
  const cycleNames: any = {
    normal: 'Bình Thường',
    metal: 'Kim',
    wood: 'Mộc',
    water: 'Thủy',
    fire: 'Hỏa',
    earth: 'Thổ'
  }
  return cycleNames[cycle] || 'Không Xác Định'
}

function getEventName(eventType: string) {
  const eventNames: any = {
    qi_surge: 'Linh Khí Dâng Trào',
    tribulation_storm: 'Bão Thiên Kiếp',
    sect_blessing: 'Phúc Lành Tông Môn'
  }
  return eventNames[eventType] || 'Sự Kiện Không Xác Định'
}

const realmTimeline = computed(() => {
  const currentRealm = player?.realm?.major || 'Luyện Khí'
  const currentIndex = REALMS.indexOf(currentRealm)
  return REALMS.map((realm, index) => ({
    name: realm,
    completed: index < currentIndex,
    current: index === currentIndex,
    locked: index > currentIndex
  }))
})

async function breakthrough() {
  loading.value = true
  try {
    await call('BREAKTHROUGH')
  } finally {
    loading.value = false
  }
}

async function startTribulation() {
  loading.value = true
  try {
    await call('TRIB_PREPARE')
    await call('TRIB_START')
  } finally {
    loading.value = false
  }
}

async function condenseQi() {
  loading.value = true
  try {
    await call('QI_CONDENSE')
  } finally {
    loading.value = false
  }
}

const logs = computed(() => {
  return (player?.logs || []).slice(-10).reverse()
})

function getSectBonus() {
  return 0 // Placeholder
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="flex flex-col gap-4">
        <!-- Realm Progress -->
        <Card title="Tu Vi Cảnh Giới" shadow>
          <div class="flex justify-between items-center py-4">
            <div v-for="(realm, index) in realmTimeline" :key="realm.name" class="relative flex flex-col items-center gap-2 flex-1">
              <div :class="[
                'w-12 h-12 border-2 flex items-center justify-center font-bold z-10',
                realm.completed ? 'bg-element-wood border-element-wood text-paper' :
                realm.current ? 'bg-seal border-seal text-paper' :
                'bg-paper-aged border-ink-light text-ink-lighter opacity-40'
              ]">
                <span v-if="realm.completed">✓</span>
                <span v-else-if="realm.current">{{ player?.realm?.minor }}</span>
                <span v-else>🔒</span>
              </div>
              <div class="text-xs font-semibold text-center text-ink-light">{{ realm.name }}</div>
              <div v-if="index < realmTimeline.length - 1" class="absolute top-6 left-1/2 right-[-50%] h-0.5 bg-ink-light z-0"></div>
            </div>
          </div>
        </Card>

        <!-- Active Technique -->
        <Card title="Công Pháp Tu Luyện" shadow>
          <div v-if="activeTechnique" class="flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <div class="text-lg font-bold text-ink">{{ activeTechnique.name }}</div>
              <div :class="['text-sm font-semibold uppercase px-3 py-1', getElementColorClass(activeTechnique.element)]">
                {{ getElementName(activeTechnique.element) }}
              </div>
            </div>
            <div class="text-sm text-ink-light leading-relaxed">{{ activeTechnique.description }}</div>
            <Divider spacing="sm" />
            <div class="flex justify-between text-sm">
              <span class="text-ink-light">Tốc độ Tu Luyện:</span>
              <span class="font-bold text-element-wood">+{{ ((activeTechnique.baseRate - 1) * 100).toFixed(0) }}%</span>
            </div>
          </div>
          <div v-else class="text-center py-8 text-ink-light">
            <p class="mb-4">Chưa trang bị công pháp</p>
            <Button size="sm" @click="() => $emit('change-tab', 'techniques')">Chọn Công Pháp</Button>
          </div>
        </Card>

        <!-- World State -->
        <Card title="Thiên Địa Linh Khí" shadow>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <div class="text-sm text-ink-light">Chu Kỳ Ngũ Hành:</div>
              <div :class="['font-bold', getElementColorClass(worldCycle)]">{{ getCycleName(worldCycle) }}</div>
            </div>
            <div v-if="worldEvent" class="flex justify-between items-center">
              <div class="text-sm text-ink-light">Sự Kiện:</div>
              <div class="font-bold text-gold">{{ getEventName(worldEvent) }}</div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Right Column -->
      <div class="flex flex-col gap-4">
        <!-- Cultivation Rate Breakdown -->
        <Card title="Tốc Độ Tu Luyện" shadow>
          <div class="flex flex-col gap-3">
            <div class="flex justify-between text-lg font-bold">
              <span class="text-ink">Tổng:</span>
              <span class="text-element-wood font-mono">+{{ (player?.cultivation?.baseRate || 1).toFixed(1) }} Qi/giây</span>
            </div>
            <Divider spacing="sm" />
            <div class="flex flex-col gap-2 text-sm">
              <div class="flex justify-between">
                <span class="text-ink-light">Cơ Bản:</span>
                <span class="text-ink">×1.0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-light">Công Pháp:</span>
                <span class="text-element-wood font-semibold">+{{ activeTechnique ? ((activeTechnique.baseRate - 1) * 100).toFixed(0) : 0 }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-light">Trang Bị:</span>
                <span class="text-element-wood font-semibold">+0%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-ink-light">Chu Kỳ Thiên Địa:</span>
                <span class="text-element-wood font-semibold">+0%</span>
              </div>
              <div v-if="player?.sect?.contribution" class="flex justify-between">
                <span class="text-ink-light">Tông Môn:</span>
                <span class="text-element-wood font-semibold">+{{ getSectBonus() }}%</span>
              </div>
            </div>
          </div>
        </Card>

        <!-- Quick Actions -->
        <Card title="Hành Động" shadow>
          <div class="grid gap-3">
            <Button variant="primary" size="lg" full-width :loading="loading" @click="breakthrough">
              Đột Phá Cảnh Giới
            </Button>
            <Button variant="accent" size="lg" full-width :loading="loading" @click="startTribulation">
              Độ Thiên Kiếp
            </Button>
            <Button variant="secondary" size="lg" full-width :loading="loading" @click="condenseQi">
              Ngưng Tụ Linh Khí
            </Button>
          </div>
        </Card>

        <!-- Recent Logs -->
        <Card title="Nhật Ký Tu Luyện" shadow>
          <div class="max-h-[300px] overflow-y-auto scrollbar-ink flex flex-col gap-2">
            <div v-for="(log, index) in logs" :key="index" class="flex gap-3 p-2 bg-paper-aged border-l-2 border-seal text-sm">
              <span class="text-ink-light font-semibold shrink-0">{{ new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }}</span>
              <span class="text-ink flex-1">{{ log }}</span>
            </div>
            <div v-if="logs.length === 0" class="text-center py-8 text-ink-light">
              Chưa có nhật ký
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
