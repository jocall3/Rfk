/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./*.{js,ts,jsx,tsx,html,md}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        matrix: {
          black: '#050505',
          darker: '#0a0a0a',
          dark: '#121212',
          gray: '#1a1a1a',
          muted: '#333333',
          green: {
            glow: '#00FF41',
            bright: '#00FF33',
            medium: '#008F11',
            dark: '#003B00',
            deep: '#0D0208',
          },
          red: {
            alert: '#FF003C',
            warning: '#E50914',
            dark: '#5A0000',
          },
          yellow: {
            toxic: '#CCFF00',
            warn: '#FFCC00',
            dark: '#665500',
          },
        },
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 5px #00FF41, 0 0 15px rgba(0, 255, 65, 0.3)',
        'neon-red': '0 0 5px #FF003C, 0 0 15px rgba(255, 0, 60, 0.3)',
        'neon-yellow': '0 0 5px #CCFF00, 0 0 15px rgba(204, 255, 0, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(0, 255, 65, 0.15)',
      },
      backgroundImage: {
        'terminal-gradient': 'radial-gradient(circle, rgba(13,2,8,1) 0%, rgba(5,5,5,1) 100%)',
        'scanlines': 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      },
      backgroundSize: {
        'scanlines-size': '100% 4px, 6px 100%',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 12s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-green': {
          'text-shadow': '0 0 4px #00FF41, 0 0 10px rgba(0, 255, 65, 0.5)',
        },
        '.text-shadow-red': {
          'text-shadow': '0 0 4px #FF003C, 0 0 10px rgba(255, 0, 60, 0.5)',
        },
        '.text-shadow-yellow': {
          'text-shadow': '0 0 4px #CCFF00, 0 0 10px rgba(204, 255, 0, 0.5)',
        },
      })
    },
  ],
}