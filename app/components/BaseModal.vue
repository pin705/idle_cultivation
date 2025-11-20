<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; title?: string; maxWidth?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const close = () => emit('update:modelValue', false)
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="close"></div>
        <div :class="['relative bg-white border-4 border-ink-black rounded shadow-2xl w-full mx-4', maxWidth || 'max-w-2xl']">
          <div class="flex items-center justify-between px-4 py-3 border-b-2 border-ink-black bg-gray-50">
            <h3 class="text-xl font-bold tracking-wider">{{ title }}</h3>
            <button @click="close" class="px-3 py-1 text-sm font-bold border-2 border-ink-black rounded hover:bg-gray-100">Đóng</button>
          </div>
          <div class="p-4">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
