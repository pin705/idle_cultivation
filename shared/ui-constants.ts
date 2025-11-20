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

// Typography Constants
export const TYPOGRAPHY = {
  fontFamily: {
    primary: '"Noto Serif SC", "Source Han Serif SC", serif',
    secondary: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, "SF Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

// Spacing Constants
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}

// Border Radius
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  full: '9999px',
}

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
}

// Transitions
export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// Z-Index
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
}

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Icon Mapping (text-based, minimalist - no emojis)
export const ICONS = {
  // Tabs
  cultivation: '⚡',
  equipment: '⚔',
  techniques: '📖',
  sect: '🏛',
  missions: '📋',
  shop: '🏪',
  achievements: '🏆',
  ascension: '✨',
  
  // Resources
  qi: '💫',
  spiritStones: '💎',
  herbs: '🌿',
  
  // Equipment slots
  weapon: '⚔',
  armor: '🛡',
  helmet: '👑',
  boots: '👢',
  accessory: '💍',
  talisman: '📿',
  
  // Actions
  close: '×',
  back: '←',
  forward: '→',
  up: '↑',
  down: '↓',
  check: '✓',
  settings: '⚙',
  
  // Elements
  metal: '⚙',
  wood: '🌳',
  water: '💧',
  fire: '🔥',
  earth: '🗻',
  
  // Stats
  body: '💪',
  spirit: '🧠',
  talent: '⭐',
}

// UI Text Constants (Vietnamese)
export const UI_TEXT = {
  // Common
  confirm: 'Xác nhận',
  cancel: 'Hủy',
  close: 'Đóng',
  save: 'Lưu',
  delete: 'Xóa',
  settings: 'Cài đặt',
  
  // Player
  player: 'Tu Sĩ',
  
  // Tabs
  cultivation: 'Tu Luyện',
  equipment: 'Trang Bị',
  techniques: 'Kỹ Năng',
  sect: 'Tông Môn',
  missions: 'Nhiệm Vụ',
  shop: 'Cửa Hàng',
  achievements: 'Thành Tựu',
  ascension: 'Thăng Thiên',
  
  // Stats
  realm: 'Cảnh Giới',
  qi: 'Linh Khí',
  resources: 'Tài Nguyên',
  attributes: 'Thuộc Tính',
  body: 'Thể Chất',
  spirit: 'Thần Thức',
  talent: 'Thiên Phú',
  
  // Theme settings
  themeSettings: 'Cài Đặt Chủ Đề',
  selectTheme: 'Chọn chủ đề',
  otherSettings: 'Cài Đặt Khác',
  moreSettingsSoon: 'Thêm cài đặt sẽ có sớm...',
}
