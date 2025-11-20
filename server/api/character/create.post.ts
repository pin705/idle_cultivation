import { PlayerModel } from '../../models/Player'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    if (!session.user) {
        return { success: false, message: 'Không có phiên đăng nhập' }
    }

    const body = await readBody(event)
    const { name, dao } = body

    if (!name || !dao) {
        return { success: false, message: 'Thiếu tên hoặc đạo' }
    }

    // Check if player already exists
    const userId = (session as any).user.id || (session as any).user._id
    const existingPlayer = await PlayerModel.findOne({ userId })
    if (existingPlayer) {
        return { success: false, message: 'Nhân vật đã tồn tại' }
    }

    // Define starting stats based on Dao
    let attributes = { qi: 10, body: 10, spirit: 10, talent: 10 }
    let cultivation = { activeTechnique: 'Cơ Bản Công', baseRate: 1, element: 'none' }

    switch (dao) {
        case 'sword':
            attributes = { qi: 15, body: 12, spirit: 8, talent: 12 }
            cultivation.element = 'metal'
            cultivation.activeTechnique = 'Ngự Kiếm Quyết'
            break
        case 'alchemy':
            attributes = { qi: 12, body: 8, spirit: 15, talent: 10 }
            cultivation.element = 'fire' // Or wood, let's say fire for alchemy
            cultivation.activeTechnique = 'Đan Hỏa Quyết'
            break
        case 'body':
            attributes = { qi: 8, body: 20, spirit: 5, talent: 8 }
            cultivation.element = 'earth'
            cultivation.activeTechnique = 'Bàn Cổ Thể'
            break
        case 'elementalist':
            attributes = { qi: 12, body: 10, spirit: 12, talent: 15 }
            cultivation.element = 'water'
            cultivation.activeTechnique = 'Ngũ Hành Quyết'
            break
    }

    const player = await PlayerModel.create({
        userId,
        name,
        realm: {
            major: 'Luyện Khí',
            minor: 1,
            progress: 0,
            maxProgress: 100
        },
        attributes,
        resources: {
            spiritStones: 0,
            herbs: 0
        },
        cultivation,
        inventory: [],
        world: {
            element: 'metal',
            cycleTimer: 0,
            cycleDuration: 10
        }
    })

    // Khởi tạo nhật ký đầu tiên
    player.logs = [`Khởi tạo nhân vật '${player.name}' với đạo ${dao}.`]
    await player.save()
    return { success: true, message: 'Tạo nhân vật thành công', player }
})
