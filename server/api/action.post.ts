import { PlayerModel } from '../models/Player'
import { ItemModel } from '../models/Item'
import { UserModel } from '../models/User'

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
    let success = true

    try {
        switch (type) {
            case 'LOAD': {
                if (!player) return { success: false, message: 'Không tìm thấy nhân vật', notFound: true }
                return { success: true, message: 'Tải dữ liệu thành công', player }
            }

            case 'AUTH_LOGIN': {
                const { username, password } = payload || {}
                const user = await UserModel.findOne({ username, password })
                if (!user) return { success: false, message: 'Sai đạo hiệu hoặc mật khẩu' }
                await setUserSession(event, { user: { id: user._id.toString(), username: user.username } })
                return { success: true, message: 'Đăng nhập thành công', user: { id: user._id, username: user.username } }
            }

            case 'AUTH_REGISTER': {
                const { username, password } = payload || {}
                if (!username || !password) return { success: false, message: 'Thiếu đạo hiệu hoặc mật khẩu' }
                const existing = await UserModel.findOne({ username })
                if (existing) return { success: false, message: 'Đạo hiệu đã tồn tại' }
                const user = await UserModel.create({ username, password })
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
                    attributes,
                    resources: { spiritStones: 0, herbs: 0 },
                    cultivation,
                    inventory: [],
                    world: { element: 'metal', cycleTimer: 0, cycleDuration: 10 },
                    logs: [`Khởi tạo nhân vật '${name}' với đạo ${dao}.`]
                })
                return { success: true, message: 'Tạo nhân vật thành công', player: newPlayer }
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
                    const maxRate = 100 // Hard cap for now
                    const maxPossibleGain = timeDiffSeconds * maxRate + 100 // Buffer

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
                // Push system log
                player.logs = player.logs || []
                player.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
                break

            case 'OFFLINE_CALC':
                const now = new Date()
                const lastSaved = new Date(player.updatedAt)
                const diffSeconds = (now.getTime() - lastSaved.getTime()) / 1000

                if (diffSeconds > 60) { // Minimum 60 seconds for offline progress
                    const baseRate = player.cultivation.baseRate
                    // Simplified offline calculation (assume average multiplier of 1.5x)
                    const offlineGain = Math.floor(diffSeconds * baseRate * 0.5)

                    player.attributes.qi += offlineGain
                    player.updatedAt = now
                    message = `Bạn đã bế quan ${Math.floor(diffSeconds)} giây và thu được ${offlineGain} linh khí.`
                } else {
                    message = 'Chưa đủ thời gian bế quan.'
                }
                player.logs = player.logs || []
                player.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
                break

            case 'BREAKTHROUGH':
                const { major, minor, progress, maxProgress } = player.realm
                const requiredQi = maxProgress * 10 // Example cost

                if (player.attributes.qi >= requiredQi) {
                    player.attributes.qi -= requiredQi

                    // Advance realm logic
                    if (progress + 10 >= maxProgress) {
                        // Minor breakthrough
                        player.realm.minor += 1
                        player.realm.progress = 0
                        player.realm.maxProgress = Math.floor(maxProgress * 1.5)

                        // Major breakthrough check
                        if (player.realm.minor > 9) {
                            const realms = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần']
                            const currentIndex = realms.indexOf(major)
                            if (currentIndex < realms.length - 1) {
                                player.realm.major = realms[currentIndex + 1]
                                player.realm.minor = 1
                                player.realm.maxProgress *= 2
                                message = `Chúc mừng! Bạn đã đột phá lên ${player.realm.major}!`
                            }
                        } else {
                            message = `Đột phá tiểu cảnh giới thành công! Tăng cường thuộc tính.`
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
                player.logs = player.logs || []
                player.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
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
                player.logs = player.logs || []
                player.logs.unshift(`[${new Date().toLocaleTimeString()}] ${message}`)
                break

            default:
                return { success: false, message: 'Loại tác vụ không hợp lệ' }
        }

        await player.save()
        // Re-populate for return
        await player.populate('inventory.itemId')

        return { success, message, player }

    } catch (e: any) {
        return { success: false, message: e.message }
    }
})
