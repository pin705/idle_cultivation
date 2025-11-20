<script setup lang="ts">
interface Props {
  text?: string
  spacing?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'md',
  orientation: 'horizontal'
})

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
    <div class="flex-1 h-px bg-ink-light"></div>
    <span 
      v-if="text" 
      class="text-sm font-medium text-ink-light">
      {{ text }}
    </span>
    <div v-if="text" class="flex-1 h-px bg-ink-light"></div>
  </div>
  <div 
    v-else
    class="w-px h-full mx-4 bg-ink-light">
  </div>
</template>

<style scoped>
/* Minimal custom styles */
</style>
