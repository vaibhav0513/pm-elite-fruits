import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#0F4D26', dark: '#0A3719' },
        leaf: { DEFAULT: '#3E8E2F', light: '#8CC63F' },
        gold: { DEFAULT: '#C9A227', light: '#E8CF73' },
        cream: { DEFAULT: '#FBF8EE', deep: '#F2ECD7' },
        berry: '#C8283A',
        mango: '#F2A20C',
        blueberry: '#3B4F9A'
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-noto-serif-deva)', 'serif'],
        sans: ['var(--font-poppins)', 'var(--font-noto-sans-deva)', 'sans-serif'],
        hand: ['var(--font-caveat)', 'var(--font-noto-sans-deva)', 'cursive']
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        breathe: { '0%,100%': { transform: 'scale(1)', opacity: '1' }, '50%': { transform: 'scale(1.08)', opacity: '.85' } },
        rise: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } }
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        breathe: 'breathe 1.6s ease-in-out infinite',
        rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both'
      }
    }
  },
  plugins: []
};
export default config;