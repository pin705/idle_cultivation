<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
const player = usePlayerStore()
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold">{{ player.name }}</h4>
        <p class="text-seal-red font-bold">{{ player.formattedRealm }}</p>
        <p class="text-sm text-gray-600">Đạo: <span class="font-bold capitalize">{{ (player as any).realmPath || 'none' }}</span></p>
      </div>
      <div class="text-sm text-gray-600">
        Tốc độ hấp thu: <span class="font-bold">{{ player.qiRate }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="font-bold mb-1">Thuộc Tính</div>
        <ul class="text-sm leading-6">
          <li>Khí: <span class="font-mono font-bold">{{ Math.floor(player.attributes.qi) }}</span></li>
          <li>Thể: <span class="font-mono font-bold">{{ player.attributes.body }}</span></li>
          <li>Thần: <span class="font-mono font-bold">{{ player.attributes.spirit }}</span></li>
          <li>Tư Chất: <span class="font-mono font-bold">{{ player.attributes.talent }}</span></li>
        </ul>
      </div>
      <div class="p-3 border-2 border-ink-black rounded bg-gray-50">
        <div class="font-bold mb-1">Công Pháp</div>
        <ul class="text-sm leading-6">
          <li>Đang vận: <span class="font-bold">{{ player.cultivation.activeTechnique }}</span></li>
          <li>Ngũ hành: <span class="font-bold capitalize">{{ player.cultivation.element }}</span></li>
          <li>Cơ sở: <span class="font-mono font-bold">{{ player.cultivation.baseRate }}</span> khí/giây</li>
        </ul>
      </div>
    </div>
  </div>
</template>
