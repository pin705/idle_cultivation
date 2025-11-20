<template>
  <div class="game-container">
    <MainLayout v-slot="{ currentTab }">
      <CultivationTab v-if="currentTab === 'cultivation'" />
      <EquipmentTab v-else-if="currentTab === 'equipment'" />
      <TechniquesTab v-else-if="currentTab === 'techniques'" />
      <SectTab v-else-if="currentTab === 'sect'" />
      <MissionsTab v-else-if="currentTab === 'missions'" />
      <ShopTab v-else-if="currentTab === 'shop'" />
      <AscensionTab v-else-if="currentTab === 'ascension'" />
      <AchievementsTab v-else-if="currentTab === 'achievements'" />
      <div v-else class="placeholder-tab">
        <h2>{{ currentTab }}</h2>
        <p>Tab content coming soon...</p>
      </div>
    </MainLayout>
  </div>
</template>

<script setup lang="ts">
import '../assets/css/main.css'
import { usePlayerStore } from '../stores/player'
import MainLayout from '../components/MainLayout.vue'
import CultivationTab from '../components/tabs/CultivationTab.vue'
import EquipmentTab from '../components/tabs/EquipmentTab.vue'
import TechniquesTab from '../components/tabs/TechniquesTab.vue'
import SectTab from '../components/tabs/SectTab.vue'
import MissionsTab from '../components/tabs/MissionsTab.vue'
import ShopTab from '../components/tabs/ShopTab.vue'
import AscensionTab from '../components/tabs/AscensionTab.vue'
import AchievementsTab from '../components/tabs/AchievementsTab.vue'
import { useApiAction } from '../composables/useApiAction'

const { loggedIn } = useUserSession()
const player = usePlayerStore()
const { call } = useApiAction()

// Auto-load or redirect
onMounted(async () => {
  if (loggedIn.value) {
    try {
      const response = await call('LOAD') as any
      if (response.success) {
        player.checkOfflineProgress()
      } else if (response.notFound) {
        navigateTo('/create-character')
      }
    } catch (e) {
      console.error('Failed to load', e)
    }
  } else {
    navigateTo('/login')
  }
})

// Auto-tick and world check intervals
let tickInterval: any
let worldCheckInterval: any
onMounted(() => {
  tickInterval = setInterval(() => {
    if (loggedIn.value) {
      player.serverTick()
    }
  }, 5000)
  
  worldCheckInterval = setInterval(() => {
    if (loggedIn.value) {
      call('WORLD_CHECK')
    }
  }, 60000)
})

onUnmounted(() => {
  if (tickInterval) clearInterval(tickInterval)
  if (worldCheckInterval) clearInterval(worldCheckInterval)
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.placeholder-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #6b7280;
}

.placeholder-tab h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #111827;
}

.placeholder-tab p {
  font-size: 1.125rem;
}
</style>
