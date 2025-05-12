import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
