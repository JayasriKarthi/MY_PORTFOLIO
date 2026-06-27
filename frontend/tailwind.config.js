/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#070A16",
          900: "#0A0E1F",
          800: "#11162C",
          700: "#1A2040",
        },
        accent: {
          purple: "#7C3AED",
          blue: "#2563EB",
          cyan: "#06B6D4",
          orange: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C3AED 0%, #2563EB 50%, #06B6D4 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.25)",
      },
    },
  },
  plugins: [],
};
