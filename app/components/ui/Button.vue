<script setup lang="ts">
import { useThemeStore } from '../../stores/theme'

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

const themeStore = useThemeStore()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded min-h-[2rem]',
  md: 'px-4 py-2 text-base rounded-md min-h-[2.5rem]',
  lg: 'px-6 py-3 text-lg rounded-lg min-h-[3rem]'
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200 border-2 cursor-pointer select-none',
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:-translate-y-0.5'
    ]"
    :style="{
      backgroundColor: variant === 'primary' ? themeStore.colors.accentPrimary :
                      variant === 'secondary' ? themeStore.colors.bgPrimary :
                      variant === 'accent' ? themeStore.colors.accentGold :
                      variant === 'danger' ? themeStore.colors.error :
                      'transparent',
      color: variant === 'ghost' ? themeStore.colors.textPrimary :
             variant === 'secondary' ? themeStore.colors.textPrimary :
             themeStore.colors.textInverse,
      borderColor: variant === 'primary' ? themeStore.colors.accentPrimary :
                   variant === 'secondary' ? themeStore.colors.borderPrimary :
                   variant === 'accent' ? themeStore.colors.accentGold :
                   variant === 'danger' ? themeStore.colors.error :
                   'transparent'
    }"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <slot v-else />
  </button>
</template>

<style scoped>
/* Minimal custom styles */
button:hover:not([disabled]) {
  filter: brightness(1.1);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}
</style>
