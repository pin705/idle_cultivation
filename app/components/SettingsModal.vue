<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme'
import { THEME_NAMES } from '../utils/ui-constants'
import type { ThemeName } from '../utils/ui-constants'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const themeStore = useThemeStore()

const themes: ThemeName[] = ['ink-wash', 'dark', 'light']

function selectTheme(theme: ThemeName) {
  themeStore.setTheme(theme)
}

function getThemePreviewClass(theme: ThemeName, part: 'bar' | 'content' | 'text'): string {
  const classes: Record<ThemeName, Record<string, string>> = {
    'ink-wash': {
      bar: 'bg-ink border-b-2 border-gold',
      content: 'bg-paper',
      text: 'bg-ink'
    },
    'dark': {
      bar: 'bg-gray-800 border-b-2 border-amber-600',
      content: 'bg-black',
      text: 'bg-gray-200'
    },
    'light': {
      bar: 'bg-gray-100 border-b-2 border-amber-500',
      content: 'bg-white',
      text: 'bg-gray-900'
    }
  }
  return classes[theme][part] || ''
}
</script>

<template>
  <BaseModal :model-value="show" @update:model-value="(v) => !v && emit('close')" title="Cài Đặt">
    <div class="p-6 max-w-2xl mx-auto">
      <!-- Theme Selection -->
      <section class="mb-8">
        <h3 class="text-xl font-semibold mb-4 pb-2 border-b-2 border-ink text-ink">
          Cài Đặt Chủ Đề
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            v-for="theme in themes"
            :key="theme"
            :class="[
              'flex flex-col items-center gap-3 p-4 border-2 transition-all duration-200 bg-paper-aged text-ink',
              themeStore.currentTheme === theme 
                ? 'border-gold ring-4 ring-gold/20' 
                : 'border-ink-light hover:-translate-y-1 hover:shadow-ink'
            ]"
            @click="selectTheme(theme)"
          >
            <div class="w-full h-20 border border-ink-light overflow-hidden flex flex-col">
              <div class="h-4" :data-theme="theme" :class="getThemePreviewClass(theme, 'bar')"></div>
              <div class="flex-1 p-2 flex flex-col gap-1" :data-theme="theme" :class="getThemePreviewClass(theme, 'content')">
                <div class="h-2 rounded" :class="getThemePreviewClass(theme, 'text')"></div>
                <div class="h-2 w-3/5 rounded" :class="getThemePreviewClass(theme, 'text')"></div>
              </div>
            </div>
            <span class="text-sm font-medium">{{ THEME_NAMES[theme] }}</span>
          </button>
        </div>
      </section>

      <!-- Future settings -->
      <section class="mb-4">
        <h3 class="text-xl font-semibold mb-4 pb-2 border-b-2 border-ink text-ink">
          Cài Đặt Khác
        </h3>
        <p class="text-sm text-ink-light">
          Thêm cài đặt sẽ có sớm...
        </p>
      </section>
    </div>
  </BaseModal>
</template>

<style scoped>
/* Minimal custom styles - most styling is done via Tailwind */
</style>
