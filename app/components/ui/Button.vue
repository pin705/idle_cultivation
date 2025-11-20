<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 border-2'

const variantClasses = {
  primary: 'bg-seal border-seal text-paper hover:bg-seal-light hover:border-seal-light',
  secondary: 'bg-transparent border-ink text-ink hover:bg-ink hover:text-paper',
  accent: 'bg-transparent border-gold text-ink hover:bg-gold hover:text-ink',
  ghost: 'bg-transparent border-transparent text-ink hover:bg-paper-aged',
  danger: 'bg-transparent border-seal text-seal hover:bg-seal hover:text-paper'
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm min-h-[2rem]',
  md: 'px-4 py-2 text-base min-h-[2.5rem]',
  lg: 'px-6 py-3 text-lg min-h-[3rem]'
}

const computedClasses = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.fullWidth ? 'w-full' : '',
  (props.disabled || props.loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:shadow-ink'
])
</script>

<template>
  <button
    :class="computedClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
    <slot />
  </button>
</template>

<style scoped>
button:focus-visible {
  outline: 2px solid theme('colors.gold.DEFAULT');
  outline-offset: 2px;
}
</style>
