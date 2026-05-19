import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f2ece0",
        foreground: "#1c1c1a",
        royal: {
          cream: "#f2ece0",
          linen: "#e4ddd0",
          black: "#1c1c1a",
          muted: "#6b6355",
          textMuted: "#333331",
          gold: "#b8922a",
          goldLight: "#e8c96d",
        },
      },
      fontFamily: {
        barlow: ["var(--font-barlow)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
