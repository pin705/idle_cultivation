<script setup lang="ts">
import { colors, borderRadius, shadows, spacing } from '../../styles/design-tokens'

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
</script>

<template>
  <div :class="['card', `card-padding-${padding}`, { 'card-shadow': shadow, 'card-hoverable': hoverable }]">
    <div v-if="title || subtitle || $slots.header" class="card-header">
      <slot name="header">
        <div v-if="title" class="card-title">{{ title }}</div>
        <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
      </slot>
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: v-bind('colors.bg.paper');
  border: 2px solid v-bind('colors.border.dark');
  border-radius: v-bind('borderRadius.lg');
  overflow: hidden;
  transition: all 200ms ease;
}

.card-shadow {
  box-shadow: v-bind('shadows.base');
}

.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('shadows.lg');
  border-color: v-bind('colors.accent[900]');
}

/* Padding variants */
.card-padding-none {
  padding: 0;
}

.card-padding-sm > .card-body {
  padding: v-bind('spacing.sm');
}

.card-padding-md > .card-body {
  padding: v-bind('spacing.md');
}

.card-padding-lg > .card-body {
  padding: v-bind('spacing.lg');
}

/* Header */
.card-header {
  padding: v-bind('spacing.md');
  border-bottom: 1px solid v-bind('colors.border.light');
  background-color: v-bind('colors.bg.secondary');
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: v-bind('colors.text.primary');
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: v-bind('colors.text.secondary');
  margin-top: 0.25rem;
}

/* Body */
.card-body {
  flex: 1;
}

/* Footer */
.card-footer {
  padding: v-bind('spacing.md');
  border-top: 1px solid v-bind('colors.border.light');
  background-color: v-bind('colors.bg.secondary');
}
</style>
