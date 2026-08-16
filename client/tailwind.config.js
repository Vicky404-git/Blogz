/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['VT323', 'monospace'],
        sans: ['VT323', 'monospace'],
      },
      colors: {
        'term-bg': '#0a0a0a',
        'term-card': '#16161e',
        'term-border': '#24283b',
        'term-text': '#a9b1d6',
        'term-dim': '#565f89',
        'term-bright': '#c0caf5',
        'term-accent': '#9ece6a',
      },
      boxShadow: {
        'term-glow': '0px 0px 12px rgba(158, 206, 106, 0.35)',
      },
    },
  },
  plugins: [],
}
