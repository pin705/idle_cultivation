<template>
  <div class="ascension-container">
    <!-- Ascension Overview -->
    <div class="ascension-grid">
      <Card title="Thăng Thiên" class="ascension-card">
        <div class="ascension-info">
          <div class="ascension-level">
            <div class="level-label">Cấp Thăng Thiên</div>
            <div class="level-value">{{ player.ascension?.level || 0 }}</div>
          </div>
          
          <div class="lifetime-qi">
            <div class="qi-label">Tổng Qi Tu Luyện</div>
            <div class="qi-value">{{ formatNumber(player.ascension?.lifetimeQi || 0) }}</div>
          </div>
          
          <div class="ascension-cost">
            <div class="cost-label">Chi Phí Thăng Thiên Tiếp Theo</div>
            <div class="cost-value">
              <span class="cost-icon">⚡</span>
              {{ formatNumber(calculateAscensionCost()) }} Qi
            </div>
          </div>
        </div>
        
        <div class="ascension-description">
          <p>
            Thăng Thiên sẽ đưa bạn về thời điểm khởi đầu nhưng giữ lại các Đặc Quyền Thăng Thiên mạnh mẽ.
            Tất cả tu vi, trang bị và tài nguyên sẽ bị mất.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          size="large" 
          @click="confirmAscension"
          :disabled="!canAscend"
          fullWidth
        >
          {{ canAscend ? 'Thăng Thiên Ngay' : 'Chưa Đủ Qi' }}
        </Button>
      </Card>

      <!-- Ascension Perks -->
      <Card title="Đặc Quyền Thăng Thiên" class="perks-card">
        <div class="perks-grid">
          <div v-for="perk in ascensionPerks" :key="perk.id" class="perk-card">
            <div class="perk-header">
              <div class="perk-name">{{ perk.name }}</div>
              <div class="perk-level">Cấp {{ getPerkLevel(perk.id) }}/{{ perk.maxLevel }}</div>
            </div>
            
            <div class="perk-description">{{ perk.description }}</div>
            
            <div class="perk-effect">
              <span class="effect-label">Hiệu Ứng:</span>
              <span class="effect-value">{{ formatPerkEffect(perk) }}</span>
            </div>
            
            <div class="perk-cost">
              <span class="cost-icon">🌟</span> {{ perk.cost }} Điểm Thăng Thiên
            </div>
            
            <Button 
              variant="primary" 
              size="small" 
              @click="upgradePerk(perk.id)"
              :disabled="!canUpgradePerk(perk)"
              fullWidth
            >
              {{ getPerkLevel(perk.id) >= perk.maxLevel ? 'Đã Tối Đa' : 'Nâng Cấp' }}
            </Button>
          </div>
        </div>
        
        <div class="perk-points">
          <div class="points-available">
            Điểm Khả Dụng: <span class="points-value">{{ ascensionPoints }}</span>
          </div>
        </div>
      </Card>
    </div>

    <Divider text="Bảng Xếp Hạng Mùa" :spacing="32" />

    <!-- Season Info -->
    <Card title="Thông Tin Mùa Giải" class="season-card">
      <div class="season-info">
        <div class="season-name">{{ currentSeason.name }}</div>
        <div class="season-theme">{{ currentSeason.theme }}</div>
        <div class="season-duration">
          <span class="duration-label">Thời Gian:</span>
          <span class="duration-value">{{ formatDate(currentSeason.startDate) }} - {{ formatDate(currentSeason.endDate) }}</span>
        </div>
      </div>
    </Card>

    <!-- Leaderboard -->
    <div class="leaderboard-section">
      <div class="section-header">
        <h2>Bảng Xếp Hạng Top 100</h2>
        <div class="player-rank">
          Hạng Của Bạn: <span class="rank-value">{{ playerRank }}</span>
        </div>
      </div>

      <div class="leaderboard-table">
        <div class="table-header">
          <div class="col-rank">Hạng</div>
          <div class="col-name">Tên</div>
          <div class="col-realm">Cảnh Giới</div>
          <div class="col-ascension">Thăng Thiên</div>
          <div class="col-points">Điểm Mùa</div>
        </div>
        
        <div class="table-body">
          <div 
            v-for="entry in leaderboard" 
            :key="entry.playerId"
            class="table-row"
            :class="{ 'row-player': entry.playerId === player._id, 'row-top3': entry.rank <= 3 }"
          >
            <div class="col-rank">
              <span class="rank-badge" :class="'badge-' + getRankClass(entry.rank)">
                {{ entry.rank }}
              </span>
            </div>
            <div class="col-name">{{ entry.playerName }}</div>
            <div class="col-realm">{{ entry.realm }}</div>
            <div class="col-ascension">{{ entry.ascensionLevel }}</div>
            <div class="col-points">{{ formatNumber(entry.seasonPoints) }}</div>
          </div>
        </div>
      </div>

      <!-- Season Rewards Preview -->
      <Card title="Phần Thưởng Cuối Mùa" class="rewards-card">
        <div class="rewards-grid">
          <div class="reward-tier">
            <div class="tier-name">🥇 Top 1</div>
            <div class="tier-rewards">
              <div>🎁 Danh Hiệu: "Thiên Hạ Đệ Nhất"</div>
              <div>💎 50,000 Linh Thạch</div>
              <div>⚡ Bonus Tu Luyện: +50%</div>
            </div>
          </div>
          
          <div class="reward-tier">
            <div class="tier-name">🥈 Top 2-10</div>
            <div class="tier-rewards">
              <div>🎁 Danh Hiệu: "Thiên Kiêu"</div>
              <div>💎 25,000 Linh Thạch</div>
              <div>⚡ Bonus Tu Luyện: +25%</div>
            </div>
          </div>
          
          <div class="reward-tier">
            <div class="tier-name">🥉 Top 11-50</div>
            <div class="tier-rewards">
              <div>🎁 Danh Hiệu: "Anh Hùng"</div>
              <div>💎 10,000 Linh Thạch</div>
              <div>⚡ Bonus Tu Luyện: +10%</div>
            </div>
          </div>
          
          <div class="reward-tier">
            <div class="tier-name">🏆 Top 51-100</div>
            <div class="tier-rewards">
              <div>🎁 Danh Hiệu: "Tinh Anh"</div>
              <div>💎 5,000 Linh Thạch</div>
              <div>⚡ Bonus Tu Luyện: +5%</div>
            </div>
          </div>
        </div>
      </Card>
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

