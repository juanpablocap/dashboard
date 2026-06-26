import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        cantina: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
        nimbus: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
        },
      },
    },
  },
  plugins: [],
}

export default config
