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
  | 'metal_mastery' | 'wood_harmony' | 'water_flow' | 'fire_burst' | 'earth_shield'
  | 'sword_saint' | 'pill_refining' | 'titan_body' | 'elemental_fusion'
  | 'void_step' | 'dao_heart' | 'cosmic_breath' | 'immortal_foundation'

export interface TechniqueDef {
  id: TechniqueId
  name: string
  type: TechniqueType
  element?: Element // preferred element for bonuses
  effect: {
    rateMult?: number // multiplicative to base rate
    rateAdd?: number // additive to base rate
  }
  cost: {
    spiritStones?: number
    herbs?: number
  }
  requires?: TechniqueId[]
  minRealm?: string // realm requirement
  minRealmMinor?: number // minor level requirement
}

export const TECHNIQUES: TechniqueDef[] = [
  // Tier 1 - Luyện Khí (Free/Basic)
  { id: 'basic', name: 'Cơ Bản Công', type: 'active', effect: { rateMult: 1.0 }, cost: {}, minRealm: 'Luyện Khí' },
  { id: 'calm_mind', name: 'Tĩnh Tâm Quyết', type: 'passive', effect: { rateAdd: 0.3 }, cost: { spiritStones: 35 }, minRealm: 'Luyện Khí' },
  { id: 'iron_body', name: 'Thiết Bì Thuật', type: 'passive', effect: { rateAdd: 0.2 }, cost: { spiritStones: 25 }, minRealm: 'Luyện Khí' },
  
  // Tier 2 - Luyện Khí (Unlockable at minor 5+)
  { id: 'sword_form', name: 'Ngự Kiếm Quyết', type: 'active', element: 'metal', effect: { rateMult: 1.2 }, cost: { spiritStones: 50 }, minRealm: 'Luyện Khí', minRealmMinor: 5 },
  { id: 'alchemy_flame', name: 'Đan Hỏa Quyết', type: 'active', element: 'fire', effect: { rateMult: 1.15 }, cost: { spiritStones: 40 }, minRealm: 'Luyện Khí', minRealmMinor: 5 },
  { id: 'body_forge', name: 'Bàn Cổ Thể', type: 'active', element: 'earth', effect: { rateMult: 1.1 }, cost: { spiritStones: 30 }, minRealm: 'Luyện Khí', minRealmMinor: 5 },
  { id: 'elemental_flow', name: 'Ngũ Hành Lưu', type: 'passive', effect: { rateMult: 1.1 }, cost: { spiritStones: 60 }, minRealm: 'Luyện Khí', minRealmMinor: 7 },
  
  // Tier 3 - Trúc Cơ (Element Mastery)
  { id: 'metal_mastery', name: 'Kim Hành Chân Quyết', type: 'active', element: 'metal', effect: { rateMult: 1.35, rateAdd: 1.0 }, cost: { spiritStones: 200, herbs: 10 }, minRealm: 'Trúc Cơ', requires: ['sword_form'] },
  { id: 'wood_harmony', name: 'Mộc Hành Hòa Quyết', type: 'active', element: 'wood', effect: { rateMult: 1.3, rateAdd: 1.2 }, cost: { spiritStones: 180, herbs: 10 }, minRealm: 'Trúc Cơ' },
  { id: 'water_flow', name: 'Thủy Hành Lưu Quyết', type: 'active', element: 'water', effect: { rateMult: 1.32, rateAdd: 1.1 }, cost: { spiritStones: 190, herbs: 10 }, minRealm: 'Trúc Cơ' },
  { id: 'fire_burst', name: 'Hỏa Hành Bộc Quyết', type: 'active', element: 'fire', effect: { rateMult: 1.4, rateAdd: 0.8 }, cost: { spiritStones: 220, herbs: 10 }, minRealm: 'Trúc Cơ', requires: ['alchemy_flame'] },
  { id: 'earth_shield', name: 'Thổ Hành Thuẫn Quyết', type: 'passive', element: 'earth', effect: { rateMult: 1.25, rateAdd: 1.5 }, cost: { spiritStones: 250, herbs: 15 }, minRealm: 'Trúc Cơ', requires: ['body_forge'] },
  
  // Tier 4 - Kim Đan (Advanced Paths)
  { id: 'sword_saint', name: 'Kiếm Thánh Tâm Pháp', type: 'active', element: 'metal', effect: { rateMult: 1.6, rateAdd: 3.0 }, cost: { spiritStones: 800, herbs: 50 }, minRealm: 'Kim Đan', requires: ['metal_mastery'] },
  { id: 'pill_refining', name: 'Đan Đạo Thông Thiên', type: 'active', element: 'fire', effect: { rateMult: 1.55, rateAdd: 3.2 }, cost: { spiritStones: 750, herbs: 50 }, minRealm: 'Kim Đan', requires: ['fire_burst'] },
  { id: 'titan_body', name: 'Bất Diệt Kim Thân', type: 'passive', element: 'earth', effect: { rateMult: 1.5, rateAdd: 4.0 }, cost: { spiritStones: 900, herbs: 60 }, minRealm: 'Kim Đan', requires: ['earth_shield'] },
  { id: 'elemental_fusion', name: 'Ngũ Hành Dung Hợp', type: 'passive', effect: { rateMult: 1.4, rateAdd: 2.5 }, cost: { spiritStones: 1000, herbs: 70 }, minRealm: 'Kim Đan', minRealmMinor: 5 },
  
  // Tier 5 - Nguyên Anh (Elite)
  { id: 'void_step', name: 'Hư Không Bộ Pháp', type: 'active', effect: { rateMult: 1.8, rateAdd: 5.0 }, cost: { spiritStones: 3000, herbs: 150 }, minRealm: 'Nguyên Anh' },
  { id: 'dao_heart', name: 'Đạo Tâm Vô Ngã', type: 'passive', effect: { rateMult: 1.7, rateAdd: 6.0 }, cost: { spiritStones: 3500, herbs: 200 }, minRealm: 'Nguyên Anh', minRealmMinor: 5 },
  
  // Tier 6 - Hóa Thần (Master)
  { id: 'cosmic_breath', name: 'Vũ Trụ Hồi Thiên', type: 'active', effect: { rateMult: 2.0, rateAdd: 10.0 }, cost: { spiritStones: 10000, herbs: 500 }, minRealm: 'Hóa Thần' },
  { id: 'immortal_foundation', name: 'Tiên Đạo Cơ Duyên', type: 'passive', effect: { rateMult: 1.9, rateAdd: 12.0 }, cost: { spiritStones: 12000, herbs: 600 }, minRealm: 'Hóa Thần', minRealmMinor: 5 }
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

// Realm progression helpers
export function getRealmIndex(realmMajor: string): number {
  return REALMS.indexOf(realmMajor as Realm)
}

export function canUnlockTechnique(technique: TechniqueDef, playerRealm: string, playerMinor: number, unlockedTechniques: string[]): boolean {
  // Check realm requirement
  if (technique?.minRealm) {
    const reqIndex = getRealmIndex(technique.minRealm)
    const playerIndex = getRealmIndex(playerRealm)
    if (playerIndex < reqIndex) return false
    if (playerIndex === reqIndex && technique.minRealmMinor && playerMinor < technique.minRealmMinor) return false
  }
  
  // Check prerequisite techniques
  if (technique?.requires) {
    for (const req of technique.requires) {
      if (!unlockedTechniques.includes(req)) return false
    }
  }
  
  return true
}

export function getAvailableTechniques(playerRealm: string, playerMinor: number, unlockedTechniques: string[]): TechniqueDef[] {
  return TECHNIQUES.filter(t => 
    !unlockedTechniques.includes(t.id) && 
    canUnlockTechnique(t, playerRealm, playerMinor, unlockedTechniques)
  )
}

// Equipment and Sets
export type Slot = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory' | 'talisman'

export const SET_BONUS: Record<string, { two?: { rateMult?: number }, four?: { rateMult?: number }, six?: { rateMult?: number } }> = {
  metal: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 }, six: { rateMult: 1.20 } },
  wood: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 }, six: { rateMult: 1.20 } },
  water: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 }, six: { rateMult: 1.20 } },
  fire:  { two: { rateMult: 1.05 }, four: { rateMult: 1.12 }, six: { rateMult: 1.20 } },
  earth: { two: { rateMult: 1.05 }, four: { rateMult: 1.12 }, six: { rateMult: 1.20 } }
}

