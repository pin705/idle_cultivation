import { UserModel } from '../../models/User'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.username || !body.password) {
        return { success: false, message: 'Thiếu đạo hiệu hoặc mật khẩu' }
    }

    const existingUser = await UserModel.findOne({ username: body.username })
    if (existingUser) {
        return { success: false, message: 'Đạo hiệu đã tồn tại' }
    }

    const user = await UserModel.create({
        username: body.username,
        password: body.password // NOTE: Hash this in production!
    })

    // Set user session
    await setUserSession(event, {
        user: {
            id: user._id.toString(),
            username: user.username
        }
    })

    return { success: true, message: 'Đăng ký thành công', user: { id: user._id, username: user.username } }
})