const ASCENSION_PERKS = [
  {
    id: 'eternal_qi',
    name: 'Vĩnh Hằng Linh Khí',
    description: 'Mỗi cấp tăng 10% tốc độ tu luyện vĩnh viễn',
    cost: 1,
    maxLevel: 10,
    effect: { qiMultPerLevel: 0.1 }
  },
  {
    id: 'treasure_hunter',
    name: 'Thám Bảo Cao Thủ',
    description: 'Tăng 5% tỷ lệ rơi vật phẩm mỗi cấp',
    cost: 2,
    maxLevel: 5,
    effect: { dropRateMultPerLevel: 0.05 }
  },
  {
    id: 'wealthy_cultivator',
    name: 'Phú Quý Tu Sĩ',
    description: 'Tăng 15% Linh Thạch thu được mỗi cấp',
    cost: 1,
    maxLevel: 8,
    effect: { spiritStonesMultPerLevel: 0.15 }
  },
  {
    id: 'realm_master',
    name: 'Mật Cảnh Chuyên Gia',
    description: 'Thêm 1 vé Mật Cảnh mỗi ngày (mỗi cấp)',
    cost: 3,
    maxLevel: 3,
    effect: { ticketBonusPerLevel: 1 }
  },
  {
    id: 'reincarnation_qi',
    name: 'Luân Hồi Đạo Tâm',
    description: 'Bắt đầu với 100 Qi mỗi lần Thăng Thiên (mỗi cấp)',
    cost: 2,
    maxLevel: 5,
    effect: { startingQiPerLevel: 100 }
  }
]

const currentSeason = {
  id: 'season_1',
  name: 'Mùa Khai Thiên',
  startDate: Date.UTC(2024, 0, 1),
  endDate: Date.UTC(2024, 11, 31),
  theme: 'Khởi đầu hành trình tu tiên, tất cả đều là khởi điểm',
  bonuses: {
    qiMult: 1.0,
    stoneMult: 1.0
  }
}

const ascensionPerks = ASCENSION_PERKS

const leaderboard = ref<any[]>([])
const playerRank = ref('-')

const canAscend = computed(() => {
  return player.qi >= calculateAscensionCost()
})

const ascensionPoints = computed(() => {
  return player.ascension?.points || 0
})

const calculateAscensionCost = () => {
  const currentLevel = player.ascension?.level || 0
  return Math.floor(10000 * Math.pow(1.5, currentLevel))
}

const getPerkLevel = (perkId: string) => {
  return player.ascension?.perks?.[perkId] || 0
}

const canUpgradePerk = (perk: any) => {
  const currentLevel = getPerkLevel(perk.id)
  if (currentLevel >= perk.maxLevel) return false
  if (ascensionPoints.value < perk.cost) return false
  return true
}

