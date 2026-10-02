import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0D",
        gold: "#D6B88D",
        ivory: "#F5F2ED",
        smoke: "#232323",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        script: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
