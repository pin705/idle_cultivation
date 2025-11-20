<script setup lang="ts">
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

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

const baseClasses = 'border-2 border-ink bg-paper overflow-hidden transition-all duration-200'

const computedClasses = computed(() => [
  baseClasses,
  props.shadow ? 'shadow-ink' : '',
  props.hoverable ? 'hover:-translate-y-1 hover:shadow-ink-lg cursor-pointer' : ''
])
</script>

<template>
  <div :class="computedClasses">
    <div 
      v-if="title || subtitle || $slots.header" 
      class="px-4 py-3 border-b-2 border-ink bg-paper-aged">
      <slot name="header">
        <div v-if="title" class="text-title">
          {{ title }}
        </div>
        <div v-if="subtitle" class="text-caption mt-1">
          {{ subtitle }}
        </div>
      </slot>
    </div>
    
    <div :class="['flex-1', paddingClasses[padding]]">
      <slot />
    </div>
    
    <div 
      v-if="$slots.footer" 
      class="px-4 py-3 border-t-2 border-ink bg-paper-aged">
      <slot name="footer" />
    </div>
  </div>
</template>