const formatPerkEffect = (perk: any) => {
  const currentLevel = getPerkLevel(perk.id)
  
  if (perk.effect.qiMultPerLevel) {
    return `+${((perk.effect.qiMultPerLevel * currentLevel) * 100).toFixed(0)}% Tu Luyện`
  }
  if (perk.effect.dropRateMultPerLevel) {
    return `+${((perk.effect.dropRateMultPerLevel * currentLevel) * 100).toFixed(0)}% Tỷ Lệ Rơi`
  }
  if (perk.effect.spiritStonesMultPerLevel) {
    return `+${((perk.effect.spiritStonesMultPerLevel * currentLevel) * 100).toFixed(0)}% Linh Thạch`
  }
  if (perk.effect.ticketBonusPerLevel) {
    return `+${perk.effect.ticketBonusPerLevel * currentLevel} Vé/Ngày`
  }
  if (perk.effect.startingQiPerLevel) {
    return `+${perk.effect.startingQiPerLevel * currentLevel} Qi Khởi Đầu`
  }
  
  return 'N/A'
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  if (rank <= 10) return 'top10'
  if (rank <= 50) return 'top50'
  return 'default'
}

const confirmAscension = async () => {
  // In a real app, show confirmation dialog
  const confirmed = confirm('Bạn có chắc chắn muốn Thăng Thiên? Tất cả tiến trình sẽ bị reset (trừ Đặc Quyền Thăng Thiên).')
  if (!confirmed) return
  
  const result = await call('ASCEND')
  if (result.success) {
    // Ascension complete
  }
}

const upgradePerk = async (perkId: string) => {
  const result = await call('PERK_UPGRADE', { perkId })
  if (result.success) {
    // Perk upgraded
  }
}

const loadLeaderboard = async () => {
  const result = await call('LEADERBOARD_GET') as any
  if (result.success && result.data) {
    leaderboard.value = result.data.leaderboard || []
    playerRank.value = result.data.playerRank || '-'
  }
}

onMounted(() => {
  loadLeaderboard()
})
</script>

<style scoped>
.ascension-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.ascension-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .ascension-grid {
    grid-template-columns: 1fr;
  }
}

.ascension-card {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.05));
  border: 2px solid #dc2626;
}

.ascension-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.ascension-level,
.lifetime-qi,
.ascension-cost {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.level-label,
.qi-label,
.cost-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.level-value {
  font-size: 3rem;
  font-weight: 700;
  color: #dc2626;
  font-family: 'Georgia', serif;
}

.qi-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.cost-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.cost-icon {
  font-size: 1.5rem;
}

.ascension-description {
  padding: 1rem;
  background: #fef2f2;
  border-radius: 0.5rem;
  border-left: 4px solid #dc2626;
  color: #7f1d1d;
  line-height: 1.6;
}

.perks-card {
  border: 2px solid #f59e0b;
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.perk-card {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.perk-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.perk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.perk-name {
  font-weight: 700;
  font-size: 1rem;
  color: #111827;
}

.perk-level {
  font-size: 0.875rem;
  font-weight: 700;
  color: #f59e0b;
  background: #fef3c7;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}

.perk-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.perk-effect {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.effect-label {
  font-weight: 600;
  color: #6b7280;
}

.effect-value {
  font-weight: 700;
  color: #059669;
  font-size: 1rem;
}

.perk-cost {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #f59e0b;
  padding: 0.5rem;
  background: #fef3c7;
  border-radius: 0.375rem;
}

.perk-points {
  padding: 1rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border-radius: 0.5rem;
  border: 2px solid #f59e0b;
}

.points-available {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

.points-value {
  color: #f59e0b;
  font-size: 1.5rem;
}

.season-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border: 2px solid #3b82f6;
}

.season-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.season-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
}

.season-theme {
  font-size: 1rem;
  color: #6b7280;
  font-style: italic;
}

.season-duration {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.duration-label {
  font-weight: 600;
  color: #6b7280;
}

.duration-value {
  font-weight: 700;
  color: #111827;
}

.leaderboard-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.player-rank {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.rank-value {
  color: #dc2626;
  font-size: 1.5rem;
}

.leaderboard-table {
  background: white;
  border: 2px solid #111827;
  border-radius: 0.5rem;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 150px 100px 120px;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
}

.table-header {
  background: #111827;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
}

.table-row:hover {
  background: #f9fafb;
}

.row-player {
  background: #fef2f2;
  border-left: 4px solid #dc2626;
}

.row-top3 {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  border: 2px solid #111827;
}

.badge-gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  font-size: 1.25rem;
}

.badge-silver {
  background: linear-gradient(135deg, #d1d5db, #9ca3af);
  color: white;
  font-size: 1.125rem;
}

.badge-bronze {
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: white;
  font-size: 1.125rem;
}

.badge-top10 {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
}

.badge-top50 {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  color: white;
}

.badge-default {
  background: #f3f4f6;
  color: #6b7280;
}

.col-name {
  font-weight: 700;
  color: #111827;
}

.col-realm {
  color: #6b7280;
}

.col-ascension,
.col-points {
  font-weight: 700;
  color: #111827;
}

.rewards-card {
  border: 2px solid #f59e0b;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.reward-tier {
  padding: 1rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border-radius: 0.5rem;
  border: 2px solid #111827;
}

.tier-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.tier-rewards {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.tier-rewards div {
  padding: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}
</style>
