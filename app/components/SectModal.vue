<script setup lang="ts">
import { useApiAction } from '../composables/useApiAction'
import { usePlayerStore } from '../stores/player'

const { call } = useApiAction()
const player = usePlayerStore()

const name = ref('')
const amount = ref(0)
const loading = ref(false)

async function createSect() {
  loading.value = true
  try {
    await call('SECT_CREATE', { name: name.value })
  } finally { loading.value = false }
}
async function joinSect() {
  loading.value = true
  try {
    await call('SECT_JOIN', { name: name.value })
  } finally { loading.value = false }
}
async function donate() {
  loading.value = true
  try {
    await call('SECT_DONATE', { amount: amount.value })
  } finally { loading.value = false }
}

async function leave() {
  loading.value = true
  try {
    await call('SECT_LEAVE')
  } finally { loading.value = false }
}
</script>

<template>
  <div class="space-y-4">
    <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
      <div class="font-bold mb-2">Tông Môn</div>
      <div class="text-sm">Trạng thái: <span class="font-bold">{{ (player as any).sect?.id ? 'Đã gia nhập' : 'Chưa có' }}</span></div>
      <div v-if="(player as any).sect?.id" class="text-sm">Cống hiến: <span class="font-mono font-bold">{{ (player as any).sect?.contribution || 0 }}</span></div>
      <div v-if="(player as any).sect?.id" class="mt-2">
        <button @click="leave" :disabled="loading" class="px-3 py-1 bg-white border-2 border-ink-black rounded disabled:opacity-50">Rời Môn</button>
      </div>
    </div>

    <div class="p-3 border-2 border-ink-black rounded bg-gray-50 space-y-2">
      <div class="font-bold">Tạo / Tham Gia</div>
      <input v-model="name" placeholder="Tên tông môn" class="w-full px-3 py-1 border-2 border-ink-black rounded" />
      <div class="flex gap-2">
        <button @click="createSect" :disabled="loading || !name" class="px-3 py-1 bg-ink-black text-white rounded disabled:opacity-50">Lập Môn</button>
        <button @click="joinSect" :disabled="loading || !name" class="px-3 py-1 bg-white border-2 border-ink-black rounded disabled:opacity-50">Gia Nhập</button>
      </div>
    </div>

    <div class="p-3 border-2 border-ink-black rounded bg-gray-50 space-y-2">
      <div class="font-bold">Cống Hiến</div>
      <input type="number" v-model.number="amount" placeholder="Số Linh Thạch" class="w-full px-3 py-1 border-2 border-ink-black rounded" />
      <button @click="donate" :disabled="loading || amount<=0" class="px-3 py-1 bg-seal-red text-white rounded disabled:opacity-50">Đóng Góp</button>
    </div>
  </div>
</template>
