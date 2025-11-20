<script setup lang="ts">
import { colors, spacing } from '../../styles/design-tokens'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  spacing: 'md'
})
</script>

<template>
  <div :class="['divider', `divider-${orientation}`, `divider-spacing-${spacing}`]">
    <span v-if="text" class="divider-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
}

/* Horizontal */
.divider-horizontal {
  width: 100%;
  border-top: 1px solid v-bind('colors.border.dark');
}

.divider-horizontal.divider-spacing-sm {
  margin: v-bind('spacing.sm') 0;
}

.divider-horizontal.divider-spacing-md {
  margin: v-bind('spacing.md') 0;
}

.divider-horizontal.divider-spacing-lg {
  margin: v-bind('spacing.lg') 0;
}

/* Vertical */
.divider-vertical {
  height: 100%;
  border-left: 1px solid v-bind('colors.border.dark');
}

.divider-vertical.divider-spacing-sm {
  margin: 0 v-bind('spacing.sm');
}

.divider-vertical.divider-spacing-md {
  margin: 0 v-bind('spacing.md');
}

.divider-vertical.divider-spacing-lg {
  margin: 0 v-bind('spacing.lg');
}

/* Text variant */
.divider-horizontal:has(.divider-text) {
  border: none;
}

.divider-horizontal:has(.divider-text)::before,
.divider-horizontal:has(.divider-text)::after {
  content: '';
  flex: 1;
  border-top: 1px solid v-bind('colors.border.dark');
}

.divider-text {
  padding: 0 v-bind('spacing.md');
  font-size: 0.875rem;
  font-weight: 500;
  color: v-bind('colors.text.secondary');
  white-space: nowrap;
}
</style>
