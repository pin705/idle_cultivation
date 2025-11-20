import { UserModel } from '../../models/User'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const user = await UserModel.findOne({ username: body.username, password: body.password })

    if (!user) {
        return { success: false, message: 'Sai đạo hiệu hoặc mật khẩu' }
    }

    // Set user session
    await setUserSession(event, {
        user: {
            id: user._id.toString(),
            username: user.username
        }
    })

    return { success: true, message: 'Đăng nhập thành công', user: { id: user._id, username: user.username } }
})
