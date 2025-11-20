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
import AscensionModal from './AscensionModal.vue'

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
const ascensionRef = ref<InstanceType<typeof AscensionModal> | null>(null)

const openSecretRealms = () => {
  secretRealmsRef.value?.open()
}

const openAscension = () => {
  ascensionRef.value?.open()
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 pb-2 pt-2">
              <button @click="openSecretRealms" class="relative flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors duration-200 hover:border-yellow-400/50 hover:bg-gray-700 hover:text-white">
        Mật Cảnh
      </button>
      <button @click="openAscension" class="relative flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors duration-200 hover:border-yellow-400/50 hover:bg-gray-700 hover:text-white">
        Thăng Thiên
      </button>
    </div>
    <SecretRealmsModal ref="secretRealmsRef" />
    <AscensionModal ref="ascensionRef" />

    <div class="flex flex-wrap gap-2 pb-2 pt-2">
      <button @click="showCharacter = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Nhân Vật
      </button>
      <button @click="showInventory = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Túi Đồ
      </button>
      <button @click="showTechnique = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Công Pháp
      </button>
      <button @click="showEquipment = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Trang Bị
      </button>
      <button @click="showShop = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Cửa Hàng
      </button>
      <button @click="showCrafting = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Chế Tạo
      </button>
      <button @click="showTribulation = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Thiên Kiếp
      </button>
      <button @click="showSect = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Tông Môn
      </button>
      <button @click="showMissions = true" class="relative mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-black/40 font-semibold italic text-[10px] transition-colors">
        Nhiệm Vụ
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
  </div>
</template>

