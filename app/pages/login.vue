<script setup lang="ts">
const isLogin = ref(true)
const username = ref('')
const password = ref('')
const error = ref('')

import { useApiAction } from '../composables/useApiAction'
const { loggedIn, user, fetch: fetchSession } = useUserSession()
const { call } = useApiAction()

const handleSubmit = async () => {
  error.value = ''
  try {
    const response = await call(isLogin.value ? 'AUTH_LOGIN' : 'AUTH_REGISTER', {
      username: username.value,
      password: password.value
    }) as any

    if (response.success) {
      await fetchSession()
      navigateTo('/')
    } else {
      error.value = response.message
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred'
  }
}
</script>

<template>
  <div class="min-h-screen bg-paper-white flex items-center justify-center font-serif text-ink-black">
    <div class="w-full max-w-md p-8 border-4 border-ink-black rounded-lg bg-white shadow-2xl relative overflow-hidden">
      <!-- Ink splatters -->
      <div class="absolute -top-10 -left-10 w-32 h-32 bg-ink-black rounded-full opacity-10 blur-xl"></div>
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-seal-red rounded-full opacity-10 blur-xl"></div>

      <h1 class="text-3xl font-bold text-center mb-8 tracking-widest uppercase border-b-2 border-ink-black pb-4">
        {{ isLogin ? 'Đăng Nhập' : 'Đăng Ký' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6 relative z-10">
        <div>
          <label class="block text-sm font-bold mb-2 uppercase tracking-wider">Đạo Hiệu (Username)</label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full p-3 border-2 border-gray-300 focus:border-ink-black outline-none bg-gray-50 transition-colors"
            placeholder="Nhập đạo hiệu..."
            required
          />
        </div>

        <div>
          <label class="block text-sm font-bold mb-2 uppercase tracking-wider">Mật Khẩu</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full p-3 border-2 border-gray-300 focus:border-ink-black outline-none bg-gray-50 transition-colors"
            placeholder="Nhập mật khẩu..."
            required
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm font-bold text-center">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-ink-black text-paper-white font-bold text-lg uppercase tracking-widest hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
        >
          {{ isLogin ? 'Tiến Nhập' : 'Gia Nhập' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button 
          @click="isLogin = !isLogin" 
          class="text-sm text-gray-600 hover:text-ink-black underline decoration-dotted underline-offset-4"
        >
          {{ isLogin ? 'Chưa có đạo hiệu? Đăng ký ngay' : 'Đã có đạo hiệu? Đăng nhập' }}
        </button>
      </div>
    </div>
  </div>
</template>
