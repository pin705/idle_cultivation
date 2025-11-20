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
                // Ink Wash theme colors
                'ink-black': '#1a1a1a',
                'paper-white': '#fffef9',
                'seal-red': '#8b0000',
                'gold': '#d4af37',
                
                // Extended palette
                'aged-paper': '#f5f4ef',
                'dark-paper': '#eae8e0',
                'ink-gray': '#4a4a4a',
                'light-ink': '#6b7280',
            },
            fontFamily: {
                serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
                sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['ui-monospace', '"SF Mono"', 'monospace'],
            },
            borderRadius: {
                'ink': '0.25rem',
            },
        },
    },
    plugins: [],
}
