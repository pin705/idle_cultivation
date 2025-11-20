import { PlayerModel } from '../models/Player'
import { ItemModel } from '../models/Item'
import { UserModel } from '../models/User'
import { SnapshotModel } from '../models/Snapshot'
import { getElementMultiplier, REALMS, breakthroughCost, calcTechniqueMultiplier, TECHNIQUE_MAP, TECHNIQUES, calcEquipmentBonus, SHOP_CATALOG, priceWithSoftCap, WORLD_CYCLES, selectRandomCycle, WORLD_EVENTS, SECRET_REALMS, ASCENSION_PERKS, calcAscensionCost, canUnlockTechnique, MISSIONS, MISSION_MAP, calcEnhancementCost, calcEnhancementSuccessRate, getEquipmentSellPrice } from '../../shared/constants'
import { rateLimit } from '../utils/rateLimit'
import { SectModel } from '../models/Sect'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { type, payload } = body || {}

    const session = await getUserSession(event)

    // Some actions are allowed without session (auth)
    const allowWithoutSession = ['AUTH_LOGIN', 'AUTH_REGISTER']
    if (!session.user && !allowWithoutSession.includes(type)) {
        return { success: false, message: 'Không có phiên đăng nhập' }
    }

    let player = null as any
    if (session && (session as any).user) {
        const userId = (session as any).user.id || (session as any).user._id
        player = await PlayerModel.findOne({ userId }).populate('inventory.itemId')
    }

    let message = ''
    let log: string | undefined
    let success = true

    try {
        switch (type) {
            case 'SNAPSHOT_SAVE': {
                if (!player) return { success: false, message: 'Không có nhân vật' }
                const doc = player.toObject({ depopulate: true })
                await SnapshotModel.create({ userId: doc.userId, data: doc })
                message = 'Đã lưu ảnh chụp nhanh.'
                log = message
                break
            }
            case 'SNAPSHOT_LIST': {
                const userId = (session as any).user.id || (session as any).user._id
                const list = await SnapshotModel.find({ userId }).sort({ createdAt: -1 }).limit(10)
                return { success: true, message: 'Danh sách ảnh chụp nhanh', data: list.map(s => ({ id: s._id, createdAt: s.createdAt })) }
            }
            case 'SNAPSHOT_ROLLBACK': {
                const { id } = payload || {}
                if (!id) return { success: false, message: 'Thiếu id ảnh chụp nhanh' }
                const snap = await SnapshotModel.findById(id)
                if (!snap) return { success: false, message: 'Không tìm thấy ảnh chụp nhanh' }
                const userId = (session as any).user.id || (session as any).user._id
                if (snap.userId.toString() !== String(userId)) return { success: false, message: 'Không có quyền' }
                const data = snap.data as any
                await PlayerModel.updateOne({ userId }, { $set: data })
                const updated = await PlayerModel.findOne({ userId }).populate('inventory.itemId')
                message = 'Đã hoàn tác về ảnh chụp nhanh.'
                log = message
                return { success: true, message, player: updated, log }
            }
            case 'LOAD': {
                if (!player) return { success: false, message: 'Không tìm thấy nhân vật', notFound: true }
                return { success: true, message: 'Tải dữ liệu thành công', player }
            }

            case 'AUTH_LOGIN': {
                const { username, password } = payload || {}
                if (!username || !password) return { success: false, message: 'Thiếu đạo hiệu hoặc mật khẩu' }
                // basic rate limit per IP + action
                await rateLimit(event, 'AUTH_LOGIN', 10, 60_000)
                const user = await UserModel.findOne({ username })
                if (!user) return { success: false, message: 'Sai đạo hiệu hoặc mật khẩu' }
                const ok = await verifyPassword(password, user.password)
                if (!ok) return { success: false, message: 'Sai đạo hiệu hoặc mật khẩu' }
                await setUserSession(event, { user: { id: user._id.toString(), username: user.username } })
                return { success: true, message: 'Đăng nhập thành công', user: { id: user._id, username: user.username } }
            }

            case 'AUTH_REGISTER': {
                const { username, password } = payload || {}
                if (!username || !password) return { success: false, message: 'Thiếu đạo hiệu hoặc mật khẩu' }
                await rateLimit(event, 'AUTH_REGISTER', 5, 60_000)
                const existing = await UserModel.findOne({ username })
                if (existing) return { success: false, message: 'Đạo hiệu đã tồn tại' }
                const hash = await hashPassword(password)
                const user = await UserModel.create({ username, password: hash })
                await setUserSession(event, { user: { id: user._id.toString(), username: user.username } })
                return { success: true, message: 'Đăng ký thành công', user: { id: user._id, username: user.username } }
            }

            case 'AUTH_LOGOUT': {
                await clearUserSession(event)
                return { success: true, message: 'Đã đăng xuất' }
            }

            case 'CREATE_CHARACTER': {
                const { name, dao } = payload || {}
                if (!name || !dao) return { success: false, message: 'Thiếu tên hoặc đạo' }
                const userId = (session as any).user.id || (session as any).user._id
                const existingPlayer = await PlayerModel.findOne({ userId })
                if (existingPlayer) return { success: false, message: 'Nhân vật đã tồn tại' }

                let attributes = { qi: 10, body: 10, spirit: 10, talent: 10 }
                const cultivation: any = { activeTechnique: 'Cơ Bản Công', baseRate: 1, element: 'none' }
                switch (dao) {
                    case 'sword':
                        attributes = { qi: 15, body: 12, spirit: 8, talent: 12 }
                        cultivation.element = 'metal'; cultivation.activeTechnique = 'Ngự Kiếm Quyết'; break
                    case 'alchemy':
                        attributes = { qi: 12, body: 8, spirit: 15, talent: 10 }
                        cultivation.element = 'fire'; cultivation.activeTechnique = 'Đan Hỏa Quyết'; break
                    case 'body':
                        attributes = { qi: 8, body: 20, spirit: 5, talent: 8 }
                        cultivation.element = 'earth'; cultivation.activeTechnique = 'Bàn Cổ Thể'; break
                    case 'elementalist':
                        attributes = { qi: 12, body: 10, spirit: 12, talent: 15 }
                        cultivation.element = 'water'; cultivation.activeTechnique = 'Ngũ Hành Quyết'; break
                }
                const newPlayer = await PlayerModel.create({
                    userId,
                    name,
                    realm: { major: 'Luyện Khí', minor: 1, progress: 0, maxProgress: 100 },
                    realmPath: dao,
                    attributes,
                    resources: { spiritStones: 0, herbs: 0 },
                    cultivation,
                    inventory: [],
                    world: { element: 'metal', cycleTimer: 0, cycleDuration: 10 },
                    techniques: { unlocked: ['basic'], equippedPassives: [] },
                })
                log = `Khởi tạo nhân vật '${name}' với đạo ${dao}.`
                return { success: true, message: 'Tạo nhân vật thành công', player: newPlayer, log }
            }
            case 'SAVE':
                // Anti-cheat validation logic from save.post.ts
                const claimedQiGain = payload.qi - player.attributes.qi
                const timeDiffSeconds = (new Date().getTime() - new Date(player.updatedAt).getTime()) / 1000

                // Only validate if positive gain and significant time passed
                if (claimedQiGain > 0 && timeDiffSeconds > 1) {
                    // Calculate max possible gain based on cultivation base rate + active technique multiplier + world element multiplier
                    // This is a simplified check. For now, let's trust but verify loosely.
                    // Real implementation would replicate the client's multiplier logic here.
                    const mult = getElementMultiplier(player.cultivation.element, player.world.element)
                    const tech = calcTechniqueMultiplier(player.cultivation.activeTechnique, player.techniques?.equippedPassives || [])
                    const eq = calcEquipmentBonus(player.equipment || [])
                    const maxRate = (player.cultivation.baseRate * mult * tech.mult * eq.mult) + (tech.add || 0) + (eq.add || 0)
                    const maxPossibleGain = Math.floor(timeDiffSeconds * maxRate + 5)

                    if (claimedQiGain > maxPossibleGain) {
                        // Cap the gain
                        player.attributes.qi += maxPossibleGain
                        message = 'Phát hiện bất thường, đã điều chỉnh lại linh khí!'
                    } else {
                        player.attributes.qi = payload.qi
                        message = 'Đã lưu game'
                    }
                } else {
                    player.attributes.qi = payload.qi
                    message = 'Đã lưu game'
                }

                // Update other fields
                player.attributes.body = payload.body
                player.attributes.spirit = payload.spirit
                player.attributes.talent = payload.talent
                player.resources = payload.resources
                player.cultivation = payload.cultivation
                player.world = payload.world
                player.updatedAt = new Date()
                // Update progress bar to reflect Qi towards next realm (clamped)
                player.realm.progress = Math.min(player.attributes.qi, player.realm.maxProgress)
                log = message
                break

            case 'TICK': {
                // Server-authoritative cultivation tick
                const tickNow = new Date()
                const lastUpdate = new Date(player.updatedAt)
                const dtSeconds = (tickNow.getTime() - lastUpdate.getTime()) / 1000
                
                if (dtSeconds > 0) {
                    // Calculate qi gain with all multipliers
                    const mult = getElementMultiplier(player.cultivation.element, player.world.element)
                    const tech = calcTechniqueMultiplier(player.cultivation.activeTechnique, player.techniques?.equippedPassives || [])
                    const eq = calcEquipmentBonus(player.equipment || [])
                    
                    // World cycle multiplier
                    let cycleMult = 1.0
                    if (player.world?.currentCycle && player.world.currentCycle in WORLD_CYCLES) {
                        cycleMult = WORLD_CYCLES[player.world.currentCycle as keyof typeof WORLD_CYCLES].effect.qiMult || 1.0
                    }
                    
                    // World event multiplier
                    let eventMult = 1.0
                    let eventAdd = 0
                    if (player.world?.activeEvent?.type && player.world.activeEvent.type in WORLD_EVENTS) {
                        const now = Date.now()
                        const eventEnds = player.world.activeEvent.endsAt ? new Date(player.world.activeEvent.endsAt).getTime() : 0
                        if (now < eventEnds) {
                            const eventDef = WORLD_EVENTS[player.world.activeEvent.type as keyof typeof WORLD_EVENTS]
                            eventMult = eventDef.effect.qiMult || 1.0
                            eventAdd = eventDef.effect.qiAdd || 0
                        }
                    }
                    
                    // Ascension bonuses
                    let ascensionMult = 1.0
                    if (player.ascension?.perks) {
                        const eternalQiPerk = player.ascension.perks.find((p: any) => p.perkId === 'eternal_qi')
                        if (eternalQiPerk) {
                            ascensionMult *= (1 + 0.1 * eternalQiPerk.level)
                        }
                    }
                    
                    // Sect rank bonus
                    let sectMult = 1.0
                    if (player.sect?.contribution !== undefined) {
                        const { getSectRank } = await import('../../shared/constants')
                        const rank = getSectRank(player.sect.contribution)
                        sectMult = rank.benefits.qiBonus
                    }
                    
                    const rate = ((player.cultivation.baseRate * mult * tech.mult * eq.mult * cycleMult * eventMult * ascensionMult * sectMult) + (tech.add || 0) + (eq.add || 0) + eventAdd)
                    const qiGain = Math.floor(dtSeconds * rate)
                    
                    player.attributes.qi = (player.attributes.qi || 0) + qiGain
                    
                    // Cycle world element
                    player.world.cycleTimer = (player.world.cycleTimer || 0) + dtSeconds
                    if (player.world.cycleTimer >= (player.world.cycleDuration || 10)) {
                        player.world.cycleTimer = 0
                        const elements = ['metal', 'wood', 'water', 'fire', 'earth']
                        const currentIndex = elements.indexOf(player.world.element || 'metal')
                        const nextEl = elements[(currentIndex + 1) % elements.length]
                        player.world.element = nextEl || 'metal'
                    }
                    
                    // Update progress bar
                    player.realm.progress = Math.min(player.attributes.qi, player.realm.maxProgress)
                    player.updatedAt = tickNow
                    
                    // Log qi gain
                    if (qiGain > 0) {
                        message = `Tu luyện thu được ${qiGain} linh khí`
                        log = message
                    }
                }
                break
            }

            case 'OFFLINE_CALC': {
                const offlineNow = new Date()
                const lastSaved = new Date(player.updatedAt)
                const diffSeconds = (offlineNow.getTime() - lastSaved.getTime()) / 1000

                if (diffSeconds > 60) { // Minimum 60 seconds for offline progress
                    const baseRate = player.cultivation.baseRate
                    const tech = calcTechniqueMultiplier(player.cultivation.activeTechnique, player.techniques?.equippedPassives || [])
                    const eq = calcEquipmentBonus(player.equipment || [])
                    // Conservative world multiplier 1.0 (do not simulate world cycle), include techniques
                    const mult = 1.0
                    const offlineGain = Math.floor(diffSeconds * ((baseRate * tech.mult * eq.mult) + (tech.add || 0) + (eq.add || 0)) * mult)

                    player.attributes.qi += offlineGain
                    player.updatedAt = offlineNow
                    message = `Bạn đã bế quan ${Math.floor(diffSeconds)} giây và thu được ${offlineGain} linh khí.`
                } else {
                    message = 'Chưa đủ thời gian bế quan.'
                }
                log = message
                break
            }

            case 'BREAKTHROUGH':
                const { major, minor, progress, maxProgress } = player.realm
                const requiredQi = breakthroughCost(maxProgress)

                if (player.attributes.qi >= requiredQi) {
                    player.attributes.qi -= requiredQi

                    // Advance realm logic
                    if (progress + 10 >= maxProgress) {
                        // Minor breakthrough
                        player.realm.minor += 1
                        player.realm.progress = 0
                        player.realm.maxProgress = Math.floor(maxProgress * 1.5)
                        
                        // Track stats
                        if (!player.stats) player.stats = { missionsCompleted: 0, breakthroughsCompleted: 0, tribulationsCompleted: 0 }
                        player.stats.breakthroughsCompleted = (player.stats.breakthroughsCompleted || 0) + 1

                        // Spirit stone reward for minor breakthrough
                        const realmIndex = REALMS.indexOf(major)
                        const minorReward = 20 * (realmIndex + 1) // 20/40/60/80/100 per realm tier
                        player.resources.spiritStones += minorReward

                        // Major breakthrough check
                        if (player.realm.minor > 9) {
                            const currentIndex = REALMS.indexOf(major)
                            if (currentIndex < REALMS.length - 1) {
                                player.realm.major = REALMS[currentIndex + 1]
                                player.realm.minor = 1
                                player.realm.maxProgress *= 2
                                // Major breakthrough bonus
                                const majorReward = 100 * (currentIndex + 2) // 200/300/400/500
                                player.resources.spiritStones += majorReward
                                message = `Chúc mừng! Bạn đã đột phá lên ${player.realm.major}! +${majorReward + minorReward} Linh Thạch`
                            }
                        } else {
                            message = `Đột phá tiểu cảnh giới thành công! +${minorReward} Linh Thạch`
                        }

                        // Stat boost
                        player.attributes.body += 5
                        player.attributes.spirit += 5
                        player.attributes.talent += 1
                    } else {
                        // Just progress
                        player.realm.progress += 10
                        message = 'Tu luyện tinh tấn.'
                    }
                } else {
                    success = false
                    message = 'Không đủ linh khí để đột phá!'
                }
                log = message
                break

            case 'FIND_ITEM':
                // Create a random item if it doesn't exist
                let item = await ItemModel.findOne({ name: 'Linh Thạch' })
                if (!item) {
                    item = await ItemModel.create({
                        name: 'Linh Thạch',
                        type: 'material',
                        description: 'Đá chứa linh khí, dùng để tu luyện hoặc giao dịch.',
                        rarity: 'common'
                    })
                }

                // Add to inventory
                const existingItemIndex = player.inventory.findIndex((i: any) => i.itemId && i.itemId._id.toString() === item._id.toString())

                if (existingItemIndex >= 0) {
                    player.inventory[existingItemIndex].count += 1
                } else {
                    player.inventory.push({ itemId: item._id, count: 1 })
                }
                message = 'Nhặt được Linh Thạch!'
                log = message
                break

            // Tribulation loop
            case 'TRIB_PREPARE': {
                if (!player) return { success: false, message: 'Không có nhân vật' }
                if (player.tribulation?.active) return { success: false, message: 'Đang trong Thiên Kiếp' }
                const difficulty = Math.max(1, Math.floor((player.realm.minor + REALMS.indexOf(player.realm.major) + 1)))
                return { success: true, message: 'Chuẩn bị Thiên Kiếp', data: { difficulty, cost: { qi: difficulty * 50 } } }
            }
            case 'TRIB_START': {
                const { useTalisman } = payload || {}
                if (!player) return { success: false, message: 'Không có nhân vật' }
                const baseCost = 50
                if ((player.attributes.qi || 0) < baseCost) return { success: false, message: 'Không đủ linh khí' }
                player.attributes.qi -= baseCost
                const duration = 30_000
                player.tribulation = { active: true, difficulty: player.realm.minor, endsAt: new Date(Date.now() + duration), buff: 0 }
                if (useTalisman) {
                    // consume one talisman if exists
                    const tal = await ItemModel.findOne({ name: 'Bùa Hộ Thân', type: 'consumable' })
                    if (tal) {
                        const idx = player.inventory.findIndex((i: any) => {
                            if (!i.itemId) return false
                            const iid = (i.itemId as any)._id ? (i.itemId as any)._id.toString() : i.itemId.toString()
                            return iid === tal._id.toString()
                        })
                        if (idx >= 0) {
                            player.inventory[idx].count = (player.inventory[idx].count || 1) - 1
                            if (player.inventory[idx].count <= 0) player.inventory.splice(idx, 1)
                            player.tribulation.buff = (player.tribulation.buff || 0) + 0.2
                        }
                    }
                }
                message = 'Thiên Kiếp bắt đầu! Hãy chờ đợi kết quả.'
                log = message
                break
            }
            case 'TRIB_RESOLVE': {
                if (!player?.tribulation?.active) return { success: false, message: 'Không có Thiên Kiếp đang diễn ra' }
                const now = Date.now()
                const end = new Date(player.tribulation.endsAt || Date.now())
                if (now < end.getTime()) return { success: false, message: 'Chưa đến lúc kết thúc Thiên Kiếp' }
                const baseChance = 0.5 + ((player.attributes.spirit || 0) + (player.attributes.talent || 0)) / 200
                const buff = player.tribulation.buff || 0
                const successChance = Math.min(0.95, baseChance + buff)
                const ok = Math.random() < successChance
                player.tribulation.active = false
                
                // Track stats
                if (!player.stats) player.stats = { missionsCompleted: 0, breakthroughsCompleted: 0, tribulationsCompleted: 0 }
                if (ok) {
                    player.stats.tribulationsCompleted = (player.stats.tribulationsCompleted || 0) + 1
                }
                
                // Calculate rewards based on realm
                const realmIndex = REALMS.indexOf(player.realm.major)
                const rewardQi = 100 + Math.floor((player.realm.minor || 1) * 20)
                const spiritStoneReward = 50 + (realmIndex * 50) // 50/100/150/200/250
                const herbReward = 5 + (realmIndex * 5) // 5/10/15/20/25
                
                if (ok) {
                    player.attributes.qi = (player.attributes.qi || 0) + rewardQi
                    player.resources.spiritStones = (player.resources.spiritStones || 0) + spiritStoneReward
                    player.resources.herbs = (player.resources.herbs || 0) + herbReward
                    message = `Vượt qua Thiên Kiếp! Nhận ${rewardQi} linh khí, ${spiritStoneReward} Linh Thạch, ${herbReward} Thảo Dược.`
                } else {
                    const lost = Math.min(player.attributes.qi || 0, 50)
                    player.attributes.qi = (player.attributes.qi || 0) - lost
                    message = `Thất bại trước Thiên Kiếp! Mất ${lost} linh khí.`
                }
                log = message
                break
            }

            // Realm branch info
            case 'REALM_PATH_INFO': {
                return { success: true, data: { path: player?.realmPath || 'none' } }
            }

            // Sects
            case 'SECT_CREATE': {
                const { name } = payload || {}
                if (!name) return { success: false, message: 'Thiếu tên tông môn' }
                const exist = await SectModel.findOne({ name })
                if (exist) return { success: false, message: 'Tên đã tồn tại' }
                const sect = await SectModel.create({ name })
                player.sect = { id: sect._id as any, contribution: 0 }
                message = 'Đã lập tông môn.'
                log = message
                break
            }
            case 'SECT_JOIN': {
                const { name } = payload || {}
                const sect = await SectModel.findOne({ name })
                if (!sect) return { success: false, message: 'Không tìm thấy tông môn' }
                player.sect = { id: sect._id as any, contribution: 0 }
                message = `Gia nhập ${name}.`
                log = message
                break
            }
            case 'SECT_LEAVE': {
                if (!player.sect?.id) return { success: false, message: 'Chưa gia nhập tông môn' }
                player.sect = { id: null as any, contribution: 0 }
                message = 'Đã rời tông môn.'
                log = message
                break
            }
            case 'SECT_DONATE': {
                const { amount } = payload || {}
                if (!player.sect?.id) return { success: false, message: 'Chưa gia nhập tông môn' }
                if ((player.resources.spiritStones || 0) < (amount || 0)) return { success: false, message: 'Không đủ Linh Thạch' }
                const sect = await SectModel.findById(player.sect.id)
                if (!sect) return { success: false, message: 'Tông môn không tồn tại' }
                player.resources.spiritStones -= amount
                player.sect.contribution = (player.sect.contribution || 0) + amount
                sect.treasury.spiritStones = (sect.treasury.spiritStones || 0) + amount
                await sect.save()
                message = 'Đóng góp thành công.'
                log = message
                break
            }

            case 'SECT_SHOP_BUY': {
                const { itemId } = payload || {}
                if (!player.sect) return { success: false, message: 'Chưa gia nhập tông môn' }
                
                const { SECT_SHOP_ITEMS, getSectRank, TECHNIQUE_MAP } = await import('../../shared/constants')
                const item = SECT_SHOP_ITEMS.find(i => i.id === itemId)
                if (!item) return { success: false, message: 'Vật phẩm không tồn tại' }
                
                // Check rank requirement
                const currentRank = getSectRank(player.sect.contribution || 0)
                const currentRankIndex = (await import('../../shared/constants')).SECT_RANKS.findIndex(r => r.name === currentRank.name)
                if (currentRankIndex < item.minRank) {
                    return { success: false, message: 'Chức vị chưa đủ yêu cầu' }
                }
                
                // Check contribution cost
                if ((player.sect.contribution || 0) < item.cost) {
                    return { success: false, message: 'Không đủ công hiến' }
                }
                
                // Deduct contribution
                player.sect.contribution -= item.cost
                
                // Grant reward based on type
                if (item.type === 'technique') {
                    const techKey = item.value as string
                    if (!player.techniques?.unlocked) player.techniques = { unlocked: [], equippedPassives: [] }
                    if (!player.techniques.unlocked.includes(techKey)) {
                        player.techniques.unlocked.push(techKey)
                        message = `Đã mua kỹ thuật: ${item.name}`
                        log = message
                    } else {
                        return { success: false, message: 'Đã sở hữu kỹ thuật này' }
                    }
                } else if (item.type === 'item') {
                    // Create equipment item - lookup by key instead of id
                    const itemKey = item.value as string
                    const itemData = SHOP_CATALOG.find(s => s.key === itemKey)
                    if (!itemData) return { success: false, message: 'Vật phẩm không hợp lệ' }
                    
                    const newItem = await ItemModel.create({
                        name: itemData.name,
                        tier: itemData.tier || 'legendary',
                        slot: itemData.item?.slot || 'weapon',
                        element: itemData.item?.elementTag || 'neutral',
                        stats: itemData.item?.baseEffects || {},
                        affixes: [],
                        enhanceLevel: 0,
                        type: 'equipment'
                    })
                    player.inventory.push({ itemId: newItem._id, count: 1, uid: newItem._id.toString() })
                    message = `Đã mua: ${item.name}`
                    log = message
                } else if (item.type === 'boost') {
                    // Boost items are one-time purchases that apply permanent multipliers
                    // Track in a new field: player.sectBoosts
                    if (!player.sectBoosts) player.sectBoosts = []
                    if (player.sectBoosts.includes(itemId)) {
                        return { success: false, message: 'Đã mua boost này rồi' }
                    }
                    player.sectBoosts.push(itemId)
                    message = `Đã mua: ${item.name}`
                    log = message
                }
                
                break
            }

            // Missions
            case 'MISSION_LIST': {
                // Filter missions by realm requirements
                const playerRealmIndex = REALMS.indexOf(player.realm.major)
                const availableMissions = MISSIONS.filter(m => {
                    if (!m.requirements?.minRealm) return true
                    const reqIndex = REALMS.indexOf(m.requirements.minRealm as any)
                    return playerRealmIndex >= reqIndex
                }).map(m => ({
                    key: m.key,
                    name: m.name,
                    description: m.description,
                    type: m.type,
                    duration: m.duration,
                    rewards: m.rewards,
                    requirements: m.requirements
                }))
                return { success: true, message: 'Danh sách nhiệm vụ', data: { missions: availableMissions } }
            }
            case 'MISSION_ASSIGN': {
                const { key } = payload || {}
                const missionDef = MISSION_MAP[key]
                if (!missionDef) return { success: false, message: 'Nhiệm vụ không hợp lệ' }
                
                // Check realm requirements
                if (missionDef.requirements?.minRealm) {
                    const reqIndex = REALMS.indexOf(missionDef.requirements.minRealm as any)
                    const playerIndex = REALMS.indexOf(player.realm.major)
                    if (playerIndex < reqIndex) {
                        return { success: false, message: 'Chưa đủ cảnh giới' }
                    }
                }
                
                player.missions = player.missions || []
                player.missions.push({ 
                    key, 
                    assignedAt: new Date(), 
                    duration: missionDef.duration, 
                    reward: missionDef.rewards, 
                    claimed: false 
                })
                message = `Đã nhận nhiệm vụ: ${missionDef.name}`
                log = message
                break
            }
            case 'MISSION_CLAIM': {
                const { key } = payload || {}
                const m = (player.missions || []).find((x: any) => x.key === key && !x.claimed)
                if (!m) return { success: false, message: 'Không có nhiệm vụ để nhận' }
                const readyAt = new Date(m.assignedAt).getTime() + m.duration
                if (Date.now() < readyAt) return { success: false, message: 'Chưa hoàn thành' }
                m.claimed = true
                
                // Track stats
                if (!player.stats) player.stats = { missionsCompleted: 0, breakthroughsCompleted: 0, tribulationsCompleted: 0 }
                player.stats.missionsCompleted = (player.stats.missionsCompleted || 0) + 1
                
                // Apply sect boost multipliers
                let contributionMult = 1.0
                let stoneMult = 1.0
                if (player.sectBoosts) {
                    if (player.sectBoosts.includes('sect_boost_1')) contributionMult = 1.1
                    if (player.sectBoosts.includes('sect_boost_2')) stoneMult = 1.1
                }
                
                // Award mission contribution if in sect
                if (player.sect?.id && m.reward?.spiritStones) {
                    const contributionGain = Math.floor((m.reward.spiritStones || 0) * 0.1 * contributionMult)
                    player.sect.contribution = (player.sect.contribution || 0) + contributionGain
                }
                
                if (m.reward?.herbs) player.resources.herbs = (player.resources.herbs || 0) + m.reward.herbs
                if (m.reward?.spiritStones) {
                    const stones = Math.floor((m.reward.spiritStones || 0) * stoneMult)
                    player.resources.spiritStones = (player.resources.spiritStones || 0) + stones
                }
                if (m.reward?.qi) player.attributes.qi = (player.attributes.qi || 0) + m.reward.qi
                message = `Đã nhận thưởng nhiệm vụ: +${Math.floor((m.reward.spiritStones || 0) * stoneMult)} Linh Thạch, +${m.reward.herbs || 0} Thảo Dược, +${m.reward.qi || 0} Qi`
                log = message
                break
            }

            case 'EQUIP_ITEM': {
                const { uid, slot } = payload || {}
                if (!uid || !slot) return { success: false, message: 'Thiếu thông tin trang bị' }
                const idx = player.inventory.findIndex((i: any) => i.uid === uid)
                if (idx < 0) return { success: false, message: 'Không tìm thấy vật phẩm trong túi' }
                const inv = player.inventory[idx]
                const item = await ItemModel.findById(inv.itemId)
                if (!item || item.type !== 'equipment') return { success: false, message: 'Không phải trang bị' }
                if (String(item.slot) !== String(slot)) return { success: false, message: 'Ô trang bị không khớp' }
                player.inventory.splice(idx, 1)
                // unequip existing
                player.equipment = player.equipment || []
                const existIdx = player.equipment.findIndex((e: any) => e.slot === slot)
                if (existIdx >= 0) {
                    const old = player.equipment.splice(existIdx, 1)[0]
                    player.inventory.push({ itemId: old.itemId, count: 1, uid: `inv_${Date.now()}`, affixes: old.affixes || [] })
                }
                player.equipment.push({ slot, itemId: item._id, affixes: inv.affixes || [] })
                message = 'Đã trang bị.'
                log = message
                break
            }

            case 'UNEQUIP_ITEM': {
                const { slot } = payload || {}
                if (!slot) return { success: false, message: 'Thiếu ô trang bị' }
                const existIdx = player.equipment?.findIndex((e: any) => e.slot === slot) ?? -1
                if (existIdx < 0) return { success: false, message: 'Không có trang bị ở ô này' }
                const old = player.equipment.splice(existIdx, 1)[0]
                player.inventory.push({ itemId: old.itemId, count: 1, uid: `inv_${Date.now()}`, affixes: old.affixes || [] })
                message = 'Đã tháo trang bị.'
                log = message
                break
            }

            case 'SHOP_LIST': {
                const purchased = (player as any).shopState?.purchased || {}
                const items = await Promise.all(SHOP_CATALOG.map(async (c) => {
                    // ensure base item exists in DB
                    let item = await ItemModel.findOne({ name: c.name, slot: c.item.slot || null })
                    if (!item) {
                        item = await ItemModel.create({
                            name: c.name,
                            type: c.item.type,
                            slot: c.item.slot || null,
                            elementTag: c.item.elementTag || 'none',
                            tier: c.item.tier || 'common',
                            isStackable: !!c.item.isStackable,
                            baseEffects: c.item.baseEffects || {}
                        })
                    }
                    const count = purchased[c.key] || 0
                    const price = priceWithSoftCap(c.basePrice, count)
                    return { 
                        key: c.key, 
                        name: c.name, 
                        itemId: item._id, 
                        price, 
                        count,
                        tier: c.tier,
                        minRealm: c.minRealm 
                    }
                }))
                return { success: true, message: 'Danh sách cửa hàng', data: items }
            }

            case 'SHOP_BUY': {
                const { key, qty } = payload || {}
                const entry = SHOP_CATALOG.find((c) => c.key === key)
                if (!entry) return { success: false, message: 'Mặt hàng không tồn tại' }
                const purchased = ((player as any).shopState ||= { purchased: {} }).purchased
                const count = purchased[key] || 0
                let price = priceWithSoftCap(entry.basePrice, count)
                
                // Apply sect shop discount
                if (player.sect?.contribution !== undefined) {
                    const { getSectRank } = await import('../../shared/constants')
                    const rank = getSectRank(player.sect.contribution)
                    if (rank.benefits.shopDiscount) {
                        price = Math.floor(price * (1 - rank.benefits.shopDiscount / 100))
                    }
                }
                
                const total = price * (qty || 1)
                if ((player.resources.spiritStones || 0) < total) return { success: false, message: 'Không đủ Linh Thạch' }
                player.resources.spiritStones -= total
                purchased[key] = count + (qty || 1)
                // add to inventory
                if (entry.item.type === 'material') {
                    // find existing stack
                    const existing = player.inventory.findIndex((i: any) => String(i.itemId?.name || '') === entry.name)
                    // safer: by itemId after ensuring item fetched above; do quick fetch
                    let item = await ItemModel.findOne({ name: entry.name })
                    if (!item) item = await ItemModel.create({ name: entry.name, type: 'material', isStackable: true })
                    const idx = player.inventory.findIndex((i: any) => i.itemId && i.itemId.toString && i.itemId.toString() === item!._id.toString())
                    if (idx >= 0) player.inventory[idx].count += (qty || 1)
                    else player.inventory.push({ itemId: item!._id, count: (qty || 1) })
                } else if (entry.item.type === 'equipment') {
                    let item = await ItemModel.findOne({ name: entry.name })
                    if (!item) item = await ItemModel.create({ name: entry.name, type: 'equipment', slot: entry.item.slot, elementTag: entry.item.elementTag, baseEffects: entry.item.baseEffects })
                    for (let i = 0; i < (qty || 1); i++) {
                        player.inventory.push({ itemId: item!._id, count: 1, uid: `inv_${Date.now()}_${i}`, affixes: [] })
                    }
                }
                message = 'Mua thành công.'
                log = message
                break
            }

            case 'SHOP_SELL': {
                const { uid, qty } = payload || {}
                const idx = player.inventory.findIndex((i: any) => i.uid === uid)
                if (idx < 0) return { success: false, message: 'Không tìm thấy vật phẩm' }
                const inv = player.inventory[idx]
                const item = await ItemModel.findById(inv.itemId)
                const enhanceLevel = inv.enhanceLevel || 0
                const sellPrice = item?.type === 'equipment' 
                    ? getEquipmentSellPrice(item.tier || 'common', enhanceLevel) * (qty || 1)
                    : Math.floor(10 * (qty || 1))
                player.resources.spiritStones += sellPrice
                // remove
                if ((inv.count || 1) > (qty || 1)) inv.count -= (qty || 1)
                else player.inventory.splice(idx, 1)
                message = `Đã bán vật phẩm: +${sellPrice} Linh Thạch`
                log = message
                break
            }

            case 'ITEM_REROLL': {
                const { uid } = payload || {}
                const idx = player.inventory.findIndex((i: any) => i.uid === uid)
                if (idx < 0) return { success: false, message: 'Không tìm thấy vật phẩm' }
                const inv = player.inventory[idx]
                const item = await ItemModel.findById(inv.itemId)
                if (!item || item.type !== 'equipment') return { success: false, message: 'Chỉ tẩy luyện trang bị' }
                const cost = 30
                if ((player.resources.spiritStones || 0) < cost) return { success: false, message: 'Không đủ Linh Thạch' }
                player.resources.spiritStones -= cost
                // simple reroll: random small add or mult
                const roll = Math.random()
                const af = roll < 0.5 ? { rateAdd: +(Math.random().toFixed(2)) } : { rateMult: +(1 + Math.random() * 0.05).toFixed(3) }
                inv.affixes = [af]
                message = 'Đã tẩy luyện trang bị.'
                log = message
                break
            }

            case 'EQUIP_ENHANCE': {
                const { slot } = payload || {}
                if (!slot) return { success: false, message: 'Thiếu ô trang bị' }
                const eqIdx = player.equipment?.findIndex((e: any) => e.slot === slot) ?? -1
                if (eqIdx < 0) return { success: false, message: 'Không có trang bị ở ô này' }
                const eq = player.equipment[eqIdx]
                const currentLevel = eq.enhanceLevel || 0
                
                if (currentLevel >= 10) return { success: false, message: 'Đã đạt cấp tối đa (+10)' }
                
                const cost = calcEnhancementCost(currentLevel)
                if ((player.resources.spiritStones || 0) < cost) {
                    return { success: false, message: `Không đủ Linh Thạch (cần ${cost})` }
                }
                
                player.resources.spiritStones -= cost
                const successRate = calcEnhancementSuccessRate(currentLevel)
                const success = Math.random() < successRate
                
                if (success) {
                    eq.enhanceLevel = currentLevel + 1
                    message = `Cường hóa thành công! Trang bị +${eq.enhanceLevel}`
                } else {
                    // On failure at +6 or higher, equipment can break (downgrade 1 level)
                    if (currentLevel >= 6) {
                        eq.enhanceLevel = Math.max(0, currentLevel - 1)
                        message = `Cường hóa thất bại! Trang bị giảm xuống +${eq.enhanceLevel}`
                    } else {
                        message = `Cường hóa thất bại! Trang bị không thay đổi.`
                    }
                }
                log = message
                break
            }

            case 'TECH_UNLOCK': {
                const { id } = payload || {}
                if (!id || !(id in TECHNIQUE_MAP)) return { success: false, message: 'Kỹ thuật không hợp lệ' }
                if (!player.techniques) player.techniques = { unlocked: [], equippedPassives: [] }
                if (player.techniques.unlocked.includes(id)) return { success: false, message: 'Đã sở hữu kỹ thuật này' }
                
                const def = (TECHNIQUE_MAP as any)[id]
                
                // Check realm requirements
                if (!canUnlockTechnique(def, player.realm.major, player.realm.minor, player.techniques.unlocked)) {
                    return { success: false, message: 'Chưa đủ cảnh giới hoặc thiếu kỹ thuật tiên quyết' }
                }
                
                const costStones = def.cost.spiritStones || 0
                const costHerbs = def.cost.herbs || 0
                if ((player.resources.spiritStones || 0) < costStones || (player.resources.herbs || 0) < costHerbs) {
                    return { success: false, message: 'Không đủ tài nguyên để học kỹ thuật' }
                }
                player.resources.spiritStones -= costStones
                player.resources.herbs -= costHerbs
                player.techniques.unlocked.push(id)
                message = `Đã lĩnh ngộ ${def.name}.`
                log = message
                break
            }

            case 'TECH_EQUIP': {
                const { id, slot } = payload || {}
                if (!id || !(id in TECHNIQUE_MAP)) return { success: false, message: 'Kỹ thuật không hợp lệ' }
                if (!player.techniques || !player.techniques.unlocked?.includes(id)) return { success: false, message: 'Chưa học kỹ thuật này' }
                const def = (TECHNIQUE_MAP as any)[id]
                if (slot === 'active') {
                    if (def.type !== 'active') return { success: false, message: 'Chỉ có thể trang bị kỹ thuật chủ động ở ô chủ động' }
                    player.cultivation.activeTechnique = id
                    message = `Đã vận chuyển ${def.name}.`
                } else if (slot === 'passive') {
                    if (def.type !== 'passive') return { success: false, message: 'Chỉ có thể trang bị kỹ thuật bị động ở ô bị động' }
                    if (!player.techniques) player.techniques = { unlocked: [], equippedPassives: [] }
                    const slots = player.techniques.equippedPassives || []
                    if (!slots.includes(id)) {
                        if (slots.length >= 2) return { success: false, message: 'Đã đạt giới hạn ô bị động (2)' }
                        slots.push(id)
                    }
                    player.techniques.equippedPassives = slots
                    message = `Đã khắc sâu ${def.name}.`
                } else {
                    return { success: false, message: 'Ô trang bị không hợp lệ' }
                }
                log = message
                break
            }

            // World 3.0: World Cycle & Events
            case 'WORLD_CHECK': {
                // Check and update world cycle
                const now = Date.now()
                if (!player.world) {
                    player.world = { element: 'metal', cycleTimer: 0, cycleDuration: 10, currentCycle: 'normal', cycleEndsAt: new Date(now + 300000), activeEvent: { type: null, endsAt: null } }
                }
                
                // Check if cycle expired
                if (player.world.cycleEndsAt && now >= new Date(player.world.cycleEndsAt).getTime()) {
                    const newCycle = selectRandomCycle()
                    player.world.currentCycle = newCycle
                    player.world.cycleEndsAt = new Date(now + WORLD_CYCLES[newCycle].duration * 1000)
                    message = `Thiên địa biến hóa: ${WORLD_CYCLES[newCycle].name}!`
                    log = message
                }
                
                // Check for random world event (5% chance per check, max once per hour)
                if (!player.world.activeEvent?.type || (player.world.activeEvent.endsAt && now >= new Date(player.world.activeEvent.endsAt).getTime())) {
                    // Event ended or no active event
                    if (player.world.activeEvent?.type && player.world.activeEvent.type in WORLD_EVENTS) {
                        message = `Sự kiện "${WORLD_EVENTS[player.world.activeEvent.type as keyof typeof WORLD_EVENTS].name}" đã kết thúc.`
                        log = message
                    }
                    player.world.activeEvent = { type: null, endsAt: null }
                    
                    // Roll for new event
                    if (Math.random() < 0.05) { // 5% per check
                        const events = Object.keys(WORLD_EVENTS) as Array<keyof typeof WORLD_EVENTS>
                        const weights = events.map(k => WORLD_EVENTS[k].rarity)
                        const total = weights.reduce((a, b) => a + b, 0)
                        const roll = Math.random() * total
                        let cumulative = 0
                        for (let i = 0; i < events.length; i++) {
                            cumulative += weights[i]
                            if (roll < cumulative) {
                                const eventKey = events[i]
                                const eventDef = WORLD_EVENTS[eventKey]
                                player.world.activeEvent = {
                                    type: eventKey,
                                    endsAt: new Date(now + eventDef.duration * 1000)
                                }
                                message = `🌟 Sự kiện: ${eventDef.name}! ${eventDef.description}`
                                log = message
                                break
                            }
                        }
                    }
                }
                
                break
            }

            // World 3.0: Secret Realms
            case 'REALM_LIST': {
                // Reset daily tickets if needed
                const now = new Date()
                const lastReset = player.secretRealms?.lastTicketReset ? new Date(player.secretRealms.lastTicketReset) : new Date(0)
                const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)
                
                if (!player.secretRealms) {
                    player.secretRealms = { tickets: 3, activeRun: { realmKey: null, startedAt: null, endsAt: null }, completed: [], lastTicketReset: now }
                } else if (hoursSinceReset >= 24) {
                    player.secretRealms.tickets = 3
                    player.secretRealms.lastTicketReset = now
                }
                
                const realms = Object.values(SECRET_REALMS)
                return { success: true, message: 'Danh sách Mật Cảnh', data: { realms, tickets: player.secretRealms.tickets, activeRun: player.secretRealms.activeRun } }
            }

            case 'REALM_ENTER': {
                const { realmKey } = payload || {}
                if (!realmKey) return { success: false, message: 'Thiếu mã Mật Cảnh' }
                
                const realm = SECRET_REALMS[realmKey]
                if (!realm) return { success: false, message: 'Mật Cảnh không tồn tại' }
                
                if (!player.secretRealms) player.secretRealms = { tickets: 3, activeRun: { realmKey: null, startedAt: null, endsAt: null }, completed: [], lastTicketReset: new Date() }
                if (player.secretRealms.tickets < realm.ticketCost) return { success: false, message: 'Không đủ vé Mật Cảnh' }
                if (player.secretRealms.activeRun?.realmKey) return { success: false, message: 'Đang trong một Mật Cảnh khác' }
                
                // Check requirements
                const realmIndex = REALMS.indexOf(player.realm.major as any)
                const minIndex = REALMS.indexOf(realm.requirements.minRealm as any)
                if (realmIndex < minIndex) return { success: false, message: `Yêu cầu cảnh giới tối thiểu ${realm.requirements.minRealm}` }
                if (player.attributes.qi < realm.requirements.minQi) return { success: false, message: `Yêu cầu ${realm.requirements.minQi} linh khí` }
                
                player.secretRealms.tickets -= realm.ticketCost
                const now = Date.now()
                player.secretRealms.activeRun = {
                    realmKey: realm.key,
                    startedAt: new Date(now),
                    endsAt: new Date(now + realm.duration * 1000)
                }
                
                message = `Bước vào ${realm.name}...`
                log = message
                break
            }

            case 'REALM_COMPLETE': {
                if (!player.secretRealms?.activeRun?.realmKey) return { success: false, message: 'Không có Mật Cảnh đang chạy' }
                
                const now = Date.now()
                const endsAt = new Date(player.secretRealms.activeRun.endsAt).getTime()
                if (now < endsAt) return { success: false, message: 'Chưa hoàn thành Mật Cảnh' }
                
                const realm = SECRET_REALMS[player.secretRealms.activeRun.realmKey]
                if (!realm) return { success: false, message: 'Mật Cảnh không tồn tại' }
                
                // Calculate rewards
                const qiReward = Math.floor(Math.random() * (realm.rewards.qi.max - realm.rewards.qi.min + 1)) + realm.rewards.qi.min
                const stonesReward = Math.floor(Math.random() * (realm.rewards.spiritStones.max - realm.rewards.spiritStones.min + 1)) + realm.rewards.spiritStones.min
                const herbsReward = Math.floor(Math.random() * (realm.rewards.herbs.max - realm.rewards.herbs.min + 1)) + realm.rewards.herbs.min
                
                player.attributes.qi += qiReward
                player.resources.spiritStones = (player.resources.spiritStones || 0) + stonesReward
                player.resources.herbs = (player.resources.herbs || 0) + herbsReward
                
                // Roll loot table
                const lootItems: string[] = []
                for (const loot of realm.lootTable || []) {
                    if (Math.random() < loot.dropRate) {
                        const qty = Math.floor(Math.random() * ((loot.quantity?.max || 1) - (loot.quantity?.min || 1) + 1)) + (loot.quantity?.min || 1)
                        let item = await ItemModel.findOne({ name: loot.itemName })
                        if (!item) {
                            item = await ItemModel.create({ name: loot.itemName, type: loot.itemType, isStackable: loot.itemType === 'material' })
                        }
                        const idx = player.inventory.findIndex((i: any) => i.itemId && i.itemId.toString() === item!._id.toString())
                        if (idx >= 0) player.inventory[idx].count += qty
                        else player.inventory.push({ itemId: item._id, count: qty, uid: `inv_${Date.now()}_${Math.random()}` })
                        lootItems.push(`${loot.itemName} x${qty}`)
                    }
                }
                
                // Mark completed
                if (!player.secretRealms.completed.includes(realm.key)) {
                    player.secretRealms.completed.push(realm.key)
                }
                player.secretRealms.activeRun = { realmKey: null, startedAt: null, endsAt: null }
                
                message = `Hoàn thành ${realm.name}! Nhận: ${qiReward} Qi, ${stonesReward} Linh Thạch, ${herbsReward} Thảo Dược${lootItems.length > 0 ? ', ' + lootItems.join(', ') : ''}`
                log = message
                break
            }

            // Endgame 4.0: Ascension System
            case 'ASCENSION_INFO': {
                if (!player.ascension) {
                    player.ascension = { level: 0, totalPoints: 0, spentPoints: 0, perks: [], totalLifetimeQi: 0 }
                }
                const currentQi = player.attributes.qi || 0
                const requiredQi = calcAscensionCost(player.ascension.level)
                const canAscend = currentQi >= requiredQi
                return {
                    success: true,
                    data: {
                        ascensionLevel: player.ascension.level,
                        totalPoints: player.ascension.totalPoints,
                        availablePoints: player.ascension.totalPoints - player.ascension.spentPoints,
                        perks: player.ascension.perks || [],
                        requiredQi,
                        currentQi,
                        canAscend
                    }
                }
            }

            case 'ASCENSION_PERFORM': {
                if (!player.ascension) {
                    player.ascension = { level: 0, totalPoints: 0, spentPoints: 0, perks: [], totalLifetimeQi: 0 }
                }
                
                const currentQi = player.attributes.qi || 0
                const requiredQi = calcAscensionCost(player.ascension.level)
                
                if (currentQi < requiredQi) {
                    return { success: false, message: `Cần ${requiredQi} Qi để Thăng Thiên!` }
                }
                
                // Track lifetime qi
                player.ascension.totalLifetimeQi += currentQi
                
                // Award ascension points (1 point per ascension)
                player.ascension.level += 1
                player.ascension.totalPoints += 1
                
                // Calculate starting qi from perks
                let startingQi = 0
                const reincarnationPerk = player.ascension.perks.find((p: any) => p.perkId === 'reincarnation_qi')
                if (reincarnationPerk) {
                    const perkDef = ASCENSION_PERKS.reincarnation_qi
                    startingQi = (perkDef.effect.startingQiPerLevel || 0) * reincarnationPerk.level
                }
                
                // Reset player state
                player.realm = { major: 'Luyện Khí', minor: 1, progress: 0, maxProgress: 100 }
                player.attributes.qi = startingQi
                player.attributes.body = 10
                player.attributes.spirit = 10
                player.attributes.talent = 10
                player.resources.spiritStones = 0
                player.resources.herbs = 0
                player.inventory = []
                player.equipment = []
                player.techniques = { unlocked: ['basic'], equippedPassives: [] }
                player.cultivation = { activeTechnique: 'Cơ Bản Công', baseRate: 1, element: 'none' }
                
                message = `Thăng Thiên thành công! Cấp ${player.ascension.level}, nhận 1 điểm Thăng Thiên.`
                log = message
                break
            }

            case 'ASCENSION_UPGRADE_PERK': {
                const { perkId } = payload || {}
                if (!perkId || !ASCENSION_PERKS[perkId]) {
                    return { success: false, message: 'Perk không hợp lệ' }
                }
                
                if (!player.ascension) {
                    player.ascension = { level: 0, totalPoints: 0, spentPoints: 0, perks: [], totalLifetimeQi: 0 }
                }
                
                const perkDef = ASCENSION_PERKS[perkId]
                const availablePoints = player.ascension.totalPoints - player.ascension.spentPoints
                
                if (availablePoints < perkDef.cost) {
                    return { success: false, message: 'Không đủ điểm Thăng Thiên' }
                }
                
                let perk = player.ascension.perks.find((p: any) => p.perkId === perkId)
                if (!perk) {
                    perk = { perkId, level: 0 }
                    player.ascension.perks.push(perk)
                }
                
                if (perk.level >= perkDef.maxLevel) {
                    return { success: false, message: 'Đã đạt cấp tối đa' }
                }
                
                perk.level += 1
                player.ascension.spentPoints += perkDef.cost
                
                message = `Nâng cấp ${perkDef.name} lên cấp ${perk.level}`
                log = message
                break
            }

            case 'QI_CONDENSE': {
                // Convert Qi to Spirit Stones (1000:1 ratio)
                const { amount } = payload || {}
                if (!amount || amount <= 0) {
                    return { success: false, message: 'Số lượng không hợp lệ' }
                }
                
                const qiCost = amount * 1000
                if ((player.attributes.qi || 0) < qiCost) {
                    return { success: false, message: 'Không đủ Linh Khí' }
                }
                
                player.attributes.qi -= qiCost
                player.resources.spiritStones = (player.resources.spiritStones || 0) + amount
                
                message = `Ngưng kết Linh Khí thành công! -${qiCost} Linh Khí, +${amount} Linh Thạch`
                log = message
                break
            }

            default:
                return { success: false, message: 'Loại tác vụ không hợp lệ' }
        }

        if (player && player.isModified && player.isModified()) {
            await player.save()
        } else if (player) {
            // Ensure updatedAt updates
            player.markModified('updatedAt')
            await player.save()
        }
        // Re-populate for return
        await player.populate('inventory.itemId')

        return { success, message, player, log }

    } catch (e: any) {
        return { success: false, message: e.message }
    }
})
