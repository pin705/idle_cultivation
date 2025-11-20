import { ELEMENT_NAMES, WORLD_CYCLES, WORLD_EVENTS } from '../../shared/constants'
import type { Element } from '../../shared/constants'

/**
 * Get display name for an element
 */
export function getElementName(element?: string | null): string {
  if (!element || element === 'none') return 'Vô'
  return ELEMENT_NAMES[element as Element] || element
}

/**
 * Get display name with emoji for an element
 */
export function getElementDisplayName(element?: string | null): string {
  if (!element || element === 'none') return 'Vô'
  const emojis: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    wood: '🌿',
    metal: '⚙️',
    earth: '🪨'
  }
  const emoji = emojis[element] || ''
  const name = ELEMENT_NAMES[element as Element] || element
  return emoji ? `${emoji} ${name}` : name
}

/**
 * Get CSS color class for an element
 */
export function getElementColorClass(element?: string | null): string {
  if (!element) return 'element-none'
  const classes: Record<string, string> = {
    metal: 'element-metal',
    wood: 'element-wood',
    water: 'element-water',
    fire: 'element-fire',
    earth: 'element-earth',
    none: 'element-none'
  }
  return classes[element] || 'element-none'
}

/**
 * Get display name for a world cycle
 */
export function getCycleName(cycle: string): string {
  // Check if it's a world cycle
  if (cycle in WORLD_CYCLES) {
    return WORLD_CYCLES[cycle as keyof typeof WORLD_CYCLES].name
  }
  // Check if it's an element name
  if (cycle in ELEMENT_NAMES) {
    return ELEMENT_NAMES[cycle as keyof typeof ELEMENT_NAMES]
  }
  return 'Không Xác Định'
}

/**
 * Get display name for a world event
 */
export function getEventName(eventType?: string | null): string {
  if (!eventType) return ''
  if (eventType in WORLD_EVENTS) {
    return WORLD_EVENTS[eventType as keyof typeof WORLD_EVENTS].name
  }
  return 'Sự Kiện Không Xác Định'
}
