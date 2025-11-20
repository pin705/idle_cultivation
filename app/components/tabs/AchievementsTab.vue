<template>
  <div class="achievements-container">
    <!-- Header with Active Title -->
    <Card title="Danh Hiệu Hiện Tại" class="active-title-card">
      <div class="active-title-display">
        <div class="title-icon">🏆</div>
        <div class="title-info">
          <div class="title-name">{{ activeTitle || 'Chưa Có Danh Hiệu' }}</div>
          <div class="title-bonuses" v-if="activeTitleBonuses">
            <span v-if="activeTitleBonuses.qiMult" class="bonus-item">
              +{{ ((activeTitleBonuses.qiMult - 1) * 100).toFixed(0) }}% Tu Luyện
            </span>
            <span v-if="activeTitleBonuses.stoneMult" class="bonus-item">
              +{{ ((activeTitleBonuses.stoneMult - 1) * 100).toFixed(0) }}% Linh Thạch
            </span>
            <span v-if="activeTitleBonuses.contributionMult" class="bonus-item">
              +{{ ((activeTitleBonuses.contributionMult - 1) * 100).toFixed(0) }}% Contribution
            </span>
          </div>
        </div>
      </div>
    </Card>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <Button 
        v-for="cat in categories" 
        :key="cat.id"
        :variant="selectedCategory === cat.id ? 'accent' : 'secondary'"
        size="medium"
        @click="selectedCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </Button>
    </div>

    <!-- Achievements Progress Summary -->
    <Card class="progress-summary-card">
      <div class="progress-summary">
        <div class="summary-item">
          <div class="summary-label">Tổng Thành Tựu</div>
          <div class="summary-value">{{ totalAchievements }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Đã Hoàn Thành</div>
          <div class="summary-value completed">{{ completedCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Tiến Độ</div>
          <div class="summary-value">{{ completionPercentage }}%</div>
        </div>
      </div>
      <div class="overall-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: completionPercentage + '%' }"></div>
        </div>
      </div>
    </Card>

    <!-- Achievements Grid -->
    <div class="achievements-section">
      <h2>{{ getCategoryName(selectedCategory) }}</h2>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in filteredAchievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ 
            'achievement-completed': isCompleted(achievement.id),
            'achievement-locked': !isCompleted(achievement.id)
          }"
        >
          <div class="achievement-status">
            <div class="status-icon" v-if="isCompleted(achievement.id)">✅</div>
            <div class="status-icon locked" v-else>🔒</div>
          </div>
          
          <div class="achievement-header">
            <div class="achievement-name" :class="{ 'name-completed': isCompleted(achievement.id) }">
              {{ achievement.name }}
            </div>
            <div class="achievement-category-badge">
              {{ getCategoryIcon(achievement.category) }}
            </div>
          </div>
          
          <div class="achievement-description">{{ achievement.description }}</div>
          
          <!-- Progress Bar for uncompleted achievements -->
          <div v-if="!isCompleted(achievement.id)" class="achievement-progress">
            <div class="progress-label">Tiến độ: {{ getProgress(achievement) }}%</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProgress(achievement) + '%' }"></div>
            </div>
          </div>
          
          <!-- Requirement Display -->
          <div class="achievement-requirement">
            <span class="req-label">Yêu cầu:</span>
            <span class="req-value">{{ formatRequirement(achievement.requirement) }}</span>
          </div>
          
          <!-- Rewards -->
          <div class="achievement-rewards" v-if="achievement.reward">
            <div class="rewards-title">Phần Thưởng:</div>
            <div class="rewards-list">
              <div v-if="achievement.reward.title" class="reward-item title-reward">
                🏆 {{ achievement.reward.title }}
              </div>
              <div v-if="achievement.reward.bonus?.qiMult" class="reward-item">
                ⚡ +{{ ((achievement.reward.bonus.qiMult - 1) * 100).toFixed(0) }}% Tu Luyện
              </div>
              <div v-if="achievement.reward.bonus?.stoneMult" class="reward-item">
                💎 +{{ ((achievement.reward.bonus.stoneMult - 1) * 100).toFixed(0) }}% Linh Thạch
              </div>
              <div v-if="achievement.reward.bonus?.contributionMult" class="reward-item">
                🎯 +{{ ((achievement.reward.bonus.contributionMult - 1) * 100).toFixed(0) }}% Contribution
              </div>
            </div>
          </div>
          
          <!-- Equip Title Button -->
          <Button 
            v-if="isCompleted(achievement.id) && achievement.reward?.title"
            :variant="isActiveTitle(achievement.reward.title) ? 'accent' : 'primary'"
            size="sm"
            @click="equipTitle(achievement.reward.title)"
            fullWidth
          >
            {{ isActiveTitle(achievement.reward.title) ? 'Đang Dùng' : 'Trang Bị' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- All Unlocked Titles -->
    <Divider text="Tất Cả Danh Hiệu" :spacing="32" />
    
    <Card title="Danh Sách Danh Hiệu" class="titles-card">
      <div class="titles-grid">
        <div 
          v-for="title in unlockedTitles" 
          :key="title"
          class="title-item"
          :class="{ 'title-active': isActiveTitle(title) }"
          @click="equipTitle(title)"
        >
          <div class="title-icon-small">🏆</div>
          <div class="title-text">{{ title }}</div>
          <div class="title-checkmark" v-if="isActiveTitle(title)">✓</div>
        </div>
      </div>
      <div v-if="unlockedTitles.length === 0" class="empty-state">
        <p>Chưa có danh hiệu nào. Hoàn thành thành tựu để nhận danh hiệu!</p>
      </div>
    </Card>
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

const ACHIEVEMENTS = [
  // Realm Achievements
  { 
    id: 'ach_realm_foundation', 
    name: 'Trúc Cơ Thành', 
    description: 'Đạt cảnh giới Trúc Cơ',
    category: 'realm',
    requirement: { type: 'realm', value: 'Trúc Cơ' },
    reward: { title: 'Trúc Cơ Đạo Nhân' }
  },
  { 
    id: 'ach_realm_golden', 
    name: 'Kim Đan Đại Thành', 
    description: 'Đạt cảnh giới Kim Đan',
    category: 'realm',
    requirement: { type: 'realm', value: 'Kim Đan' },
    reward: { title: 'Kim Đan Chân Nhân', bonus: { qiMult: 1.05 } }
  },
  { 
    id: 'ach_realm_nascent', 
    name: 'Nguyên Anh Tôn Giả', 
    description: 'Đạt cảnh giới Nguyên Anh',
    category: 'realm',
    requirement: { type: 'realm', value: 'Nguyên Anh' },
    reward: { title: 'Nguyên Anh Tôn Giả', bonus: { qiMult: 1.1 } }
  },
  { 
    id: 'ach_realm_spirit', 
    name: 'Hóa Thần Đại Năng', 
    description: 'Đạt cảnh giới Hóa Thần',
    category: 'realm',
    requirement: { type: 'realm', value: 'Hóa Thần' },
    reward: { title: 'Hóa Thần Đại Năng', bonus: { qiMult: 1.15 } }
  },
  
  // Cultivation Achievements
  { 
    id: 'ach_qi_novice', 
    name: 'Linh Khí Sơ Học', 
    description: 'Tích lũy 1,000 Qi',
    category: 'cultivation',
    requirement: { type: 'qi', value: 1000 },
    reward: { title: 'Linh Khí Học Đồ' }
  },
  { 
    id: 'ach_qi_adept', 
    name: 'Linh Khí Tinh Thông', 
    description: 'Tích lũy 10,000 Qi',
    category: 'cultivation',
    requirement: { type: 'qi', value: 10000 },
    reward: { title: 'Linh Khí Cao Thủ' }
  },
  { 
    id: 'ach_qi_master', 
    name: 'Linh Khí Đại Sư', 
    description: 'Tích lũy 100,000 Qi',
    category: 'cultivation',
    requirement: { type: 'qi', value: 100000 },
    reward: { title: 'Linh Khí Đại Sư', bonus: { qiMult: 1.02 } }
  },
  { 
    id: 'ach_qi_grandmaster', 
    name: 'Linh Khí Tông Sư', 
    description: 'Tích lũy 1,000,000 Qi',
    category: 'cultivation',
    requirement: { type: 'qi', value: 1000000 },
    reward: { title: 'Linh Khí Tông Sư', bonus: { qiMult: 1.05 } }
  },
  
  // Combat Achievements
  { 
    id: 'ach_breakthrough_10', 
    name: 'Đột Phá Sơ Học', 
    description: 'Hoàn thành 10 đột phá',
    category: 'combat',
    requirement: { type: 'breakthrough', value: 10 },
    reward: { title: 'Đột Phá Giả' }
  },
  { 
    id: 'ach_tribulation_5', 
    name: 'Thiên Kiếp Sinh Tồn', 
    description: 'Vượt qua 5 Thiên Kiếp',
    category: 'combat',
    requirement: { type: 'tribulation', value: 5 },
    reward: { title: 'Nghịch Thiên Giả', bonus: { qiMult: 1.03 } }
  },
  
  // Collection Achievements
  { 
    id: 'ach_tech_collector', 
    name: 'Kỹ Thuật Thu Thập Gia', 
    description: 'Mở khóa 10 kỹ thuật',
    category: 'collection',
    requirement: { type: 'technique', value: 10 },
    reward: { title: 'Bách Nghệ Tinh Thông' }
  },
  { 
    id: 'ach_equipment_collector', 
    name: 'Bảo Vật Gia', 
    description: 'Sở hữu 50 trang bị',
    category: 'collection',
    requirement: { type: 'equipment', value: 50 },
    reward: { title: 'Trân Bảo Đại Sư' }
  },
  { 
    id: 'ach_sect_elder', 
    name: 'Tông Môn Trưởng Lão', 
    description: 'Đạt 2000 Contribution',
    category: 'collection',
    requirement: { type: 'contribution', value: 2000 },
    reward: { title: 'Trưởng Lão', bonus: { contributionMult: 1.1 } }
  },
  
  // Secret Achievements
  { 
    id: 'ach_ascend_once', 
    name: 'Thăng Thiên Giả', 
    description: 'Hoàn thành 1 lần Thăng Thiên',
    category: 'secret',
    requirement: { type: 'ascension', value: 1 },
    reward: { title: 'Luân Hồi Giả', bonus: { qiMult: 1.05, stoneMult: 1.05 } }
  },
  { 
    id: 'ach_ascend_10', 
    name: 'Vạn Kiếp Bất Diệt', 
    description: 'Hoàn thành 10 lần Thăng Thiên',
    category: 'secret',
    requirement: { type: 'ascension', value: 10 },
    reward: { title: 'Vĩnh Hằng Giả', bonus: { qiMult: 1.15, stoneMult: 1.1 } }
  },
  { 
    id: 'ach_mission_veteran', 
    name: 'Nhiệm Vụ Lão Luyện', 
    description: 'Hoàn thành 50 nhiệm vụ',
    category: 'secret',
    requirement: { type: 'mission', value: 50 },
    reward: { title: 'Lão Luyện Giả', bonus: { stoneMult: 1.05 } }
  }
]

const REALMS = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần']

const categories = [
  { id: 'all', name: 'Tất Cả', icon: '📋' },
  { id: 'realm', name: 'Cảnh Giới', icon: '🏔️' },
  { id: 'cultivation', name: 'Tu Luyện', icon: '⚡' },
  { id: 'combat', name: 'Chiến Đấu', icon: '⚔️' },
  { id: 'collection', name: 'Thu Thập', icon: '🎁' },
  { id: 'secret', name: 'Bí Ẩn', icon: '🔮' }
]

const selectedCategory = ref('all')

const filteredAchievements = computed(() => {
  if (selectedCategory.value === 'all') return ACHIEVEMENTS
  return ACHIEVEMENTS.filter(a => a.category === selectedCategory.value)
})

const totalAchievements = computed(() => ACHIEVEMENTS.length)

const completedCount = computed(() => {
  return ACHIEVEMENTS.filter(a => isCompleted(a.id)).length
})

const completionPercentage = computed(() => {
  return Math.floor((completedCount.value / totalAchievements.value) * 100)
})

const activeTitle = computed(() => {
  return player.title || null
})

const activeTitleBonuses = computed(() => {
  if (!activeTitle.value) return null
  
  const achievement = ACHIEVEMENTS.find(a => a.reward?.title === activeTitle.value)
  return achievement?.reward?.bonus || null
})

const unlockedTitles = computed(() => {
  return ACHIEVEMENTS
    .filter(a => isCompleted(a.id) && a.reward?.title)
    .map(a => a.reward!.title!)
})

const getCategoryName = (catId: string) => {
  return categories.find(c => c.id === catId)?.name || 'Thành Tựu'
}

const getCategoryIcon = (category: string) => {
  return categories.find(c => c.id === category)?.icon || '📋'
}

const isCompleted = (achId: string) => {
  return (player.achievements || []).includes(achId)
}

const isActiveTitle = (title: string) => {
  return player.title === title
}

const getProgress = (achievement: any) => {
  const { type, value } = achievement.requirement
  
  switch (type) {
    case 'realm':
      const currentRealm = typeof player.realm === 'string' ? player.realm : player.realm.major
      const realmIndex = REALMS.indexOf(currentRealm)
      const reqIndex = REALMS.indexOf(value)
      return Math.min(100, Math.floor((realmIndex / reqIndex) * 100))
    
    case 'qi':
      return Math.min(100, Math.floor((player.attributes.qi / value) * 100))
    
    case 'technique':
      // Check inventory for techniques or use a simpler metric
      const techCount = (player.inventory || []).filter((i: any) => i.type === 'technique').length
      return Math.min(100, Math.floor((techCount / value) * 100))
    
    case 'equipment':
      const equipCount = (player.inventory || []).filter((i: any) => i.type === 'equipment').length
      return Math.min(100, Math.floor((equipCount / value) * 100))
    
    case 'contribution':
      const contrib = player.sect?.contribution || 0
      return Math.min(100, Math.floor((contrib / value) * 100))
    
    case 'ascension':
      const ascLevel = player.ascension?.level || 0
      return Math.min(100, Math.floor((ascLevel / value) * 100))
    
    case 'breakthrough':
      // Use a default counter - ideally this would come from server
      return 0
    
    case 'tribulation':
      // Use a default counter - ideally this would come from server  
      return 0
    
    case 'mission':
      // Use missions completed
      const missionsCount = (player.missions || []).filter((m: any) => m.claimed).length
      return Math.min(100, Math.floor((missionsCount / value) * 100))
    
    default:
      return 0
  }
}

const formatRequirement = (requirement: any) => {
  const { type, value } = requirement
  
  const typeNames: Record<string, string> = {
    realm: 'Đạt cảnh giới',
    qi: 'Tích lũy',
    technique: 'Mở khóa',
    equipment: 'Sở hữu',
    contribution: 'Đạt',
    ascension: 'Thăng Thiên',
    breakthrough: 'Hoàn thành',
    tribulation: 'Vượt qua',
    mission: 'Hoàn thành'
  }
  
  const units: Record<string, string> = {
    qi: 'Qi',
    technique: 'kỹ thuật',
    equipment: 'trang bị',
    contribution: 'Contribution',
    ascension: 'lần',
    breakthrough: 'đột phá',
    tribulation: 'Thiên Kiếp',
    mission: 'nhiệm vụ'
  }
  
  if (type === 'realm') {
    return `${typeNames[type]} ${value}`
  }
  
  return `${typeNames[type]} ${value} ${units[type] || ''}`
}

const equipTitle = async (title: string) => {
  // For now just update locally - ideally call server
  // const result = await call('ACHIEVEMENT_EQUIP_TITLE', { title })
  // if (result.success) {
  //   player.title = title
  // }
  console.log('Equipping title:', title)
}
</script>

<style scoped>
.achievements-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.active-title-card {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border: 2px solid #f59e0b;
}

.active-title-display {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
}

.title-icon {
  font-size: 3rem;
}

.title-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.title-bonuses {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.bonus-item {
  font-size: 0.875rem;
  font-weight: 700;
  color: #059669;
  background: #d1fae5;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #10b981;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.progress-summary-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border: 2px solid #3b82f6;
}

.progress-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.summary-value.completed {
  color: #059669;
}

.overall-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.3s ease;
}

.achievements-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievements-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.achievement-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.achievement-completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  border-color: #10b981;
}

.achievement-locked {
  opacity: 0.7;
}

.achievement-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-icon {
  font-size: 1.5rem;
}

.status-icon.locked {
  opacity: 0.5;
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-right: 2.5rem;
}

.achievement-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #6b7280;
}

.achievement-name.name-completed {
  color: #111827;
}

.achievement-category-badge {
  font-size: 1.25rem;
}

.achievement-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.achievement-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
}

.achievement-progress .progress-bar {
  height: 8px;
}

.achievement-progress .progress-fill {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.achievement-requirement {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.req-label {
  font-weight: 600;
  color: #6b7280;
}

.req-value {
  font-weight: 700;
  color: #111827;
}

.achievement-rewards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border-radius: 0.375rem;
  border: 1px solid #fbbf24;
}

.rewards-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reward-item {
  font-size: 0.875rem;
  font-weight: 600;
  color: #059669;
}

.reward-item.title-reward {
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
}

.titles-card {
  border: 2px solid #f59e0b;
}

.titles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.title-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.title-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title-active {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
  border-color: #f59e0b;
}

.title-icon-small {
  font-size: 1.5rem;
}

.title-text {
  flex: 1;
  font-weight: 700;
  color: #111827;
}

.title-checkmark {
  font-size: 1.25rem;
  color: #10b981;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>
