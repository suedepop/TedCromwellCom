import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#111827",
        surface: "#1f2937",
        border: "#374151",
        ink: "#f0f0f0",
        muted: "#888888",
        accent: "#e8a030",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
