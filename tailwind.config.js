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
                'ink-black': '#1a1a1a',
                'paper-white': '#f0f0f0',
                'seal-red': '#b22222',
                'jade-green': '#00a86b',
            },
            fontFamily: {
                serif: ['"Noto Serif SC"', 'serif'],
            },
        },
    },
    plugins: [],
}
