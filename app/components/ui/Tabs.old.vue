<script setup lang="ts">
import { colors, borderRadius, transitions } from '../../styles/design-tokens'

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
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab', { 'tab-active': modelValue === tab.id }]"
      @click="selectTab(tab.id)"
    >
      <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
      <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid v-bind('colors.border.light');
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: v-bind('colors.text.secondary');
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all v-bind('transitions.base');
  white-space: nowrap;
  position: relative;
  margin-bottom: -2px;
}

.tab:hover {
  color: v-bind('colors.text.primary');
  background-color: v-bind('colors.bg.secondary');
}

.tab-active {
  color: v-bind('colors.accent[900]');
  border-bottom-color: v-bind('colors.accent[900]');
  background-color: v-bind('colors.bg.primary');
}

.tab-active:hover {
  background-color: v-bind('colors.bg.primary');
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-label {
  font-family: v-bind('transitions.base');
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background-color: v-bind('colors.accent[900]');
  color: v-bind('colors.text.inverse');
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: v-bind('borderRadius.full');
}

@media (max-width: 768px) {
  .tab {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }
  
  .tab-icon {
    font-size: 1.125rem;
  }
}
</style>
