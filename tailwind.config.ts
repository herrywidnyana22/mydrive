import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)'],
      },

      boxShadow: {
        'shadow-1':
          '0px 10px 30px 0px rgba(66, 71, 97, 0.1)',
        'shadow-2':
          '0px 8px 30px 0px rgba(65, 89, 214, 0.3)',
        'shadow-3':
          '0px 8px 30px 0px rgba(65, 89, 214, 0.1)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'blink-out': {
          '0%, 70%, 100%': { opacity: '1' },
          '20%, 50%': { opacity: '0' },
        },
      },
      animation: {
        'blink-out':
          'blink-out 1.25s ease-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
