<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'

interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: true,
  hoverable: false
})

const themeStore = useThemeStore()

const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6'
}
</script>

<template>
  <div 
    :class="[
      'border-2 rounded-lg overflow-hidden transition-all duration-200',
      shadow ? 'shadow' : '',
      hoverable ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''
    ]"
    :style="{
      backgroundColor: themeStore.colors.bgPaper,
      borderColor: themeStore.colors.borderPrimary
    }">
    <div 
      v-if="title || subtitle || $slots.header" 
      class="px-4 py-3 border-b"
      :style="{
        backgroundColor: themeStore.colors.bgSecondary,
        borderColor: themeStore.colors.borderSecondary
      }">
      <slot name="header">
        <div v-if="title" 
             class="text-lg font-semibold"
             :style="{ color: themeStore.colors.textPrimary }">
          {{ title }}
        </div>
        <div v-if="subtitle" 
             class="text-sm mt-1"
             :style="{ color: themeStore.colors.textSecondary }">
          {{ subtitle }}
        </div>
      </slot>
    </div>
    
    <div :class="['flex-1', paddingClasses[padding]]">
      <slot />
    </div>
    
    <div 
      v-if="$slots.footer" 
      class="px-4 py-3 border-t"
      :style="{
        backgroundColor: themeStore.colors.bgSecondary,
        borderColor: themeStore.colors.borderSecondary
      }">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* Minimal custom styles */
</style>
