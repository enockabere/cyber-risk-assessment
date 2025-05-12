import { type Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#14532d",
          light: "#22c55e",
          dark: "#0f291e",
        },
        accent: {
          DEFAULT: "#0ea5e9",
          dark: "#0369a1",
        },
        background: "#f9fafb",
        foreground: "#1e293b",
        muted: "#64748b",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
