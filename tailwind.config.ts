import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: {
          DEFAULT: "#FAFAFA",
          muted: "#F4F4F5",
          hover: "#F1F1F4",
          card: "#FFFFFF",
        },
        charcoal: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#94A3B8",
          dark: "#020617",
        },
        entropia: {
          DEFAULT: "#FF6B00",
          hover: "#E85F00",
          glow: "rgba(255, 107, 0, 0.15)",
          light: "#FFF6ED",
          border: "#FFD6B3",
          dark: "#C85200",
        },
        risk: {
          low: "#10B981",
          medium: "#F59E0B",
          high: "#F97316",
          critical: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)",
        glow: "0 8px 24px -4px rgba(255, 107, 0, 0.25)",
        "glow-lg": "0 14px 36px -6px rgba(255, 107, 0, 0.35)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
