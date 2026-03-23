import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sahla: {
          primary: '#C17817',
          bg: '#FBF7F0',
          bgAlt: '#F5EDE3',
          dark: '#1A1A2E',
          olive: '#2D6A4F',
          blue: '#4A90B8',
          text: '#1A1A2E',
          textSecondary: '#6B6B7B',
        },
        conj: {
          passe: '#E8F0E5',
          present: '#E5EEF5',
          imperatif: '#F5EDE3',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