// Enhancement system
export function calcEnhancementBonus(enhanceLevel: number): number {
  // Each level adds 10% to base stats
  return 1 + (enhanceLevel * 0.1)
}

export function calcEnhancementCost(currentLevel: number): number {
  // Cost increases: 100 * 1.5^level
  return Math.floor(100 * Math.pow(1.5, currentLevel))
}

export function calcEnhancementSuccessRate(currentLevel: number): number {
  // 100% success rate for +1 to +5, decreasing after
  if (currentLevel < 5) return 1.0
  if (currentLevel === 5) return 0.8
  if (currentLevel === 6) return 0.6
  if (currentLevel === 7) return 0.4
  if (currentLevel === 8) return 0.3
  if (currentLevel === 9) return 0.2
  return 1.0 // +10 is max, won't enhance further
}

export function getEquipmentSellPrice(tier: string, enhanceLevel: number = 0): number {
  const basePrices: Record<string, number> = {
    common: 20,
    rare: 100,
    epic: 500,
    legendary: 2000,
    mythic: 10000
  }
  const base = basePrices[tier] || 10
  const enhanceBonus = enhanceLevel * base * 0.5 // Each enhance level adds 50% of base
  return Math.floor(base + enhanceBonus)
}

export function calcEquipmentBonus(equipment: Array<{ item?: any } & { itemId?: any, affixes?: any[], slot?: string, enhanceLevel?: number }>) {
  let mult = 1.0
  let add = 0
  const countByElement: Record<string, number> = {}
  for (const eq of equipment || []) {
    const it: any = (eq as any).item || (eq as any).itemId || {}
    const base = it.baseEffects || it.effects || {}
    const enhanceBonus = calcEnhancementBonus((eq as any).enhanceLevel || 0)
    
    if (base.rateMult) mult *= (base.rateMult * enhanceBonus)
    if (base.rateAdd) add += (base.rateAdd * enhanceBonus)
    
    for (const af of (eq as any).affixes || []) {
      if (af.rateMult) mult *= af.rateMult
      if (af.rateAdd) add += af.rateAdd
    }
    const tag = it.elementTag || 'none'
    countByElement[tag] = (countByElement[tag] || 0) + 1
  }
  // set bonus: count same element 2, 4, or 6
  for (const [el, cnt] of Object.entries(countByElement)) {
    if (!SET_BONUS[el]) continue
    if (cnt >= 2) mult *= (SET_BONUS[el].two?.rateMult || 1)
    if (cnt >= 4) mult *= (SET_BONUS[el].four?.rateMult || 1)
    if (cnt >= 6) mult *= (SET_BONUS[el].six?.rateMult || 1)
  }
  return { mult, add }
}

