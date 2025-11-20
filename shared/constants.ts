export const ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'] as const
export type Element = typeof ELEMENTS[number] | 'none'

export const ELEMENT_NAMES: Record<Element, string> = {
  metal: 'Kim',
  wood: 'Mộc',
  water: 'Thủy',
  fire: 'Hỏa',
  earth: 'Thổ',
  none: 'Vô'
}

// world element counters cultivation element
export const ELEMENT_COUNTERS: Record<Exclude<Element, 'none'>, Exclude<Element, 'none'>> = {
  metal: 'wood',
  wood: 'earth',
  earth: 'water',
  water: 'fire',
  fire: 'metal'
}

export function getElementMultiplier(cultivation: Element, world: Element): number {
  if (!cultivation || cultivation === 'none' || !world || world === 'none') return 1.0
  if (cultivation === world) return 2.0
  if (ELEMENT_COUNTERS[world as Exclude<Element, 'none'>] === cultivation) return 0.5
  return 1.0
}

export const REALMS = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần'] as const
export type Realm = typeof REALMS[number]

export function breakthroughCost(maxProgress: number): number {
  return maxProgress * 10
}

export const MAX_CLIENT_LOGS = 50

// Techniques
export type TechniqueType = 'active' | 'passive'
export type TechniqueId = 'basic' | 'sword_form' | 'alchemy_flame' | 'body_forge' | 'elemental_flow' | 'calm_mind' | 'iron_body'

export interface TechniqueDef {
  id: TechniqueId
  name: string
  type: TechniqueType
  effect: {
    rateMult?: number // multiplicative to base rate
    rateAdd?: number // additive to base rate
  }
  cost: {
    spiritStones?: number
    herbs?: number
  }
  requires?: TechniqueId[]
}

export const TECHNIQUES: TechniqueDef[] = [
  { id: 'basic', name: 'Cơ Bản Công', type: 'active', effect: { rateMult: 1.0 }, cost: {} },
  { id: 'sword_form', name: 'Ngự Kiếm Quyết', type: 'active', effect: { rateMult: 1.2 }, cost: { spiritStones: 50 } },
  { id: 'alchemy_flame', name: 'Đan Hỏa Quyết', type: 'active', effect: { rateMult: 1.15 }, cost: { spiritStones: 40 } },
  { id: 'body_forge', name: 'Bàn Cổ Thể', type: 'active', effect: { rateMult: 1.1 }, cost: { spiritStones: 30 } },
  { id: 'elemental_flow', name: 'Ngũ Hành Lưu', type: 'passive', effect: { rateMult: 1.1 }, cost: { spiritStones: 60 } },
  { id: 'calm_mind', name: 'Tĩnh Tâm Quyết', type: 'passive', effect: { rateAdd: 0.3 }, cost: { spiritStones: 35 } },
  { id: 'iron_body', name: 'Thiết Bì Thuật', type: 'passive', effect: { rateAdd: 0.2 }, cost: { spiritStones: 25 } }
]

export const TECHNIQUE_MAP: Record<TechniqueId, TechniqueDef> = TECHNIQUES.reduce((acc, t) => {
  acc[t.id] = t
  return acc
}, {} as Record<TechniqueId, TechniqueDef>)

export function calcTechniqueMultiplier(activeId?: string | null, passiveIds?: string[] | null) {
  let mult = 1.0
  let add = 0.0
  if (activeId && (activeId as TechniqueId) in TECHNIQUE_MAP) {
    const t = TECHNIQUE_MAP[activeId as TechniqueId]
    if (t.effect.rateMult) mult *= t.effect.rateMult
    if (t.effect.rateAdd) add += t.effect.rateAdd
  }
  for (const pid of passiveIds || []) {
    if ((pid as TechniqueId) in TECHNIQUE_MAP) {
      const t = TECHNIQUE_MAP[pid as TechniqueId]
      if (t.effect.rateMult) mult *= t.effect.rateMult
      if (t.effect.rateAdd) add += t.effect.rateAdd
    }
  }
  return { mult, add }
}

// Equipment and Sets
export type Slot = 'weapon' | 'armor' | 'accessory' | 'talisman'

export const SET_BONUS: Record<string, { two?: { rateMult?: number }, four?: { rateMult?: number } }> = {
  metal: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 } },
  wood: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 } },
  water: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 } },
  fire:  { two: { rateMult: 1.05 }, four: { rateMult: 1.12 } },
  earth: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 } }
}

