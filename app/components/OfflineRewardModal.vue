<script setup lang="ts">
const props = defineProps<{ 
  modelValue: boolean
  message: string
  offlineTime: number
  qiGained: number
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const close = () => emit('update:modelValue', false)

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`
  } else if (minutes > 0) {
    return `${minutes} phút ${secs} giây`
  } else {
    return `${secs} giây`
  }
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm"></div>
        <div class="relative bg-paper border-2 border-ink shadow-ink-lg w-full max-w-md">
          <!-- Header -->
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-ink bg-paper-aged">
            <h3 class="text-xl sm:text-2xl font-bold tracking-wider text-center text-seal">Bế Quan Hoàn Thành</h3>
          </div>
          
          <!-- Content -->
          <div class="p-4 sm:p-6 space-y-4">
            <!-- Offline Time -->
            <div class="text-center p-3 bg-paper-aged border-2 border-ink-light">
              <p class="text-sm text-ink-light mb-1">Thời gian bế quan</p>
              <p class="text-2xl font-bold text-ink">{{ formatTime(offlineTime) }}</p>
            </div>
            
            <!-- Qi Gained -->
            <div class="text-center p-4 bg-paper-aged border-2 border-gold">
              <p class="text-sm text-ink-light mb-2">Linh khí thu được</p>
              <p class="text-3xl sm:text-4xl font-bold text-gold">+{{ qiGained }}</p>
            </div>
            
            <!-- Message -->
            <div class="text-center italic text-ink border-t-2 border-b-2 border-ink-light py-3">
              "{{ message }}"
            </div>
            
            <!-- Close Button -->
            <button 
              @click="close" 
              class="w-full px-4 py-3 text-base sm:text-lg font-bold border-2 border-seal bg-seal text-paper hover:bg-seal-light active:scale-95 transition-all tracking-wide"
            >
              Tiếp Tục Tu Luyện
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>
