import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeName, ThemeColors } from '../../shared/ui-constants'
import { THEMES } from '../../shared/ui-constants'

export const useThemeStore = defineStore('theme', () => {
  // State
  const currentTheme = ref<ThemeName>('ink-wash')
  
  // Getters
  const colors = computed<ThemeColors>(() => THEMES[currentTheme.value])
  
  // Actions
  function setTheme(theme: ThemeName) {
    currentTheme.value = theme
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('cultivation-theme', theme)
    }
  }
  
  function loadTheme() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cultivation-theme') as ThemeName
      if (saved && saved in THEMES) {
        currentTheme.value = saved
      }
    }
  }
  
  // Initialize theme on load
  loadTheme()
  
  return {
    currentTheme,
    colors,
    setTheme,
    loadTheme,
  }
})
