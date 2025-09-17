import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-fire': 'var(--gradient-fire)',
        'gradient-ember': 'var(--gradient-ember)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-arena': 'var(--gradient-arena)',
        'texture-stone': 'var(--texture-stone)',
      },
      boxShadow: {
        'fire': 'var(--shadow-fire)',
        'gold': 'var(--shadow-gold)',
        'arena': 'var(--shadow-arena)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "ember-rise": {
          "0%": { 
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: "1"
          },
          "100%": { 
            transform: "translateY(-100px) translateX(10px) scale(0.5)",
            opacity: "0"
          },
        },
        "fire-dance": {
          "0%, 100%": { 
            transform: "scaleX(1) scaleY(1)",
          },
          "33%": { 
            transform: "scaleX(1.1) scaleY(0.9)",
          },
          "66%": { 
            transform: "scaleX(0.9) scaleY(1.1)",
          },
        },
        "glow-pulse": {
          "0%, 100%": { 
            filter: "brightness(1) drop-shadow(0 0 10px hsl(15 85% 55% / 0.5))"
          },
          "50%": { 
            filter: "brightness(1.2) drop-shadow(0 0 20px hsl(15 85% 55% / 0.8))"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flicker": "flicker 2s ease-in-out infinite",
        "ember-rise": "ember-rise 3s linear infinite",
        "fire-dance": "fire-dance 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
