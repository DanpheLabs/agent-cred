import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Chakra UI color system
        chakra: {
          gray: {
            50: "hsl(var(--chakra-gray-50))",
            100: "hsl(var(--chakra-gray-100))",
            200: "hsl(var(--chakra-gray-200))",
            300: "hsl(var(--chakra-gray-300))",
            400: "hsl(var(--chakra-gray-400))",
            500: "hsl(var(--chakra-gray-500))",
            600: "hsl(var(--chakra-gray-600))",
            700: "hsl(var(--chakra-gray-700))",
            800: "hsl(var(--chakra-gray-800))",
            900: "hsl(var(--chakra-gray-900))",
          },
          blue: {
            50: "hsl(var(--chakra-blue-50))",
            100: "hsl(var(--chakra-blue-100))",
            200: "hsl(var(--chakra-blue-200))",
            300: "hsl(var(--chakra-blue-300))",
            400: "hsl(var(--chakra-blue-400))",
            500: "hsl(var(--chakra-blue-500))",
            600: "hsl(var(--chakra-blue-600))",
            700: "hsl(var(--chakra-blue-700))",
            800: "hsl(var(--chakra-blue-800))",
            900: "hsl(var(--chakra-blue-900))",
          },
          green: {
            400: "hsl(var(--chakra-green-400))",
            500: "hsl(var(--chakra-green-500))",
          },
          red: {
            400: "hsl(var(--chakra-red-400))",
            500: "hsl(var(--chakra-red-500))",
          },
          yellow: {
            400: "hsl(var(--chakra-yellow-400))",
          },
          purple: {
            400: "hsl(var(--chakra-purple-400))",
          }
        },
        
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;