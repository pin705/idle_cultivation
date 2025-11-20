import { onMounted, onUnmounted } from 'vue'

export const useGameLoop = (callback: (dt: number) => void) => {
    let lastTime = 0
    let animationFrameId: number | null = null

    const loop = (timestamp: number) => {
        if (!lastTime) lastTime = timestamp
        const dt = timestamp - lastTime

        // Cap dt to prevent huge jumps if tab is inactive
        if (dt < 1000) {
            callback(dt)
        }

        lastTime = timestamp
        animationFrameId = requestAnimationFrame(loop)
    }

    const start = () => {
        lastTime = 0
        animationFrameId = requestAnimationFrame(loop)
    }

    const stop = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
            animationFrameId = null
        }
    }

    onMounted(() => {
        start()
    })

    onUnmounted(() => {
        stop()
    })

    return { start, stop }
}
