<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
const { call } = useApiAction()

const rerollTarget = ref('')
const working = ref(false)

async function reroll() {
  if (!rerollTarget.value) return
  working.value = true
  await call('ITEM_REROLL' as any, { uid: rerollTarget.value })
  working.value = false
}
</script>

<template>
  <div class="space-y-3">
    <div class="text-sm text-gray-600">Tẩy luyện trang bị sẽ tiêu hao tài nguyên.</div>
    <div class="flex gap-2">
      <input v-model="rerollTarget" placeholder="UID trang bị trong túi" class="border-2 border-ink-black p-2 text-sm w-full" />
      <button :disabled="working || !rerollTarget" @click="reroll" class="px-3 py-2 bg-white border-2 border-ink-black rounded text-sm font-bold hover:bg-gray-100 disabled:opacity-50">
        {{ working ? 'Đang tẩy luyện…' : 'Tẩy Luyện' }}
      </button>
    </div>
  </div>
</template>
