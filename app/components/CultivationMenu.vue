<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import InventoryModal from './InventoryModal.vue'
import CharacterModal from './CharacterModal.vue'
import TechniqueModal from './TechniqueModal.vue'
import EquipmentModal from './EquipmentModal.vue'
import ShopModal from './ShopModal.vue'
import CraftingModal from './CraftingModal.vue'
import TribulationModal from './TribulationModal.vue'
import SectModal from './SectModal.vue'
import MissionBoardModal from './MissionBoardModal.vue'
import SecretRealmsModal from './SecretRealmsModal.vue'

const showInventory = ref(false)
const showCharacter = ref(false)
const showTechnique = ref(false)
const showEquipment = ref(false)
const showShop = ref(false)
const showCrafting = ref(false)
const showTribulation = ref(false)
const showSect = ref(false)
const showMissions = ref(false)
const showSecretRealms = ref(false)

const secretRealmsRef = ref<InstanceType<typeof SecretRealmsModal> | null>(null)
const openSecretRealms = () => {
  secretRealmsRef.value?.open()
}
</script>

<template>
  <div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      <button @click="showCharacter = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Nhân Vật
      </button>
      <button @click="showInventory = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Túi Đồ
      </button>
      <button @click="showTechnique = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Công Pháp
      </button>
      <button @click="showEquipment = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Trang Bị
      </button>
      <button @click="showShop = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Cửa Hàng
      </button>
      <button @click="showCrafting = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Chế Tạo
      </button>
      <button @click="showTribulation = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Thiên Kiếp
      </button>
      <button @click="showSect = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Tông Môn
      </button>
      <button @click="showMissions = true" class="px-2 sm:px-3 py-2 sm:py-3 bg-white border border-ink-black hover:bg-gray-100 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Nhiệm Vụ
      </button>
      <button @click="openSecretRealms" class="px-2 sm:px-3 py-2 sm:py-3 bg-gradient-to-r from-purple-700 to-purple-900 text-white border border-purple-900 hover:from-purple-600 hover:to-purple-800 text-xs sm:text-sm font-bold transition-colors tracking-wide">
        Mật Cảnh
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

    <BaseModal v-model="showTribulation" title="Thiên Kiếp" maxWidth="max-w-xl">
      <TribulationModal />
    </BaseModal>

    <BaseModal v-model="showSect" title="Tông Môn" maxWidth="max-w-xl">
      <SectModal />
    </BaseModal>

    <BaseModal v-model="showMissions" title="Bảng Nhiệm Vụ" maxWidth="max-w-3xl">
      <MissionBoardModal />
    </BaseModal>

    <SecretRealmsModal ref="secretRealmsRef" />
  </div>
</template>

