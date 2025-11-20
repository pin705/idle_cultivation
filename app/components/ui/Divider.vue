<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'

interface Props {
  text?: string
  spacing?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'md',
  orientation: 'horizontal'
})

const themeStore = useThemeStore()

const spacingClasses = {
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6'
}
</script>

<template>
  <div 
    v-if="orientation === 'horizontal'"
    :class="['flex items-center', text ? 'gap-4' : '', spacingClasses[spacing]]">
    <div class="flex-1 h-px" :style="{ backgroundColor: themeStore.colors.borderSecondary }"></div>
    <span 
      v-if="text" 
      class="text-sm font-medium"
      :style="{ color: themeStore.colors.textSecondary }">
      {{ text }}
    </span>
    <div v-if="text" class="flex-1 h-px" :style="{ backgroundColor: themeStore.colors.borderSecondary }"></div>
  </div>
  <div 
    v-else
    class="w-px h-full mx-4"
    :style="{ backgroundColor: themeStore.colors.borderSecondary }">
  </div>
</template>

<style scoped>
/* Minimal custom styles */
</style>
