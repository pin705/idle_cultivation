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
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white border border-ink-black shadow-2xl w-full max-w-md">
          <!-- Header -->
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-300 bg-gradient-to-b from-gray-50 to-white">
            <h3 class="text-xl sm:text-2xl font-bold tracking-wider text-center text-seal-red">Bế Quan Hoàn Thành</h3>
          </div>
          
          <!-- Content -->
          <div class="p-4 sm:p-6 space-y-4">
            <!-- Offline Time -->
            <div class="text-center p-3 bg-gray-50 border border-gray-200">
              <p class="text-sm text-gray-600 mb-1">Thời gian bế quan</p>
              <p class="text-2xl font-bold text-ink-black">{{ formatTime(offlineTime) }}</p>
            </div>
            
            <!-- Qi Gained -->
            <div class="text-center p-4 bg-gradient-to-b from-yellow-50 to-white border border-yellow-300">
              <p class="text-sm text-gray-600 mb-2">Linh khí thu được</p>
              <p class="text-3xl sm:text-4xl font-bold text-yellow-600">+{{ qiGained }}</p>
            </div>
            
            <!-- Message -->
            <div class="text-center italic text-gray-700 border-t border-b border-gray-200 py-3">
              "{{ message }}"
            </div>
            
            <!-- Close Button -->
            <button 
              @click="close" 
              class="w-full px-4 py-3 text-base sm:text-lg font-bold border border-ink-black hover:bg-gray-100 active:bg-gray-200 transition-colors tracking-wide"
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
