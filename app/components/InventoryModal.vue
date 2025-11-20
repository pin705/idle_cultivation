<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
const player = usePlayerStore()
</script>

<template>
  <div>
    <p class="mb-3 font-bold">Túi Đồ:</p>
    <div class="grid grid-cols-5 gap-2">
      <div v-for="slot in player.inventory" :key="slot._id || slot.itemId?._id" class="p-2 border-2 border-gray-300 rounded bg-white text-xs flex flex-col items-center justify-center h-16">
        <span class="font-bold">{{ slot.itemId?.name || '???' }}</span>
        <span class="text-gray-500">x{{ slot.count }}</span>
      </div>
      <button @click="player.findItem()" class="p-2 border-2 border-dashed border-gray-400 rounded bg-gray-50 text-xs text-gray-600 hover:bg-gray-100 flex flex-col items-center justify-center h-16">
        + Tìm Vật Phẩm
      </button>
    </div>
  </div>
</template>
