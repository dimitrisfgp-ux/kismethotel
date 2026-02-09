import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "warm-white": "var(--color-warm-white)",
        sand: "var(--color-sand)",
        "aegean-blue": "var(--color-aegean-blue)",
        "deep-med": "var(--color-deep-med)",
        "accent-gold": "var(--color-accent-gold)",
        charcoal: "var(--color-charcoal)",
        success: "var(--color-success)",
        error: "var(--color-error)",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sharp: "var(--radius-sharp)",
        subtle: "var(--radius-subtle)",
        card: "var(--radius-card)",
      },
      transitionTimingFunction: {
        "premium": "var(--ease-premium)",
        "anticipate": "var(--ease-anticipate)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s var(--ease-premium) forwards",
        "slide-up": "slide-up 0.5s var(--ease-premium) forwards",
        "zoom-in": "zoom-in 0.5s var(--ease-premium) forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