// Shop catalog - Expanded to 38+ items across 5 tiers with 6 equipment slots
export const SHOP_CATALOG: Array<{ key: string, name: string, item: any, basePrice: number, tier: number, minRealm?: string }> = [
  // Tier 1 - Luyện Khí (Common)
  { key: 'iron_sword', name: 'Kiếm Sắt', item: { type: 'equipment', slot: 'weapon', elementTag: 'metal', tier: 'common', baseEffects: { rateAdd: 0.5 } }, basePrice: 100, tier: 1 },
  { key: 'iron_armor', name: 'Giáp Sắt', item: { type: 'equipment', slot: 'armor', elementTag: 'metal', tier: 'common', baseEffects: { rateMult: 1.02 } }, basePrice: 120, tier: 1 },
  { key: 'iron_helmet', name: 'Mũ Sắt', item: { type: 'equipment', slot: 'helmet', elementTag: 'metal', tier: 'common', baseEffects: { rateAdd: 0.2 } }, basePrice: 80, tier: 1 },
  { key: 'iron_boots', name: 'Hài Sắt', item: { type: 'equipment', slot: 'boots', elementTag: 'metal', tier: 'common', baseEffects: { rateAdd: 0.2 } }, basePrice: 80, tier: 1 },
  { key: 'wooden_staff', name: 'Trượng Gỗ', item: { type: 'equipment', slot: 'weapon', elementTag: 'wood', tier: 'common', baseEffects: { rateAdd: 0.4 } }, basePrice: 90, tier: 1 },
  { key: 'cloth_robe', name: 'Bào Y Vải', item: { type: 'equipment', slot: 'armor', elementTag: 'wood', tier: 'common', baseEffects: { rateMult: 1.01 } }, basePrice: 100, tier: 1 },
  { key: 'jade_pendant', name: 'Bội Ngọc Bích', item: { type: 'equipment', slot: 'accessory', elementTag: 'water', tier: 'common', baseEffects: { rateAdd: 0.3 } }, basePrice: 80, tier: 1 },
  { key: 'basic_talisman', name: 'Bùa Cơ Bản', item: { type: 'equipment', slot: 'talisman', elementTag: 'earth', tier: 'common', baseEffects: { rateMult: 1.01 } }, basePrice: 70, tier: 1 },
  { key: 'herb_bundle', name: 'Bó Thảo Dược', item: { type: 'material', isStackable: true }, basePrice: 20, tier: 1 },
  { key: 'spirit_water', name: 'Linh Thủy', item: { type: 'material', isStackable: true }, basePrice: 30, tier: 1 },
  
  // Tier 2 - Trúc Cơ (Rare)
  { key: 'steel_blade', name: 'Kiếm Thép', item: { type: 'equipment', slot: 'weapon', elementTag: 'metal', tier: 'rare', baseEffects: { rateAdd: 1.5, rateMult: 1.05 } }, basePrice: 500, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'steel_armor', name: 'Giáp Thép', item: { type: 'equipment', slot: 'armor', elementTag: 'metal', tier: 'rare', baseEffects: { rateMult: 1.08 } }, basePrice: 600, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'steel_helmet', name: 'Mũ Thép', item: { type: 'equipment', slot: 'helmet', elementTag: 'metal', tier: 'rare', baseEffects: { rateAdd: 0.6 } }, basePrice: 450, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'steel_boots', name: 'Hài Thép', item: { type: 'equipment', slot: 'boots', elementTag: 'metal', tier: 'rare', baseEffects: { rateAdd: 0.6 } }, basePrice: 450, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'fire_wand', name: 'Trượng Hỏa', item: { type: 'equipment', slot: 'weapon', elementTag: 'fire', tier: 'rare', baseEffects: { rateAdd: 1.2, rateMult: 1.04 } }, basePrice: 480, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'water_robe', name: 'Bào Thủy', item: { type: 'equipment', slot: 'armor', elementTag: 'water', tier: 'rare', baseEffects: { rateMult: 1.07 } }, basePrice: 550, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'spirit_ring', name: 'Linh Nhẫn', item: { type: 'equipment', slot: 'accessory', elementTag: 'none', tier: 'rare', baseEffects: { rateAdd: 0.8 } }, basePrice: 400, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'protection_charm', name: 'Hộ Thân Bùa', item: { type: 'equipment', slot: 'talisman', elementTag: 'earth', tier: 'rare', baseEffects: { rateMult: 1.05 } }, basePrice: 450, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'qi_pill_recipe', name: 'Phương Linh Đan', item: { type: 'recipe', isStackable: false }, basePrice: 300, tier: 2, minRealm: 'Trúc Cơ' },
  { key: 'rare_herb', name: 'Linh Dược Quý', item: { type: 'material', isStackable: true }, basePrice: 100, tier: 2, minRealm: 'Trúc Cơ' },
  
  // Tier 3 - Kim Đan (Epic)
  { key: 'profound_sword', name: 'Huyền Thiên Kiếm', item: { type: 'equipment', slot: 'weapon', elementTag: 'metal', tier: 'epic', baseEffects: { rateAdd: 3.0, rateMult: 1.10 } }, basePrice: 2000, tier: 3, minRealm: 'Kim Đan' },
  { key: 'dragon_scale_armor', name: 'Giáp Long Lân', item: { type: 'equipment', slot: 'armor', elementTag: 'earth', tier: 'epic', baseEffects: { rateMult: 1.15 } }, basePrice: 2500, tier: 3, minRealm: 'Kim Đan' },
  { key: 'phoenix_staff', name: 'Phượng Hoàng Trượng', item: { type: 'equipment', slot: 'weapon', elementTag: 'fire', tier: 'epic', baseEffects: { rateAdd: 2.5, rateMult: 1.08 } }, basePrice: 1900, tier: 3, minRealm: 'Kim Đan' },
  { key: 'mystic_robe', name: 'Huyền Y', item: { type: 'equipment', slot: 'armor', elementTag: 'water', tier: 'epic', baseEffects: { rateMult: 1.12 } }, basePrice: 2200, tier: 3, minRealm: 'Kim Đan' },
  { key: 'dao_amulet', name: 'Đạo Bội', item: { type: 'equipment', slot: 'accessory', elementTag: 'none', tier: 'epic', baseEffects: { rateAdd: 2.0 } }, basePrice: 1800, tier: 3, minRealm: 'Kim Đan' },
  { key: 'heaven_talisman', name: 'Thiên Cơ Bùa', item: { type: 'equipment', slot: 'talisman', elementTag: 'none', tier: 'epic', baseEffects: { rateMult: 1.10 } }, basePrice: 2000, tier: 3, minRealm: 'Kim Đan' },
  { key: 'alchemy_cauldron', name: 'Luyện Đan Lư', item: { type: 'tool', isStackable: false }, basePrice: 1500, tier: 3, minRealm: 'Kim Đan' },
  { key: 'enlightenment_pill', name: 'Ngộ Đạo Đan', item: { type: 'consumable', isStackable: true }, basePrice: 500, tier: 3, minRealm: 'Kim Đan' },
  
  // Tier 4 - Nguyên Anh (Legendary)
  { key: 'immortal_blade', name: 'Tiên Kiếm', item: { type: 'equipment', slot: 'weapon', elementTag: 'metal', tier: 'legendary', baseEffects: { rateAdd: 6.0, rateMult: 1.20 } }, basePrice: 8000, tier: 4, minRealm: 'Nguyên Anh' },
  { key: 'celestial_armor', name: 'Thiên Giáp', item: { type: 'equipment', slot: 'armor', elementTag: 'none', tier: 'legendary', baseEffects: { rateMult: 1.25 } }, basePrice: 10000, tier: 4, minRealm: 'Nguyên Anh' },
  { key: 'void_ring', name: 'Hư Không Nhẫn', item: { type: 'equipment', slot: 'accessory', elementTag: 'none', tier: 'legendary', baseEffects: { rateAdd: 4.0, rateMult: 1.10 } }, basePrice: 7000, tier: 4, minRealm: 'Nguyên Anh' },
  { key: 'tribulation_charm', name: 'Thiên Kiếp Bùa', item: { type: 'equipment', slot: 'talisman', elementTag: 'none', tier: 'legendary', baseEffects: { rateMult: 1.20 } }, basePrice: 8500, tier: 4, minRealm: 'Nguyên Anh' },
  { key: 'artifact_fragment', name: 'Thần Khí Mảnh', item: { type: 'material', isStackable: true }, basePrice: 1000, tier: 4, minRealm: 'Nguyên Anh' },
  { key: 'rebirth_token', name: 'Tái Sinh Bài', item: { type: 'consumable', isStackable: true }, basePrice: 3000, tier: 4, minRealm: 'Nguyên Anh' },
  
  // Tier 5 - Hóa Thần (Mythic)
  { key: 'chaos_sword', name: 'Hỗn Nguyên Kiếm', item: { type: 'equipment', slot: 'weapon', elementTag: 'none', tier: 'mythic', baseEffects: { rateAdd: 10.0, rateMult: 1.30 } }, basePrice: 30000, tier: 5, minRealm: 'Hóa Thần' },
  { key: 'primordial_robe', name: 'Thái Sơ Y', item: { type: 'equipment', slot: 'armor', elementTag: 'none', tier: 'mythic', baseEffects: { rateMult: 1.35 } }, basePrice: 35000, tier: 5, minRealm: 'Hóa Thần' },
  { key: 'dao_heart_crystal', name: 'Đạo Tâm Tinh', item: { type: 'equipment', slot: 'accessory', elementTag: 'none', tier: 'mythic', baseEffects: { rateAdd: 8.0, rateMult: 1.15 } }, basePrice: 28000, tier: 5, minRealm: 'Hóa Thần' },
  { key: 'cosmic_seal', name: 'Vũ Trụ Ấn', item: { type: 'equipment', slot: 'talisman', elementTag: 'none', tier: 'mythic', baseEffects: { rateMult: 1.30 } }, basePrice: 32000, tier: 5, minRealm: 'Hóa Thần' },
  { key: 'ascension_crystal', name: 'Thăng Thiên Tinh', item: { type: 'material', isStackable: true }, basePrice: 5000, tier: 5, minRealm: 'Hóa Thần' }
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

// World 3.0: Secret Realms Config
export type RealmTier = 'common' | 'rare' | 'epic' | 'legendary'

export interface SecretRealmConfig {
  key: string
  name: string
  description: string
  tier: RealmTier
  duration: number // seconds
  ticketCost: number
  requirements: {
    minRealm: string
    minQi: number
  }
  lootTable: Array<{
    itemName: string
    itemType: 'equipment' | 'material' | 'consumable'
    dropRate: number
    quantity: { min: number; max: number }
  }>
  rewards: {
    qi: { min: number; max: number }
    spiritStones: { min: number; max: number }
    herbs: { min: number; max: number }
  }
}

export const SECRET_REALMS: Record<string, SecretRealmConfig> = {
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

// Endgame 4.0: Ascension System
export interface AscensionPerkDef {
  id: string
  name: string
  description: string
  cost: number // ascension points
  maxLevel: number
  effect: {
    qiMultPerLevel?: number
    spiritStonesMultPerLevel?: number
    dropRateMultPerLevel?: number
    ticketBonusPerLevel?: number
    startingQiPerLevel?: number
  }
}

export const ASCENSION_PERKS: Record<string, AscensionPerkDef> = {
  eternal_qi: {
    id: 'eternal_qi',
    name: 'Vĩnh Hằng Linh Khí',
    description: 'Mỗi cấp tăng 10% tốc độ tu luyện vĩnh viễn',
    cost: 1,
    maxLevel: 10,
    effect: { qiMultPerLevel: 0.1 }
  },
  treasure_hunter: {
    id: 'treasure_hunter',
    name: 'Thám Bảo Cao Thủ',
    description: 'Tăng 5% tỷ lệ rơi vật phẩm mỗi cấp',
    cost: 2,
    maxLevel: 5,
    effect: { dropRateMultPerLevel: 0.05 }
  },
  wealthy_cultivator: {
    id: 'wealthy_cultivator',
    name: 'Phú Quý Tu Sĩ',
    description: 'Tăng 15% Linh Thạch thu được mỗi cấp',
    cost: 1,
    maxLevel: 8,
    effect: { spiritStonesMultPerLevel: 0.15 }
  },
  realm_master: {
    id: 'realm_master',
    name: 'Mật Cảnh Chuyên Gia',
    description: 'Thêm 1 vé Mật Cảnh mỗi ngày (mỗi cấp)',
    cost: 3,
    maxLevel: 3,
    effect: { ticketBonusPerLevel: 1 }
  },
  reincarnation_qi: {
    id: 'reincarnation_qi',
    name: 'Luân Hồi Đạo Tâm',
    description: 'Bắt đầu với 100 Qi mỗi lần Thăng Thiên (mỗi cấp)',
    cost: 2,
    maxLevel: 5,
    effect: { startingQiPerLevel: 100 }
  }
}

export function calcAscensionCost(currentAscensions: number): number {
  // Cost increases: 10000 * 1.5^n
  return Math.floor(10000 * Math.pow(1.5, currentAscensions))
}

// Mission System
export interface MissionDef {
  key: string
  name: string
  description: string
  type: 'daily' | 'repeatable'
  duration: number // milliseconds
  rewards: {
    qi?: number
    spiritStones?: number
    herbs?: number
  }
  requirements?: {
    minRealm?: string
  }
}

export const MISSIONS: MissionDef[] = [
  // Daily Missions (reset every 24h)
  { 
    key: 'daily_cultivate', 
    name: 'Tu Luyện Tinh Tấn', 
    description: 'Tu luyện trong 1 giờ',
    type: 'daily',
    duration: 3600_000, // 1 hour
    rewards: { spiritStones: 100, herbs: 10 }
  },
  { 
    key: 'daily_breakthrough', 
    name: 'Đột Phá Tiến Bộ', 
    description: 'Hoàn thành 1 đột phá',
    type: 'daily',
    duration: 0, // instant check
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
  
  // Repeatable Missions (can do multiple times)
  { 
    key: 'gather_herbs', 
    name: 'Thu Thập Thảo Dược', 
    description: 'Đi thu thập thảo dược trong rừng',
    type: 'repeatable',
    duration: 60_000, // 1 min
    rewards: { herbs: 5 }
  },
  { 
    key: 'guard_gate', 
    name: 'Canh Gác Sơn Môn', 
    description: 'Canh giữ cổng sơn môn',
    type: 'repeatable',
    duration: 120_000, // 2 min
    rewards: { spiritStones: 50 }
  },
  { 
    key: 'refine_pills', 
    name: 'Luyện Đan Dược', 
    description: 'Luyện chế đan dược',
    type: 'repeatable',
    duration: 180_000, // 3 min
    rewards: { spiritStones: 80, herbs: 3 },
    requirements: { minRealm: 'Kim Đan' }
  },
  { 
    key: 'meditate', 
    name: 'Thiền Định Tĩnh Tâm', 
    description: 'Ngồi thiền để tĩnh tâm',
    type: 'repeatable',
    duration: 300_000, // 5 min
    rewards: { qi: 500, spiritStones: 100 }
  },
  { 
    key: 'patrol_sect', 
    name: 'Tuần Tra Tông Môn', 
    description: 'Tuần tra và bảo vệ tông môn',
    type: 'repeatable',
    duration: 240_000, // 4 min
    rewards: { spiritStones: 120, herbs: 8 },
    requirements: { minRealm: 'Trúc Cơ' }
  }
]

export const MISSION_MAP: Record<string, MissionDef> = MISSIONS.reduce((acc, m) => {
  acc[m.key] = m
  return acc
}, {} as Record<string, MissionDef>)

// Seasons/Ladders System
export interface SeasonDef {
  id: string
  name: string
  startDate: number // timestamp
  endDate: number // timestamp
  theme: string
  bonuses: {
    qiMult?: number
    stoneMult?: number
    specialEvent?: string
  }
}

export const CURRENT_SEASON: SeasonDef = {
  id: 'season_1',
  name: 'Mùa Khai Thiên',
  startDate: Date.UTC(2024, 0, 1), // Jan 1, 2024
  endDate: Date.UTC(2024, 11, 31), // Dec 31, 2024
  theme: 'Khởi đầu hành trình tu tiên, tất cả đều là khởi điểm',
  bonuses: {
    qiMult: 1.0,
    stoneMult: 1.0
  }
}

// Leaderboard tracking (server-side will track top players)
export interface LeaderboardEntry {
  playerId: string
  playerName: string
  realm: string
  qi: number
  ascensionLevel: number
  seasonPoints: number // calculated from various achievements
  rank: number
}

export function calcSeasonPoints(player: any): number {
  // Season points = weighted sum of progress metrics
  const realmIndex = REALMS.indexOf(player.realm?.major || 'Luyện Khí')
  const realmPoints = realmIndex * 1000 + (player.realm?.minor || 0) * 100
  const qiPoints = Math.floor((player.attributes?.qi || 0) / 100)
  const ascensionPoints = (player.ascension?.level || 0) * 5000
  const contributionPoints = (player.sect?.contribution || 0)
  
  return realmPoints + qiPoints + ascensionPoints + contributionPoints
}

// Achievement & Title System
export interface AchievementDef {
  id: string
  name: string
  description: string
  category: 'realm' | 'cultivation' | 'combat' | 'collection' | 'secret'
  requirement: {
    type: 'realm' | 'qi' | 'technique' | 'equipment' | 'ascension' | 'contribution' | 'mission'
    value: number | string
  }
  reward: {
    title?: string
    bonus?: {
      qiMult?: number
      stoneMult?: number
      contributionMult?: number
    }
  }
}

export const ACHIEVEMENTS: AchievementDef[] = [
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
  
  // Cultivation Achievements
  { 
    id: 'ach_qi_master', 
    name: 'Linh Khí Đại Sư', 
    description: 'Tích lũy 100,000 Qi',
    category: 'cultivation',
    requirement: { type: 'qi', value: 100000 },
    reward: { title: 'Linh Khí Đại Sư', bonus: { qiMult: 1.02 } }
  },
  { 
    id: 'ach_tech_collector', 
    name: 'Kỹ Thuật Thu Thập Gia', 
    description: 'Mở khóa 10 kỹ thuật',
    category: 'collection',
    requirement: { type: 'technique', value: 10 },
    reward: { title: 'Bách Nghệ Tinh Thông' }
  },
  { 
    id: 'ach_ascend_once', 
    name: 'Thăng Thiên Giả', 
    description: 'Hoàn thành 1 lần Thăng Thiên',
    category: 'secret',
    requirement: { type: 'ascension', value: 1 },
    reward: { title: 'Luân Hồi Giả', bonus: { qiMult: 1.05, stoneMult: 1.05 } }
  },
  { 
    id: 'ach_sect_elder', 
    name: 'Tông Môn Trưởng Lão', 
    description: 'Đạt chức vị Trưởng Lão',
    category: 'collection',
    requirement: { type: 'contribution', value: 2000 },
    reward: { title: 'Trưởng Lão', bonus: { contributionMult: 1.1 } }
  },
  { 
    id: 'ach_mission_veteran', 
    name: 'Nhiệm Vụ Lão Luyện', 
    description: 'Hoàn thành 50 nhiệm vụ',
    category: 'collection',
    requirement: { type: 'mission', value: 50 },
    reward: { title: 'Lão Luyện Giả', bonus: { stoneMult: 1.05 } }
  }
]

export const ACHIEVEMENT_MAP = ACHIEVEMENTS.reduce((acc, a) => {
  acc[a.id] = a
  return acc
}, {} as Record<string, AchievementDef>)

export function checkAchievement(player: any, achievement: AchievementDef): boolean {
  const { type, value } = achievement.requirement
  
  switch (type) {
    case 'realm':
      const realmIndex = REALMS.indexOf(player.realm?.major || 'Luyện Khí')
      const reqIndex = REALMS.indexOf(value as any)
      return realmIndex >= reqIndex
    case 'qi':
      return (player.attributes?.qi || 0) >= (value as number)
    case 'technique':
      return (player.techniques?.unlocked?.length || 0) >= (value as number)
    case 'ascension':
      return (player.ascension?.level || 0) >= (value as number)
    case 'contribution':
      return (player.sect?.contribution || 0) >= (value as number)
    case 'mission':
      // Track completed missions count in new field
      return (player.stats?.missionsCompleted || 0) >= (value as number)
    default:
      return false
  }
}

// Sect System
export interface SectRankDef {
  name: string
  minContribution: number
  benefits: {
    qiBonus: number // multiplicative bonus to Qi rate
    shopDiscount?: number // percentage discount
    exclusive?: string[] // exclusive technique/item IDs
  }
}

export const SECT_RANKS: SectRankDef[] = [
  { 
    name: 'Ngoại Môn Đệ Tử', 
    minContribution: 0, 
    benefits: { qiBonus: 1.05 } // 5% bonus
  },
  { 
    name: 'Nội Môn Đệ Tử', 
    minContribution: 100, 
    benefits: { qiBonus: 1.10, shopDiscount: 5 } // 10% Qi, 5% shop discount
  },
  { 
    name: 'Hạch Tâm Đệ Tử', 
    minContribution: 500, 
    benefits: { qiBonus: 1.15, shopDiscount: 10 } // 15% Qi, 10% discount
  },
  { 
    name: 'Trưởng Lão', 
    minContribution: 2000, 
    benefits: { qiBonus: 1.20, shopDiscount: 15 } // 20% Qi, 15% discount
  },
  { 
    name: 'Chưởng Môn', 
    minContribution: 5000, 
    benefits: { qiBonus: 1.25, shopDiscount: 20 } // 25% Qi, 20% discount
  }
]

export function getSectRank(contribution: number): SectRankDef {
  for (let i = SECT_RANKS.length - 1; i >= 0; i--) {
    const rank = SECT_RANKS[i]
    if (rank && contribution >= rank.minContribution) {
      return rank
    }
  }
  return SECT_RANKS[0]!
}

// Sect Contribution Shop
export interface SectShopItem {
  id: string
  name: string
  cost: number // contribution points
  minRank: number // index in SECT_RANKS
  type: 'technique' | 'item' | 'boost'
  value: string | number // techniqueId, itemId, or boost value
  description: string
}

export const SECT_SHOP_ITEMS: SectShopItem[] = [
  // Techniques - High tier exclusive
  { 
    id: 'sect_tech_1', 
    name: 'Thiên Hà Kiếm Pháp', 
    cost: 800, 
    minRank: 3, 
    type: 'technique',
    value: 'celestial_sword',
    description: 'Kỹ thuật kiếm độc quyền của môn phái. +40% Qi/s'
  },
  { 
    id: 'sect_tech_2', 
    name: 'Huyền Thiên Đan Quyết', 
    cost: 800, 
    minRank: 3, 
    type: 'technique',
    value: 'mystic_alchemy',
    description: 'Bí kíp luyện đan cổ đại. +40% Qi/s'
  },
  
  // Equipment - Legendary tier
  { 
    id: 'sect_eq_1', 
    name: 'Thái Hư Kiếm', 
    cost: 500, 
    minRank: 2, 
    type: 'item',
    value: 'legendary_sword',
    description: 'Thần binh legendary tier'
  },
  { 
    id: 'sect_eq_2', 
    name: 'Huyền Thiên Giáp', 
    cost: 500, 
    minRank: 2, 
    type: 'item',
    value: 'legendary_armor',
    description: 'Bảo giáp legendary tier'
  },
  
  // Permanent boosts
  { 
    id: 'sect_boost_1', 
    name: 'Tăng Tích Lũy Công Hiến', 
    cost: 200, 
    minRank: 1, 
    type: 'boost',
    value: 1.1,
    description: 'Nhận thêm 10% công hiến từ nhiệm vụ (mua 1 lần)'
  },
  { 
    id: 'sect_boost_2', 
    name: 'Tăng Tích Lũy Linh Thạch', 
    cost: 300, 
    minRank: 2, 
    type: 'boost',
    value: 1.1,
    description: 'Nhận thêm 10% linh thạch từ nhiệm vụ (mua 1 lần)'
  }
]


