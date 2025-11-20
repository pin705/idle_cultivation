import { defineStore } from 'pinia'
import { useApiAction } from '../composables/useApiAction'
import { calcTechniqueMultiplier } from '~~/shared/constants'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        name: '',
        realmPath: 'none' as any,
        realm: {
            major: 'Luyện Khí', // Luyện Khí, Trúc Cơ, Kim Đan...
            minor: 1, // Tầng 1-9
            progress: 0, // Current Qi for next level
            maxProgress: 100, // Qi needed for next level
        },
        attributes: {
            qi: 0,
            body: 0,
            spirit: 0,
            talent: 0,
        },
        resources: {
            spiritStones: 0,
            herbs: 0,
        },
        inventory: [] as any[],
        cultivation: {
            activeTechnique: 'Cơ Bản Công',
            baseRate: 1, // Qi per second
            element: 'none', // Current element focus: metal, wood, water, fire, earth, none
        },
        world: {
            element: 'none', // Current world element
            cycleTimer: 0,
            cycleDuration: 10, // 10 seconds per element for testing
        },
        logs: [] as string[],
        tribulation: { active: false, difficulty: 1, endsAt: null as any, buff: 0 } as any,
        sect: { id: null as any, contribution: 0 } as any,
        missions: [] as any[]
    }),

    getters: {
        formattedRealm: (state) => `${state.realm.major} - Tầng ${state.realm.minor}`,
        qiRate: (state) => {
            let multiplier = 1.0
            if (state.cultivation.element === state.world.element) {
                multiplier = 2.0
            } else if (state.cultivation.element !== 'none' && state.world.element !== 'none') {
                // Simple counter check for getter display
                const counters: Record<string, string> = {
                    metal: 'wood',
                    wood: 'earth',
                    earth: 'water',
                    water: 'fire',
                    fire: 'metal'
                }
                if (counters[state.world.element] === state.cultivation.element) {
                    multiplier = 0.5
                }
            }
            // Approximate technique effect for display only
            const tech = calcTechniqueMultiplier(state.cultivation.activeTechnique as any, (state as any).techniques?.equippedPassives || [])
            const rate = state.cultivation.baseRate * multiplier * (tech?.mult || 1) + (tech?.add || 0)
            return rate.toFixed(1)
        }
    },

    actions: {
        addLog(message: string) {
            const time = new Date().toLocaleTimeString()
            this.logs.unshift(`[${time}] ${message}`)
            if (this.logs.length > 50) {
                this.logs.pop()
            }
        },

        isCountered(cultivationElement: string, worldElement: string) {
            const counters: Record<string, string> = {
                metal: 'wood',
                wood: 'earth',
                earth: 'water',
                water: 'fire',
                fire: 'metal'
            }
            return counters[worldElement as keyof typeof counters] === cultivationElement
        },

        gatherQi(amount: number) {
            // Apply multiplier based on world element
            let multiplier = 1.0
            if (this.cultivation.element === this.world.element) {
                multiplier = 2.0
            } else if (this.isCountered(this.cultivation.element, this.world.element)) {
                multiplier = 0.5
            }

            const actualGain = Math.floor(amount * multiplier)
            this.attributes.qi += actualGain
        },

        async attemptBreakthrough() {
            try {
                const { call } = useApiAction()
                await this.saveGame()

                const response = await call('BREAKTHROUGH') as any

                if (response.success) {
                    if (response.player) {
                        this.loadFromData(response.player)
                    }
                    this.addLog(response.message)
                    alert(response.message)
                } else {
                    this.addLog(`Đột phá thất bại: ${response.message}`)
                    console.warn(response.message)
                }
            } catch (e) {
                console.error('Breakthrough failed', e)
            }
        },

        async findItem() {
            try {
                const { call } = useApiAction()
                const response = await call('FIND_ITEM') as any

                if (response.success) {
                    if (response.player) {
                        this.loadFromData(response.player)
                    }
                    this.addLog(response.message)
                }
            } catch (e) {
                console.error('Failed to find item', e)
            }
        },

        advanceMajorRealm() {
            // Client side prediction logic (removed/unused now as server handles it)
        },

        cycleWorldElement(dt: number) {
            this.world.cycleTimer += dt
            if (this.world.cycleTimer >= this.world.cycleDuration) {
                this.world.cycleTimer = 0
                const elements: string[] = ['metal', 'wood', 'water', 'fire', 'earth']
                const currentIndex = elements.indexOf(this.world.element)
                const nextEl = elements[(currentIndex + 1) % elements.length]
                this.world.element = nextEl || 'metal'
            }
        },

        tick(dt: number) {
            // Client-side visual updates only (for smooth animation)
            // Server handles actual cultivation calculation
            this.cycleWorldElement(dt)
        },

        async serverTick() {
            // Call server to update qi and world state authoritatively
            try {
                const { call } = useApiAction()
                const response = await call('TICK') as any
                if (response?.player) {
                    this.loadFromData(response.player)
                }
            } catch (e) {
                // Silent fail to avoid spam
            }
        },

        async saveGame() {
            try {
                const { call } = useApiAction()
                const response = await call('SAVE', {
                    qi: this.attributes.qi,
                    body: this.attributes.body,
                    spirit: this.attributes.spirit,
                    talent: this.attributes.talent,
                    resources: this.resources,
                    cultivation: this.cultivation,
                    world: this.world
                }) as any

                if (response.success) {
                    this.addLog('Đã lưu game.')
                }
            } catch (e) {
                console.error('Save failed', e)
            }
        },

        async loadGame() {
            try {
                const { call } = useApiAction()
                const response = await call('LOAD') as any
                if (response.success) {
                    this.checkOfflineProgress()
                    this.addLog('Đã tải game.')
                } else {
                    console.warn(response.message)
                }
            } catch (e) {
                console.error('Load failed', e)
            }
        },

        loadFromData(data: any) {
            this.name = data.name
            ;(this as any).realmPath = data.realmPath || (this as any).realmPath
            this.realm = data.realm
            this.attributes = data.attributes
            this.resources = data.resources || { spiritStones: 0, herbs: 0 }
            this.cultivation = data.cultivation
            this.inventory = data.inventory || []
            ;(this as any).equipment = data.equipment || []
            ;(this as any).techniques = data.techniques || { unlocked: ['basic'], equippedPassives: [] }
            this.tribulation = data.tribulation || this.tribulation
            this.sect = data.sect || this.sect
            this.missions = data.missions || this.missions
            if (data.world) {
                this.world = data.world
            }
            // Ensure progress aligns with qi to fix bar inconsistency
            if (this.realm && typeof this.attributes?.qi === 'number') {
                this.realm.progress = Math.min(this.attributes.qi, this.realm.maxProgress || 100)
            }
        },

        async checkOfflineProgress() {
            try {
                const { call } = useApiAction()
                const response = await call('OFFLINE_CALC') as any

                if (response.success) {
                    if (response.message !== 'Chưa đủ thời gian bế quan.') {
                        this.addLog(response.message)
                        alert(response.message)
                    }
                }
            } catch (e) {
                console.error('Offline check failed', e)
            }
        }
    }
})
