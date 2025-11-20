import { getElementMultiplier, calcTechniqueMultiplier, calcEquipmentBonus, WORLD_CYCLES, WORLD_EVENTS, getSectRank } from '../../shared/constants'

/**
 * Calculate the total Qi cultivation rate for a player
 * This consolidates all multipliers and bonuses into a single calculation
 */
export function calculateCultivationRate(player: any): { rate: number, mult: number, add: number } {
    // Base rate
    const baseRate = player.cultivation?.baseRate || 1
    
    // Element multiplier (cultivation element vs world element)
    const elementMult = getElementMultiplier(
        player.cultivation?.element || 'none',
        player.world?.element || 'none'
    )
    
    // Technique multiplier (active + passive techniques)
    const tech = calcTechniqueMultiplier(
        player.cultivation?.activeTechnique,
        player.techniques?.equippedPassives || []
    )
    
    // Equipment bonus
    const eq = calcEquipmentBonus(player.equipment || [])
    
    // World cycle multiplier
    let cycleMult = 1.0
    if (player.world?.currentCycle && player.world.currentCycle in WORLD_CYCLES) {
        cycleMult = WORLD_CYCLES[player.world.currentCycle as keyof typeof WORLD_CYCLES].effect.qiMult || 1.0
    }
    
    // World event multiplier and additive bonus
    let eventMult = 1.0
    let eventAdd = 0
    if (player.world?.activeEvent?.type && player.world.activeEvent.type in WORLD_EVENTS) {
        const now = Date.now()
        const eventEnds = player.world.activeEvent.endsAt ? new Date(player.world.activeEvent.endsAt).getTime() : 0
        if (now < eventEnds) {
            const eventDef = WORLD_EVENTS[player.world.activeEvent.type as keyof typeof WORLD_EVENTS]
            eventMult = eventDef.effect.qiMult || 1.0
            eventAdd = eventDef.effect.qiAdd || 0
        }
    }
    
    // Ascension bonuses
    let ascensionMult = 1.0
    if (player.ascension?.perks) {
        const eternalQiPerk = player.ascension.perks.find((p: any) => p.perkId === 'eternal_qi')
        if (eternalQiPerk) {
            ascensionMult *= (1 + 0.1 * eternalQiPerk.level)
        }
    }
    
    // Sect rank bonus
    let sectMult = 1.0
    if (player.sect?.contribution !== undefined) {
        const rank = getSectRank(player.sect.contribution)
        sectMult = rank.benefits.qiBonus
    }
    
    // Calculate total multiplier and additive bonus
    const totalMult = elementMult * tech.mult * eq.mult * cycleMult * eventMult * ascensionMult * sectMult
    const totalAdd = (tech.add || 0) + (eq.add || 0) + eventAdd
    
    // Calculate final rate
    const rate = (baseRate * totalMult) + totalAdd
    
    return { rate, mult: totalMult, add: totalAdd }
}

/**
 * Calculate max possible Qi gain for anti-cheat validation
 */
export function calculateMaxPossibleQiGain(player: any, timeDiffSeconds: number): number {
    const { rate } = calculateCultivationRate(player)
    // Add a small buffer (5 qi) for rounding and network latency
    return Math.floor(timeDiffSeconds * rate + 5)
}
