/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // AgriRelief SL Palette
                'agri-green': {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#22c55e',
                    700: '#15803d',
                    900: '#14532d',
                },
                'earth-brown': {
                    100: '#f5f5f4',
                    500: '#78716c',
                    900: '#44403c',
                },
                'alert-red': {
                    500: '#ef4444',
                    700: '#b91c1c',
                }
            }
        },
    },
    plugins: [],
}
