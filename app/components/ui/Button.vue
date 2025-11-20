<script setup lang="ts">
import { colors, spacing, borderRadius, shadows, transitions } from '../../styles/design-tokens'

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
</script>

<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full': fullWidth, 'btn-disabled': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot v-else />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all v-bind('transitions.base');
  border: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(127, 29, 29, 0.2);
}

/* Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: v-bind('borderRadius.base');
  min-height: 2rem;
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: v-bind('borderRadius.md');
  min-height: 2.5rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  border-radius: v-bind('borderRadius.lg');
  min-height: 3rem;
}

/* Variants */
.btn-primary {
  background-color: v-bind('colors.primary[900]');
  color: v-bind('colors.text.inverse');
  border-color: v-bind('colors.primary[900]');
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: v-bind('colors.primary[800]');
  border-color: v-bind('colors.primary[800]');
  transform: translateY(-1px);
  box-shadow: v-bind('shadows.md');
}

.btn-secondary {
  background-color: v-bind('colors.bg.primary');
  color: v-bind('colors.primary[900]');
  border-color: v-bind('colors.border.dark');
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: v-bind('colors.bg.secondary');
  transform: translateY(-1px);
  box-shadow: v-bind('shadows.base');
}

.btn-accent {
  background-color: v-bind('colors.accent[900]');
  color: v-bind('colors.text.inverse');
  border-color: v-bind('colors.accent[900]');
}

.btn-accent:hover:not(.btn-disabled) {
  background-color: v-bind('colors.accent[800]');
  border-color: v-bind('colors.accent[800]');
  transform: translateY(-1px);
  box-shadow: v-bind('shadows.md');
}

.btn-ghost {
  background-color: transparent;
  color: v-bind('colors.text.primary');
  border-color: transparent;
}

.btn-ghost:hover:not(.btn-disabled) {
  background-color: v-bind('colors.bg.secondary');
}

.btn-danger {
  background-color: v-bind('colors.error');
  color: v-bind('colors.text.inverse');
  border-color: v-bind('colors.error');
}

.btn-danger:hover:not(.btn-disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: v-bind('shadows.md');
}

/* States */
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-full {
  width: 100%;
}

/* Loading spinner */
.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
