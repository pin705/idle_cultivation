<template>
  <div class="missions-container">
    <!-- Active Missions Section -->
    <Card v-if="activeMissions.length > 0" title="Nhiệm Vụ Đang Thực Hiện" class="active-missions-card">
      <div class="active-missions-grid">
        <div v-for="mission in activeMissions" :key="mission.key" class="active-mission-card">
          <div class="mission-header">
            <div class="mission-name">{{ getMissionDef(mission.key)?.name }}</div>
            <div class="mission-timer" :class="{ 'timer-completed': isMissionCompleted(mission) }">
              {{ formatMissionTime(mission) }}
            </div>
          </div>
          <div class="mission-description">{{ getMissionDef(mission.key)?.description }}</div>
          <div class="mission-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getMissionProgress(mission) + '%' }"></div>
            </div>
            <span class="progress-text">{{ getMissionProgress(mission).toFixed(0) }}%</span>
          </div>
          <div class="mission-rewards">
            <span v-if="getMissionDef(mission.key)?.rewards.qi" class="reward-item">
              <span class="reward-icon">⚡</span> +{{ getMissionDef(mission.key)?.rewards.qi }} Qi
            </span>
            <span v-if="getMissionDef(mission.key)?.rewards.spiritStones" class="reward-item">
              <span class="reward-icon">💎</span> +{{ getMissionDef(mission.key)?.rewards.spiritStones }} Linh Thạch
            </span>
            <span v-if="getMissionDef(mission.key)?.rewards.herbs" class="reward-item">
              <span class="reward-icon">🌿</span> +{{ getMissionDef(mission.key)?.rewards.herbs }} Thảo Dược
            </span>
          </div>
          <Button 
            v-if="isMissionCompleted(mission) && !mission.claimed" 
            variant="accent" 
            size="small" 
            @click="claimMission(mission.key)"
            fullWidth
          >
            Nhận Thưởng
          </Button>
        </div>
      </div>
    </Card>

    <!-- Available Missions Section -->
    <div class="missions-section">
      <div class="section-header">
        <h2>Nhiệm Vụ Hàng Ngày</h2>
        <div class="daily-reset-timer">Làm mới sau: {{ dailyResetTimer }}</div>
      </div>
      
      <div class="missions-grid">
        <div v-for="mission in dailyMissions" :key="mission.key" class="mission-card">
          <div class="mission-badge daily-badge">Hàng Ngày</div>
          <div class="mission-info">
            <div class="mission-name">{{ mission.name }}</div>
            <div class="mission-description">{{ mission.description }}</div>
            <div class="mission-duration" v-if="mission.duration > 0">
              <span class="duration-icon">⏱️</span> {{ formatDuration(mission.duration) }}
            </div>
            <div class="mission-requirements" v-if="mission.requirements?.minRealm">
              <span class="req-icon">🔒</span> Yêu cầu: {{ mission.requirements.minRealm }}
            </div>
          </div>
          <div class="mission-rewards">
            <div v-if="mission.rewards.qi" class="reward-item">
              <span class="reward-icon">⚡</span> +{{ mission.rewards.qi }} Qi
            </div>
            <div v-if="mission.rewards.spiritStones" class="reward-item">
              <span class="reward-icon">💎</span> +{{ mission.rewards.spiritStones }}
            </div>
            <div v-if="mission.rewards.herbs" class="reward-item">
              <span class="reward-icon">🌿</span> +{{ mission.rewards.herbs }}
            </div>
          </div>
          <Button 
            variant="primary" 
            size="small" 
            @click="assignMission(mission.key)"
            :disabled="!canAssignMission(mission)"
            fullWidth
          >
            {{ isCompleted(mission.key) ? 'Đã Hoàn Thành' : 'Nhận Nhiệm Vụ' }}
          </Button>
        </div>
      </div>
    </div>

    <div class="missions-section">
      <h2>Nhiệm Vụ Lặp Lại</h2>
      <div class="missions-grid">
        <div v-for="mission in repeatableMissions" :key="mission.key" class="mission-card">
          <div class="mission-badge repeatable-badge">Lặp Lại</div>
          <div class="mission-info">
            <div class="mission-name">{{ mission.name }}</div>
            <div class="mission-description">{{ mission.description }}</div>
            <div class="mission-duration">
              <span class="duration-icon">⏱️</span> {{ formatDuration(mission.duration) }}
            </div>
            <div class="mission-requirements" v-if="mission.requirements?.minRealm">
              <span class="req-icon">🔒</span> Yêu cầu: {{ mission.requirements.minRealm }}
            </div>
          </div>
          <div class="mission-rewards">
            <div v-if="mission.rewards.qi" class="reward-item">
              <span class="reward-icon">⚡</span> +{{ mission.rewards.qi }} Qi
            </div>
            <div v-if="mission.rewards.spiritStones" class="reward-item">
              <span class="reward-icon">💎</span> +{{ mission.rewards.spiritStones }}
            </div>
            <div v-if="mission.rewards.herbs" class="reward-item">
              <span class="reward-icon">🌿</span> +{{ mission.rewards.herbs }}
            </div>
          </div>
          <Button 
            variant="primary" 
            size="small" 
            @click="assignMission(mission.key)"
            :disabled="!canAssignMission(mission)"
            fullWidth
          >
            Nhận Nhiệm Vụ
          </Button>
        </div>
      </div>
    </div>

    <Divider text="Mật Cảnh Bí Truyền" :spacing="32" />

    <!-- Secret Realms Section -->
    <div class="secret-realms-section">
      <div class="section-header">
        <h2>Mật Cảnh Khả Dụng</h2>
        <div class="tickets-display">
          <span class="ticket-icon">🎫</span>
          <span class="ticket-count">{{ player.secretRealms?.tickets || 0 }}</span> Vé Mật Cảnh
        </div>
      </div>

      <div class="realms-grid">
        <div v-for="realm in secretRealms" :key="realm.key" class="realm-card" :class="'tier-' + realm.tier">
          <div class="realm-tier-badge" :class="'badge-' + realm.tier">
            {{ getTierName(realm.tier) }}
          </div>
          <div class="realm-header">
            <h3 class="realm-name">{{ realm.name }}</h3>
            <div class="realm-duration">
              <span class="duration-icon">⏱️</span> {{ Math.floor(realm.duration / 60) }}m
            </div>
          </div>
          <p class="realm-description">{{ realm.description }}</p>
          
          <div class="realm-requirements">
            <div class="req-item">
              <span class="req-icon">🔒</span> {{ realm.requirements.minRealm }}
            </div>
            <div class="req-item">
              <span class="req-icon">⚡</span> {{ realm.requirements.minQi }} Qi
            </div>
            <div class="req-item">
              <span class="req-icon">🎫</span> {{ realm.ticketCost }} Vé
            </div>
          </div>

          <div class="realm-rewards">
            <div class="rewards-title">Phần Thưởng:</div>
            <div class="rewards-list">
              <div class="reward-range">
                <span class="reward-icon">⚡</span> {{ realm.rewards.qi.min }}-{{ realm.rewards.qi.max }} Qi
              </div>
              <div class="reward-range">
                <span class="reward-icon">💎</span> {{ realm.rewards.spiritStones.min }}-{{ realm.rewards.spiritStones.max }}
              </div>
              <div class="reward-range">
                <span class="reward-icon">🌿</span> {{ realm.rewards.herbs.min }}-{{ realm.rewards.herbs.max }}
              </div>
            </div>
          </div>

          <div class="realm-loot">
            <div class="loot-title">Vật Phẩm Rơi:</div>
            <div class="loot-list">
              <div v-for="(loot, idx) in realm.lootTable" :key="idx" class="loot-item">
                <span class="loot-name">{{ loot.itemName }}</span>
                <span class="loot-rate">({{ (loot.dropRate * 100).toFixed(0) }}%)</span>
              </div>
            </div>
          </div>

          <Button 
            variant="accent" 
            size="medium" 
            @click="enterRealm(realm.key)"
            :disabled="!canEnterRealm(realm)"
            fullWidth
          >
            {{ canEnterRealm(realm) ? 'Vào Mật Cảnh' : 'Chưa Đủ Điều Kiện' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../../stores/player'
import { useApiAction } from '../../composables/useApiAction'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'
import Divider from '../ui/Divider.vue'

const player = usePlayerStore()
const themeStore = useThemeStore()
const { call } = useApiAction()

// Import constants (we'll assume they're accessible)
// In a real app, you'd import from shared/constants
const MISSIONS = [
  { 
    key: 'daily_cultivate', 
    name: 'Tu Luyện Tinh Tấn', 
    description: 'Tu luyện trong 1 giờ',
    type: 'daily',
    duration: 3600_000,
    rewards: { spiritStones: 100, herbs: 10 }
  },
  { 
    key: 'daily_breakthrough', 
    name: 'Đột Phá Tiến Bộ', 
    description: 'Hoàn thành 1 đột phá',
    type: 'daily',
    duration: 0,
    rewards: { spiritStones: 150, qi: 200 }
  },
  { 
    key: 'daily_tribulation', 
    name: 'Vượt Qua Thiên Kiếp', 
    description: 'Hoàn thành 1 Thiên Kiếp',
    type: 'daily',
    duration: 0,
    rewards: { spiritStones: 200, herbs: 20 },
    requirements: { minRealm: 'Trúc Cơ' }
  },
  { 
    key: 'daily_realm', 
    name: 'Thám Hiểm Mật Cảnh', 
    description: 'Hoàn thành 1 Mật Cảnh',
    type: 'daily',
    duration: 0,
    rewards: { spiritStones: 250, herbs: 25 },
    requirements: { minRealm: 'Luyện Khí' }
  },
  { 
    key: 'gather_herbs', 
    name: 'Thu Thập Thảo Dược', 
    description: 'Đi thu thập thảo dược trong rừng',
    type: 'repeatable',
    duration: 60_000,
    rewards: { herbs: 5 }
  },
  { 
    key: 'guard_gate', 
    name: 'Canh Gác Sơn Môn', 
    description: 'Canh giữ cổng sơn môn',
    type: 'repeatable',
    duration: 120_000,
    rewards: { spiritStones: 50 }
  },
  { 
    key: 'refine_pills', 
    name: 'Luyện Đan Dược', 
    description: 'Luyện chế đan dược',
    type: 'repeatable',
    duration: 180_000,
    rewards: { spiritStones: 80, herbs: 3 },
    requirements: { minRealm: 'Kim Đan' }
  },
  { 
    key: 'meditate', 
    name: 'Thiền Định Tĩnh Tâm', 
    description: 'Ngồi thiền để tĩnh tâm',
    type: 'repeatable',
    duration: 300_000,
    rewards: { qi: 500, spiritStones: 100 }
  },
  { 
    key: 'patrol_sect', 
    name: 'Tuần Tra Tông Môn', 
    description: 'Tuần tra và bảo vệ tông môn',
    type: 'repeatable',
    duration: 240_000,
    rewards: { spiritStones: 120, herbs: 8 },
    requirements: { minRealm: 'Trúc Cơ' }
  }
]

const SECRET_REALMS_DATA = {
  misty_forest: {
    key: 'misty_forest',
    name: 'Mê Lâm Sơn',
    description: 'Khu rừng sương mù bao phủ, ẩn chứa nhiều linh dược quý hiếm',
    tier: 'common',
    duration: 120,
    ticketCost: 1,
    requirements: { minRealm: 'Luyện Khí', minQi: 0 },
    lootTable: [
      { itemName: 'Thảo Dược Thường', itemType: 'material', dropRate: 0.8, quantity: { min: 2, max: 5 } },
      { itemName: 'Linh Thạch', itemType: 'material', dropRate: 0.5, quantity: { min: 5, max: 10 } }
    ],
    rewards: { qi: { min: 50, max: 100 }, spiritStones: { min: 10, max: 30 }, herbs: { min: 3, max: 8 } }
  },
  crystal_cave: {
    key: 'crystal_cave',
    name: 'Thủy Tinh Động',
    description: 'Hang động ngập tràn tinh thạch phát sáng, nguồn linh khí dồi dào',
    tier: 'rare',
    duration: 180,
    ticketCost: 1,
    requirements: { minRealm: 'Trúc Cơ', minQi: 500 },
    lootTable: [
      { itemName: 'Tinh Thạch Cấp 1', itemType: 'material', dropRate: 0.6, quantity: { min: 1, max: 3 } },
      { itemName: 'Kiếm Thủy Tinh', itemType: 'equipment', dropRate: 0.2, quantity: { min: 1, max: 1 } }
    ],
    rewards: { qi: { min: 150, max: 300 }, spiritStones: { min: 50, max: 100 }, herbs: { min: 5, max: 15 } }
  },
  ancient_ruins: {
    key: 'ancient_ruins',
    name: 'Cổ Tích Di Tích',
    description: 'Tàn tích của tông môn cổ đại, chứa đựng kho tàng và bí pháp thất truyền',
    tier: 'epic',
    duration: 240,
    ticketCost: 2,
    requirements: { minRealm: 'Kim Đan', minQi: 2000 },
    lootTable: [
      { itemName: 'Cổ Pháp Bảo', itemType: 'equipment', dropRate: 0.4, quantity: { min: 1, max: 1 } },
      { itemName: 'Đạo Ngộ Linh Thư', itemType: 'consumable', dropRate: 0.3, quantity: { min: 1, max: 2 } }
    ],
    rewards: { qi: { min: 500, max: 1000 }, spiritStones: { min: 150, max: 300 }, herbs: { min: 20, max: 50 } }
  },
  heaven_tower: {
    key: 'heaven_tower',
    name: 'Thiên Đỉnh Bảo Tháp',
    description: 'Tháp cao chọc trời, mỗi tầng là một thử thách khắc nghiệt',
    tier: 'legendary',
    duration: 300,
    ticketCost: 3,
    requirements: { minRealm: 'Nguyên Anh', minQi: 5000 },
    lootTable: [
      { itemName: 'Huyền Thiên Bảo Khí', itemType: 'equipment', dropRate: 0.5, quantity: { min: 1, max: 1 } },
      { itemName: 'Thiên Kiếp Bùa', itemType: 'consumable', dropRate: 0.6, quantity: { min: 1, max: 3 } },
      { itemName: 'Đạo Ngộ Linh Thạch', itemType: 'material', dropRate: 0.8, quantity: { min: 3, max: 10 } }
    ],
    rewards: { qi: { min: 1500, max: 3000 }, spiritStones: { min: 500, max: 1000 }, herbs: { min: 50, max: 100 } }
  },
  spirit_herb_garden: {
    key: 'spirit_herb_garden',
    name: 'Linh Dược Viên',
    description: 'Khu vườn linh dược ngàn năm, thảo dược tươi tốt quanh năm',
    tier: 'rare',
    duration: 150,
    ticketCost: 1,
    requirements: { minRealm: 'Trúc Cơ', minQi: 400 },
    lootTable: [
      { itemName: 'Thiên Niên Linh Dược', itemType: 'material', dropRate: 0.7, quantity: { min: 5, max: 15 } },
      { itemName: 'Dược Vương Hạt Giống', itemType: 'material', dropRate: 0.3, quantity: { min: 1, max: 3 } }
    ],
    rewards: { qi: { min: 100, max: 200 }, spiritStones: { min: 30, max: 80 }, herbs: { min: 10, max: 30 } }
  },
  thunder_valley: {
    key: 'thunder_valley',
    name: 'Lôi Đình Cốc',
    description: 'Thung lũng sấm sét bất tận, rèn luyện ý chí và linh khí',
    tier: 'epic',
    duration: 220,
    ticketCost: 2,
    requirements: { minRealm: 'Kim Đan', minQi: 1800 },
    lootTable: [
      { itemName: 'Lôi Tinh Thạch', itemType: 'material', dropRate: 0.6, quantity: { min: 2, max: 6 } },
      { itemName: 'Lôi Hoàng Giáp', itemType: 'equipment', dropRate: 0.3, quantity: { min: 1, max: 1 } },
      { itemName: 'Thiên Lôi Bùa', itemType: 'consumable', dropRate: 0.4, quantity: { min: 1, max: 2 } }
    ],
    rewards: { qi: { min: 400, max: 800 }, spiritStones: { min: 120, max: 250 }, herbs: { min: 15, max: 40 } }
  },
  pill_refining_ruins: {
    key: 'pill_refining_ruins',
    name: 'Luyện Đan Phế Tích',
    description: 'Di tích lò luyện đan cổ xưa, còn tồn tại dư nhiệt linh hỏa',
    tier: 'epic',
    duration: 200,
    ticketCost: 2,
    requirements: { minRealm: 'Kim Đan', minQi: 2200 },
    lootTable: [
      { itemName: 'Luyện Đan Đạo Thư', itemType: 'material', dropRate: 0.5, quantity: { min: 1, max: 2 } },
      { itemName: 'Cổ Đan Phương', itemType: 'consumable', dropRate: 0.4, quantity: { min: 1, max: 3 } },
      { itemName: 'Linh Hỏa Tinh Thạch', itemType: 'material', dropRate: 0.7, quantity: { min: 3, max: 8 } }
    ],
    rewards: { qi: { min: 600, max: 1200 }, spiritStones: { min: 180, max: 350 }, herbs: { min: 25, max: 60 } }
  },
  spirit_beast_mountain: {
    key: 'spirit_beast_mountain',
    name: 'Linh Thú Sơn',
    description: 'Ngọn núi hoang dã nơi linh thú hùng mạnh sinh sống',
    tier: 'legendary',
    duration: 280,
    ticketCost: 3,
    requirements: { minRealm: 'Nguyên Anh', minQi: 4500 },
    lootTable: [
      { itemName: 'Linh Thú Nội Đan', itemType: 'material', dropRate: 0.6, quantity: { min: 1, max: 4 } },
      { itemName: 'Huyền Thú Giáp', itemType: 'equipment', dropRate: 0.4, quantity: { min: 1, max: 1 } },
      { itemName: 'Thú Vương Ấn Ký', itemType: 'consumable', dropRate: 0.5, quantity: { min: 1, max: 2 } }
    ],
    rewards: { qi: { min: 1200, max: 2500 }, spiritStones: { min: 400, max: 900 }, herbs: { min: 40, max: 90 } }
  }
}

const REALMS = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần']

const dailyMissions = computed(() => MISSIONS.filter(m => m.type === 'daily'))
const repeatableMissions = computed(() => MISSIONS.filter(m => m.type === 'repeatable'))
const activeMissions = computed(() => player.missions || [])
const secretRealms = computed(() => Object.values(SECRET_REALMS_DATA))

const dailyResetTimer = ref('23:59:59')

const getMissionDef = (key: string) => {
  return MISSIONS.find(m => m.key === key)
}

const canAssignMission = (mission: any) => {
  if (mission.requirements?.minRealm) {
    const realmIndex = REALMS.indexOf(player.realm)
    const reqIndex = REALMS.indexOf(mission.requirements.minRealm)
    if (realmIndex < reqIndex) return false
  }
  
  // Check if mission is already active
  const alreadyActive = activeMissions.value.some((m: any) => m.key === mission.key && !m.claimed)
  if (alreadyActive) return false
  
  // Check if daily mission was already completed today
  if (mission.type === 'daily' && isCompleted(mission.key)) return false
  
  return true
}

const isCompleted = (key: string) => {
  // This would check daily completion tracking
  // For now, just return false
  return false
}

const isMissionCompleted = (mission: any) => {
  if (!mission.startedAt) return false
  const missionDef = getMissionDef(mission.key)
  if (!missionDef) return false
  
  const elapsed = Date.now() - mission.startedAt
  return elapsed >= missionDef.duration
}

const getMissionProgress = (mission: any) => {
  if (!mission.startedAt) return 0
  const missionDef = getMissionDef(mission.key)
  if (!missionDef || missionDef.duration === 0) return 100
  
  const elapsed = Date.now() - mission.startedAt
  return Math.min(100, (elapsed / missionDef.duration) * 100)
}

const formatMissionTime = (mission: any) => {
  if (isMissionCompleted(mission)) return 'Hoàn thành!'
  
  const missionDef = getMissionDef(mission.key)
  if (!missionDef || missionDef.duration === 0) return 'Kiểm tra điều kiện'
  
  const elapsed = Date.now() - mission.startedAt
  const remaining = Math.max(0, missionDef.duration - elapsed)
  
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDuration = (ms: number) => {
  if (ms === 0) return 'Tức thì'
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours} giờ ${minutes % 60} phút`
  }
  return `${minutes} phút`
}

const getTierName = (tier: string) => {
  const names: Record<string, string> = {
    common: 'Thường',
    rare: 'Hiếm',
    epic: 'Sử Thi',
    legendary: 'Huyền Thoại'
  }
  return names[tier] || tier
}

const canEnterRealm = (realm: any) => {
  // Check realm requirement
  const realmIndex = REALMS.indexOf(player.realm)
  const reqIndex = REALMS.indexOf(realm.requirements.minRealm)
  if (realmIndex < reqIndex) return false
  
  // Check Qi requirement
  if (player.qi < realm.requirements.minQi) return false
  
  // Check ticket count
  if ((player.secretRealms?.tickets || 0) < realm.ticketCost) return false
  
  return true
}

const assignMission = async (key: string) => {
  const result = await call('MISSION_ASSIGN', { key })
  if (result.success) {
    // Mission assigned, it will be in player.missions
  }
}

const claimMission = async (key: string) => {
  const result = await call('MISSION_CLAIM', { key })
  if (result.success) {
    // Rewards claimed
  }
}

const enterRealm = async (key: string) => {
  const result = await call('REALM_ENTER', { key })
  if (result.success) {
    // Entered realm, show results
  }
}

// Update daily reset timer
onMounted(() => {
  const updateTimer = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const diff = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    dailyResetTimer.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  updateTimer()
  const interval = setInterval(updateTimer, 1000)
  
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.missions-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.active-missions-card {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.05));
  border: 2px solid #dc2626;
}

.active-missions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.active-mission-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mission-name {
  font-weight: 700;
  font-size: 1.125rem;
  color: #111827;
}

.mission-timer {
  font-family: monospace;
  font-weight: 700;
  color: #dc2626;
  background: #fee2e2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.timer-completed {
  color: #059669;
  background: #d1fae5;
}

.mission-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.mission-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  min-width: 40px;
  text-align: right;
}

.missions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.daily-reset-timer {
  font-family: monospace;
  font-weight: 700;
  color: #dc2626;
  background: #fee2e2;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #dc2626;
}

.missions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.mission-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mission-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mission-badge {
  position: absolute;
  top: -10px;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid #111827;
}

.daily-badge {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.repeatable-badge {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.mission-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.mission-duration,
.mission-requirements {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.duration-icon,
.req-icon {
  font-size: 1rem;
}

.mission-rewards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.reward-icon {
  font-size: 1rem;
}

.secret-realms-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tickets-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #111827;
}

.ticket-icon {
  font-size: 1.5rem;
}

.ticket-count {
  color: #dc2626;
}

.realms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.realm-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.realm-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.tier-common {
  border-color: #6b7280;
}

.tier-rare {
  border-color: #3b82f6;
}

.tier-epic {
  border-color: #a855f7;
}

.tier-legendary {
  border-color: #f97316;
}

.realm-tier-badge {
  position: absolute;
  top: -12px;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid #111827;
}

.badge-common {
  background: #9ca3af;
  color: white;
}

.badge-rare {
  background: #3b82f6;
  color: white;
}

.badge-epic {
  background: #a855f7;
  color: white;
}

.badge-legendary {
  background: #f97316;
  color: white;
}

.realm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.realm-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.realm-duration {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.realm-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.realm-requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.realm-rewards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rewards-title,
.loot-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
}

.rewards-list,
.loot-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reward-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.realm-loot {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(220, 38, 38, 0.02));
  border-radius: 0.375rem;
  border: 1px solid #fecaca;
}

.loot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.loot-name {
  font-weight: 600;
  color: #111827;
}

.loot-rate {
  font-weight: 700;
  color: #059669;
}
</style>
