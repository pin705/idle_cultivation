import { PlayerModel } from '../models/Player'

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event)
    if (!session.user) {
        return { success: false, message: 'Không có phiên đăng nhập' }
    }

    // Load player linked to user
    const userId = (session as any).user.id || (session as any).user._id
    const player = await PlayerModel.findOne({ userId }).populate('inventory.itemId')

    if (!player) {
        return { success: false, message: 'Không tìm thấy nhân vật', notFound: true }
    }

    return { success: true, message: 'Tải dữ liệu thành công', player }
})
