<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'

interface Tab {
  id: string
  label: string
  icon?: string
  badge?: number
}

interface Props {
  tabs: Tab[]
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const themeStore = useThemeStore()

const selectTab = (tabId: string) => {
  emit('update:modelValue', tabId)
}
</script>

<template>
  <div class="flex gap-1 overflow-x-auto scrollbar-hide">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="[
        'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200',
        'border-b-3 -mb-0.5 md:px-6',
        modelValue === tab.id 
          ? 'border-b-3' 
          : 'border-b-transparent hover:bg-opacity-50'
      ]"
      :style="{
        color: modelValue === tab.id ? themeStore.colors.accentPrimary : themeStore.colors.textSecondary,
        borderBottomColor: modelValue === tab.id ? themeStore.colors.accentPrimary : 'transparent',
        backgroundColor: modelValue === tab.id ? themeStore.colors.bgPrimary : 'transparent'
      }"
      @click="selectTab(tab.id)"
      @mouseenter="(e) => {
        if (modelValue !== tab.id) {
          e.currentTarget.style.backgroundColor = themeStore.colors.bgSecondary
          e.currentTarget.style.color = themeStore.colors.textPrimary
        }
      }"
      @mouseleave="(e) => {
        if (modelValue !== tab.id) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = themeStore.colors.textSecondary
        }
      }"
    >
      <span v-if="tab.icon" class="text-xl md:text-2xl">{{ tab.icon }}</span>
      <span class="hidden sm:inline">{{ tab.label }}</span>
      <span 
        v-if="tab.badge" 
        class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full"
        :style="{
          backgroundColor: themeStore.colors.accentPrimary,
          color: themeStore.colors.textInverse
        }">
        {{ tab.badge }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
