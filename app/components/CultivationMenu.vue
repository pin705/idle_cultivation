<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import InventoryModal from './InventoryModal.vue'
import CharacterModal from './CharacterModal.vue'
import TechniqueModal from './TechniqueModal.vue'
import EquipmentModal from './EquipmentModal.vue'
import ShopModal from './ShopModal.vue'
import CraftingModal from './CraftingModal.vue'

const showInventory = ref(false)
const showCharacter = ref(false)
const showTechnique = ref(false)
const showEquipment = ref(false)
const showShop = ref(false)
const showCrafting = ref(false)
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
      <button @click="showTechnique = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Công Pháp
      </button>
      <button @click="showEquipment = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Trang Bị
      </button>
      <button @click="showShop = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Cửa Hàng
      </button>
      <button @click="showCrafting = true" class="px-4 py-2 bg-white border-2 border-ink-black rounded hover:bg-gray-50 text-sm font-bold">
        Chế Tạo
      </button>
    </div>

    <BaseModal v-model="showCharacter" title="Thông Tin Tu Sĩ" maxWidth="max-w-xl">
      <CharacterModal />
    </BaseModal>

    <BaseModal v-model="showInventory" title="Túi Đồ" maxWidth="max-w-3xl">
      <InventoryModal />
    </BaseModal>

    <BaseModal v-model="showTechnique" title="Kỹ Thuật Tu Luyện" maxWidth="max-w-3xl">
      <TechniqueModal />
    </BaseModal>

    <BaseModal v-model="showEquipment" title="Trang Bị" maxWidth="max-w-3xl">
      <EquipmentModal />
    </BaseModal>

    <BaseModal v-model="showShop" title="Cửa Hàng" maxWidth="max-w-2xl">
      <ShopModal />
    </BaseModal>

    <BaseModal v-model="showCrafting" title="Chế Tạo / Tẩy Luyện" maxWidth="max-w-2xl">
      <CraftingModal />
    </BaseModal>
  </div>
</template>
