/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    light: '#34D399', // Emerald 400
                    DEFAULT: '#10B981', // Emerald 500
                    dark: '#059669', // Emerald 600
                },
                secondary: {
                    light: '#1F2937', // Gray 800
                    DEFAULT: '#111827', // Gray 900
                    dark: '#030712', // Gray 950
                },
                accent: '#6EE7B7', // Emerald 300
                background: '#F9FAFB', // Gray 50
                surface: '#FFFFFF',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 15px rgba(16, 185, 129, 0.3)',
            }
        },
    },
    plugins: [],
}
