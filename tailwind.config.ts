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
          blue: '#1B4F72',
          orange: '#E65100',
          bg: '#FAFAFA',
          bgAlt: '#F8F9F9',
        },
        conj: {
          passe: '#E8F5E9',
          present: '#E3F2FD',
          imperatif: '#FFF3E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
