<script setup lang="ts">
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <div class="border border-gray-300 bg-white p-2 sm:p-3 overflow-y-auto font-mono text-xs shadow-inner" style="height: calc(100vh - 16rem); max-height: 400px; min-height: 200px;">
    <div v-if="!player.logs || player.logs.length === 0" class="text-gray-400 text-center italic mt-8">
      Chưa có nhật ký...
    </div>
    <div v-else v-for="(log, index) in player.logs" :key="index" class="mb-1 border-b border-gray-200 pb-1 last:border-0 hover:bg-gray-50 px-1 transition-colors">
      {{ log }}
    </div>
  </div>
</template>
