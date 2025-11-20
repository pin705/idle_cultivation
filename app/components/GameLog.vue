<script setup lang="ts">
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <div class="border-2 border-gray-300 rounded bg-white p-4 h-48 overflow-y-auto font-mono text-xs shadow-inner">
    <div v-if="!player.logs || player.logs.length === 0" class="text-gray-400 text-center italic mt-4">
      Chưa có nhật ký...
    </div>
    <div v-else v-for="(log, index) in player.logs" :key="index" class="mb-1 border-b border-gray-100 pb-1 last:border-0">
      {{ log }}
    </div>
  </div>
</template>
