<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import InventoryModal from './InventoryModal.vue'
import CharacterModal from './CharacterModal.vue'

const showInventory = ref(false)
const showCharacter = ref(false)
</script>

<template>
  <div class="mt-6">
    <div class="flex gap-3 justify-center">
      <button @click="showCharacter = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Nhân Vật
      </button>
      <button @click="showInventory = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Túi Đồ
      </button>
    </div>

    <BaseModal v-model="showCharacter" title="Thông Tin Tu Sĩ" maxWidth="max-w-xl">
      <CharacterModal />
    </BaseModal>

    <BaseModal v-model="showInventory" title="Túi Đồ" maxWidth="max-w-3xl">
      <InventoryModal />
    </BaseModal>
  </div>
</template>
