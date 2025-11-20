/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                // Thủy Mặc (Ink Wash) - Primary Palette
                'ink': {
                    DEFAULT: '#1a1a1a',
                    light: '#4a4a4a',
                    lighter: '#6b7280',
                },
                'paper': {
                    DEFAULT: '#fffef9',
                    aged: '#f5f4ef',
                    dark: '#eae8e0',
                },
                'seal': {
                    DEFAULT: '#8b0000',
                    light: '#a52a2a',
                },
                'gold': {
                    DEFAULT: '#d4af37',
                    dark: '#b8860b',
                },
                
                // Elements - Ngũ Hành
                'element': {
                    metal: '#d4af37',
                    wood: '#2d5016',
                    water: '#1e3a8a',
                    fire: '#8b0000',
                    earth: '#8b4513',
                },
            },
            fontFamily: {
                serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
                sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderWidth: {
                '3': '3px',
            },
            boxShadow: {
                'ink': '2px 2px 0 0 rgba(26, 26, 26, 0.15)',
                'ink-lg': '4px 4px 0 0 rgba(26, 26, 26, 0.2)',
            },
        },
    },
    plugins: [],
}
