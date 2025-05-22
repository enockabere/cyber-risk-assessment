import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // indigo-600
          light: "#6366f1", // indigo-500
          dark: "#312e81", // indigo-900
          fg: "#eef2ff", // text on dark
          soft: "#e0e7ff", // indigo-100
          hover: "#4338ca", // indigo-700
        },
        card: "#f8fafc", // light gray-blue
        "card-foreground": "#1e293b",
        background: "#f9fafb", // soft background
        foreground: "#1e293b", // slate-800
        muted: "#64748b", // slate-500
        border: "#e5e7eb", // gray-200
        error: {
          DEFAULT: "#dc2626", // red-600
          bg: "#fef2f2", // red-50
          border: "#fca5a5", // red-300
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
