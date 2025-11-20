// UI Constants - Thủy Mặc Theme System
// Shared across all components and pages

// Theme Definitions
export type ThemeName = 'ink-wash' | 'dark' | 'light'

export interface ThemeColors {
  // Primary backgrounds
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  bgPaper: string
  
  // Text colors
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textInverse: string
  
  // Border colors
  borderPrimary: string
  borderSecondary: string
  borderAccent: string
  
  // Accent colors
  accentPrimary: string
  accentSecondary: string
  accentGold: string
  
  // Semantic colors
  success: string
  warning: string
  error: string
  info: string
  
  // Element colors (for cultivation elements)
  elementMetal: string
  elementWood: string
  elementWater: string
  elementFire: string
  elementEarth: string
}

// Thủy Mặc (Ink Wash) Classic Theme
export const INK_WASH_THEME: ThemeColors = {
  bgPrimary: '#fffef9',      // Rice paper
  bgSecondary: '#f5f4ef',    // Aged paper
  bgTertiary: '#eae8e0',     // Darker paper
  bgPaper: '#fffef9',
  
  textPrimary: '#1a1a1a',    // Ink black
  textSecondary: '#4a4a4a',  // Gray ink
  textTertiary: '#6b7280',   // Light gray ink
  textInverse: '#fffef9',
  
  borderPrimary: '#1a1a1a',  // Ink stroke
  borderSecondary: '#d1d1d1',
  borderAccent: '#d4af37',   // Gold seal
  
  accentPrimary: '#8b0000',  // Seal red
  accentSecondary: '#a52a2a',
  accentGold: '#d4af37',     // Gold
  
  success: '#2d5016',        // Dark green (natural)
  warning: '#b8860b',        // Dark goldenrod
  error: '#8b0000',          // Dark red
  info: '#1e3a8a',           // Dark blue
  
  elementMetal: '#d4af37',   // Gold
  elementWood: '#2d5016',    // Forest green
  elementWater: '#1e3a8a',   // Deep blue
  elementFire: '#8b0000',    // Dark red
  elementEarth: '#8b4513',   // Saddle brown
}

// Dark Theme
export const DARK_THEME: ThemeColors = {
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  bgTertiary: '#2a2a2a',
  bgPaper: '#141414',
  
  textPrimary: '#f5f5f5',
  textSecondary: '#a0a0a0',
  textTertiary: '#707070',
  textInverse: '#0a0a0a',
  
  borderPrimary: '#3a3a3a',
  borderSecondary: '#2a2a2a',
  borderAccent: '#cd7f32',   // Bronze
  
  accentPrimary: '#b91c1c',
  accentSecondary: '#dc2626',
  accentGold: '#cd7f32',
  
  success: '#15803d',
  warning: '#ca8a04',
  error: '#b91c1c',
  info: '#1d4ed8',
  
  elementMetal: '#c0c0c0',   // Silver
  elementWood: '#15803d',
  elementWater: '#0369a1',
  elementFire: '#dc2626',
  elementEarth: '#a16207',
}

// Light Theme
export const LIGHT_THEME: ThemeColors = {
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
  bgPaper: '#fefefe',
  
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',
  
  borderPrimary: '#d1d5db',
  borderSecondary: '#e5e7eb',
  borderAccent: '#f59e0b',   // Amber
  
  accentPrimary: '#dc2626',
  accentSecondary: '#ef4444',
  accentGold: '#f59e0b',
  
  success: '#16a34a',
  warning: '#ea580c',
  error: '#dc2626',
  info: '#2563eb',
  
  elementMetal: '#fbbf24',
  elementWood: '#22c55e',
  elementWater: '#3b82f6',
  elementFire: '#ef4444',
  elementEarth: '#d97706',
}

export const THEMES: Record<ThemeName, ThemeColors> = {
  'ink-wash': INK_WASH_THEME,
  'dark': DARK_THEME,
  'light': LIGHT_THEME,
}

export const THEME_NAMES: Record<ThemeName, string> = {
  'ink-wash': 'Thủy Mặc',
  'dark': 'Tối',
  'light': 'Sáng',
}