export function calcEquipmentBonus(equipment: Array<{ item?: any } & { itemId?: any, affixes?: any[], slot?: string }>) {
  let mult = 1.0
  let add = 0
  const countByElement: Record<string, number> = {}
  for (const eq of equipment || []) {
    const it: any = (eq as any).item || (eq as any).itemId || {}
    const base = it.baseEffects || it.effects || {}
    if (base.rateMult) mult *= base.rateMult
    if (base.rateAdd) add += base.rateAdd
    for (const af of (eq as any).affixes || []) {
      if (af.rateMult) mult *= af.rateMult
      if (af.rateAdd) add += af.rateAdd
    }
    const tag = it.elementTag || 'none'
    countByElement[tag] = (countByElement[tag] || 0) + 1
  }
  // set bonus: count same element 2 or 4
  for (const [el, cnt] of Object.entries(countByElement)) {
    if (!SET_BONUS[el]) continue
    if (cnt >= 2) mult *= (SET_BONUS[el].two?.rateMult || 1)
    if (cnt >= 4) mult *= (SET_BONUS[el].four?.rateMult || 1)
  }
  return { mult, add }
}

// Shop catalog (simple)
export const SHOP_CATALOG: Array<{ key: string, name: string, item: any, basePrice: number }> = [
  { key: 'iron_sword', name: 'Kiếm Sắt', item: { type: 'equipment', slot: 'weapon', elementTag: 'metal', tier: 'common', baseEffects: { rateAdd: 0.5 } }, basePrice: 100 },
  { key: 'iron_armor', name: 'Giáp Sắt', item: { type: 'equipment', slot: 'armor', elementTag: 'metal', tier: 'common', baseEffects: { rateMult: 1.02 } }, basePrice: 120 },
  { key: 'herb_bundle', name: 'Bó Thảo Dược', item: { type: 'material', isStackable: true }, basePrice: 20 }
]

export function priceWithSoftCap(base: number, purchasedCount: number) {
  // 10% increase per previous purchase, capped at 2x
  return Math.min(Math.floor(base * Math.pow(1.1, purchasedCount)), base * 2)
}

// World 3.0: Dynamic World Cycles
export type WorldCycle = 'normal' | 'eclipse' | 'harmony' | 'chaos'

export interface WorldCycleDef {
  id: WorldCycle
  name: string
  duration: number // seconds
  effect: {
    qiMult?: number
    spiritStonesMult?: number
    dropRateMult?: number
  }
  rarity: number // 0-1, chance to occur
}

export const WORLD_CYCLES: Record<WorldCycle, WorldCycleDef> = {
  normal: {
    id: 'normal',
    name: 'Bình Thường',
    duration: 300, // 5 minutes
    effect: { qiMult: 1.0 },
    rarity: 0.7 // 70% chance
  },
  eclipse: {
    id: 'eclipse',
    name: 'Nhật Thực',
    duration: 120, // 2 minutes
    effect: { qiMult: 0.5, dropRateMult: 2.0 },
    rarity: 0.1 // 10% chance
  },
  harmony: {
    id: 'harmony',
    name: 'Ngũ Hành Hòa Hợp',
    duration: 180, // 3 minutes
    effect: { qiMult: 2.0, spiritStonesMult: 1.5 },
    rarity: 0.15 // 15% chance
  },
  chaos: {
    id: 'chaos',
    name: 'Hỗn Loạn Thiên Địa',
    duration: 90, // 1.5 minutes
    effect: { qiMult: 3.0, dropRateMult: 3.0 },
    rarity: 0.05 // 5% chance - very rare
  }
}

export function selectRandomCycle(): WorldCycle {
  const roll = Math.random()
  let cumulative = 0
  const cycles: WorldCycle[] = ['chaos', 'harmony', 'eclipse', 'normal']
  for (const cycle of cycles) {
    cumulative += WORLD_CYCLES[cycle].rarity
    if (roll < cumulative) return cycle
  }
  return 'normal'
}

// World 3.0: World Events
export type WorldEventType = 'meteor_shower' | 'spirit_tide' | 'cosmic_resonance'

export interface WorldEventDef {
  id: WorldEventType
  name: string
  description: string
  duration: number // seconds
  effect: {
    qiMult?: number
    qiAdd?: number
    spiritStonesReward?: number
    specialItem?: string
  }
  rarity: number // chance per hour (0-1)
}

export const WORLD_EVENTS: Record<WorldEventType, WorldEventDef> = {
  meteor_shower: {
    id: 'meteor_shower',
    name: 'Khoáng Thạch Sao Băng',
    description: 'Từ bầu trời cao rơi xuống vô số thiên thạch chứa linh khí',
    duration: 60, // 1 minute
    effect: { qiMult: 5.0, spiritStonesReward: 100 },
    rarity: 0.05 // 5% per hour
  },
  spirit_tide: {
    id: 'spirit_tide',
    name: 'Thủy Triều Linh Lực',
    description: 'Linh khí thiên địa dâng trào như sóng thủy triều',
    duration: 120, // 2 minutes
    effect: { qiMult: 3.0, qiAdd: 50 },
    rarity: 0.08 // 8% per hour
  },
  cosmic_resonance: {
    id: 'cosmic_resonance',
    name: 'Vũ Trụ Cộng Hưởng',
    description: 'Thiên địa vạn vật cộng hưởng, đại đạo hiển lộ',
    duration: 180, // 3 minutes
    effect: { qiMult: 4.0, specialItem: 'dao_insight_token' },
    rarity: 0.03 // 3% per hour
  }
}

