<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title?: string; maxWidth?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const close = () => emit('update:modelValue', false)
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-ink/50 backdrop-blur-sm" @click="close"></div>
        <div :class="['relative bg-paper border-2 border-ink shadow-ink-lg w-full', maxWidth || 'max-w-2xl']" style="max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;">
          <div class="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-ink bg-paper-aged flex-shrink-0">
            <h3 class="text-base sm:text-xl font-bold tracking-wider text-ink">{{ title }}</h3>
            <button @click="close" class="px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold border-2 border-ink hover:bg-ink hover:text-paper transition-all tracking-wide">X</button>
          </div>
          <div class="p-3 sm:p-4 overflow-y-auto scrollbar-ink flex-1">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
