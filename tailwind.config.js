/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['Orbitron', 'JetBrains Mono', 'monospace'],
        display: ['Press Start 2P', 'Orbitron', 'sans-serif'],
      },
      colors: {
        neon: {
          cyan: '#00f5ff',
          pink: '#ff00aa',
          green: '#39ff14',
          purple: '#bf00ff',
          orange: '#ff6b00',
        },
        dark: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a26',
          600: '#252533',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px currentColor)' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 16px currentColor)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.neon.cyan"), 0 0 20px theme("colors.neon.cyan"), 0 0 40px theme("colors.neon.cyan")',
        'neon-pink': '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
        'inner-glow': 'inset 0 0 20px rgba(0, 245, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
