<script setup lang="ts">
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <div class="border-2 border-ink bg-paper p-2 sm:p-3 overflow-y-auto scrollbar-ink font-mono text-xs" style="height: calc(100vh - 16rem); max-height: 400px; min-height: 200px;">
    <div v-if="!player.logs || player.logs.length === 0" class="text-ink-light text-center italic mt-8">
      Chưa có nhật ký...
    </div>
    <div v-else v-for="(log, index) in player.logs" :key="index" class="mb-1 border-b border-ink-light pb-1 last:border-0 hover:bg-paper-aged px-1 transition-colors text-ink">
      {{ log }}
    </div>
  </div>
</template>
