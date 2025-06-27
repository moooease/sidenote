import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // This should be outside `theme.extend`
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Departure Mono"', 'monospace']
            },
            colors: {
                amber: '#ffa133', // Accents and highlights
                pumpkin: '#e47b1a', // Hover states
                flux: '#c8be50', // Special highlights
                foam: '#bccabb', // Selection in light mode
                enamel: '#eeeeee', // Light mode background
                cement: '#c0c0c0', // Secondary light bg
                aluminum: '#cccccc', // Tertiary light bg
                ash: '#8e8e8e', // Light border
                mud: '#8a8a6f', // Muted light text
                clay: '#6c6c58', // Muted dark text
                smoke: '#666666', // Secondary light text
                dark: '#444444', // Primary light text
                soot: '#333333', // Secondary dark bg
                carbon: '#222222', // Main dark bg
                black: '#141414' // Special dark
            }
        }
    },
    plugins: []
};

export default config;
