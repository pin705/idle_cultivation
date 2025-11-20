export default defineEventHandler(async () => {
    return { success: false, message: 'Đã ngừng sử dụng. Vui lòng dùng /api/action với type=AUTH_REGISTER' }
})
