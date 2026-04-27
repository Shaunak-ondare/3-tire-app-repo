/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          900: "#0b0b18",
          800: "#0f0f1a",
          700: "#13132a",
          600: "#1a1a2e",
          500: "#1e1e3f",
        },
        card: "#16213e",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #ea580c 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(219,39,119,0.08))",
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.25)",
        "glow-pink": "0 0 20px rgba(219, 39, 119, 0.2)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "60%": { transform: "scale(1.05)", opacity: 0.9 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
