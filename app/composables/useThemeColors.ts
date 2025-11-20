/**
 * Composable for Thủy Mặc theme colors
 * Returns Tailwind CSS class names instead of hex colors
 */

export function useThemeColors() {
  // Element colors - return Tailwind classes
  function getElementColorClass(element?: string): string {
    const elementMap: Record<string, string> = {
      metal: 'text-element-metal',
      wood: 'text-element-wood',
      water: 'text-element-water',
      fire: 'text-element-fire',
      earth: 'text-element-earth',
      neutral: 'text-ink-light',
      none: 'text-ink-light'
    }
    return elementMap[element || 'neutral'] || 'text-ink-light'
  }

  // Tier colors - return Tailwind classes
  function getTierColorClass(tier?: string | number): string {
    const tierMap: Record<string, string> = {
      'common': 'text-ink-light',
      'uncommon': 'text-element-wood',
      'rare': 'text-element-water',
      'epic': 'text-element-fire',
      'legendary': 'text-gold',
      '1': 'text-ink-light',
      '2': 'text-element-wood',
      '3': 'text-element-water',
      '4': 'text-element-fire',
      '5': 'text-gold'
    }
    return tierMap[String(tier)] || 'text-ink'
  }

  // Background variants for tier
  function getTierBgClass(tier?: string | number): string {
    const tierMap: Record<string, string> = {
      'common': 'bg-ink-light',
      'uncommon': 'bg-element-wood',
      'rare': 'bg-element-water',
      'epic': 'bg-element-fire',
      'legendary': 'bg-gold',
      '1': 'bg-ink-light',
      '2': 'bg-element-wood',
      '3': 'bg-element-water',
      '4': 'bg-element-fire',
      '5': 'bg-gold'
    }
    return tierMap[String(tier)] || 'bg-ink'
  }

  // Border variants for tier
  function getTierBorderClass(tier?: string | number): string {
    const tierMap: Record<string, string> = {
      'common': 'border-ink-light',
      'uncommon': 'border-element-wood',
      'rare': 'border-element-water',
      'epic': 'border-element-fire',
      'legendary': 'border-gold',
      '1': 'border-ink-light',
      '2': 'border-element-wood',
      '3': 'border-element-water',
      '4': 'border-element-fire',
      '5': 'border-gold'
    }
    return tierMap[String(tier)] || 'border-ink'
  }

  // Element names in Vietnamese
  function getElementName(element?: string): string {
    const elementMap: Record<string, string> = {
      metal: 'Kim',
      wood: 'Mộc',
      water: 'Thủy',
      fire: 'Hỏa',
      earth: 'Thổ',
      neutral: 'Trung Tính',
      none: 'Không'
    }
    return elementMap[element || 'neutral'] || 'Không xác định'
  }

  // Tier names in Vietnamese
  function getTierName(tier?: string | number): string {
    const tierMap: Record<string, string> = {
      'common': 'Phổ Thông',
      'uncommon': 'Không Phổ Biến',
      'rare': 'Hiếm',
      'epic': 'Sử Thi',
      'legendary': 'Huyền Thoại',
      '1': 'Cấp 1',
      '2': 'Cấp 2',
      '3': 'Cấp 3',
      '4': 'Cấp 4',
      '5': 'Cấp 5'
    }
    return tierMap[String(tier)] || 'Không xác định'
  }

  return {
    getElementColorClass,
    getTierColorClass,
    getTierBgClass,
    getTierBorderClass,
    getElementName,
    getTierName
  }
}
