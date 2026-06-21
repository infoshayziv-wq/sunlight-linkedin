/** @type {import('tailwindcss').Config} */
// Sunlight Design System — Tailwind preset
// Usage: presets: [require('./tailwind.config.js')] in your app config,
// or use this directly as your tailwind.config.js.
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFD503",
          hover: "#F0C800",
          active: "#E0BB00",
          soft: "#FFF3B8",
          subtle: "#FFFBEB",
        },
        plum: { DEFAULT: "#540F28", hover: "#6B1434" },
        ink: { DEFAULT: "#0C0A08", strong: "#000000" },
        muted: "#435366",
        subtle: "#79797E",
        "on-dark": "#DBDAC9",
        sand: "#F4F2F0",
        warm: "#FAFAF8",
        cool: "#F5F5F7",
        raised: "#FAFAFA",
        dark: "#2E2E2E",
        line: "#E9E8E7",
        "line-strong": "#D6D3D1",
        ring: "#A8A29E",
        success: "#4F9D69",
        danger: "#DC4C3E",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Figtree", "-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.4" }],
        sm: ["14px", { lineHeight: "1.4" }],
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["20px", { lineHeight: "1.4" }],
        xl: ["24px", { lineHeight: "1.3" }],
        "2xl": ["30px", { lineHeight: "1.2" }],
        "3xl": ["36px", { lineHeight: "1.1", letterSpacing: "-0.9px" }],
        "4xl": ["48px", { lineHeight: "1.05", letterSpacing: "-1.2px" }],
        "5xl": ["60px", { lineHeight: "1.0", letterSpacing: "-1.5px" }],
      },
      borderRadius: {
        sm: "6px", md: "8px", lg: "12px", xl: "16px",
        "2xl": "24px", "3xl": "32px", pill: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(12,10,8,0.05)",
        sm: "0 1px 3px rgba(12,10,8,0.08), 0 1px 2px rgba(12,10,8,0.04)",
        md: "0 4px 12px rgba(12,10,8,0.08)",
        lg: "0 12px 32px rgba(12,10,8,0.10)",
        brand: "0 8px 24px rgba(255,213,3,0.35)",
      },
      maxWidth: { container: "1200px", "container-narrow": "760px" },
      transitionTimingFunction: {
        sl: "cubic-bezier(0.4, 0, 0.2, 1)",
        "sl-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
