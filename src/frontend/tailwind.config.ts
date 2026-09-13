import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          panel: 'rgb(var(--panel) / <alpha-value>)',
          card: 'rgb(var(--card) / <alpha-value>)',
          border: 'rgb(var(--border) / <alpha-value>)',
        },
        brand: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
          light: 'rgb(var(--positive) / <alpha-value>)',
        },
      },
      textColor: {
        white: 'rgb(var(--foreground) / <alpha-value>)',
        gray: {
          100: 'rgb(var(--foreground) / <alpha-value>)',
          200: 'rgb(var(--foreground) / <alpha-value>)',
          300: 'rgb(var(--secondary) / <alpha-value>)',
          400: 'rgb(var(--muted) / <alpha-value>)',
          500: 'rgb(var(--muted) / <alpha-value>)',
        },
        emerald: {
          300: 'rgb(var(--positive) / <alpha-value>)',
          400: 'rgb(var(--positive) / <alpha-value>)',
        },
        rose: { 400: 'rgb(var(--negative) / <alpha-value>)' },
        red: { 400: 'rgb(var(--negative) / <alpha-value>)' },
        amber: { 400: 'rgb(var(--warning) / <alpha-value>)' },
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
