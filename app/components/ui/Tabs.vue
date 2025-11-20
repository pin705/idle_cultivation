<script setup lang="ts">
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

const selectTab = (tabId: string) => {
  emit('update:modelValue', tabId)
}
</script>

<template>
  <div class="flex gap-1 overflow-x-auto scrollbar-hide border-b-2 border-ink">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="[
        'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200',
        'border-b-3 -mb-0.5 md:px-6',
        modelValue === tab.id 
          ? 'border-seal text-seal bg-paper' 
          : 'border-transparent text-ink-light hover:bg-paper-aged hover:text-ink'
      ]"
      @click="selectTab(tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span 
        v-if="tab.badge" 
        class="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold rounded-full bg-seal text-paper">
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
