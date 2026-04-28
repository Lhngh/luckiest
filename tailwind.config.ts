import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          midnight: "#35285a",
          moon: "#fff6f5",
          starlight: "#6f5b84",
          aurora: "#c8b6ff",
          glow: "#d780a8",
          pine: "#5f4b7b",
          blush: "#f8cde0",
          rose: "#f4a8cb",
          lilac: "#d8c7ff",
          mist: "#fff0f5",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        paper: "0 22px 60px rgba(92, 64, 121, 0.18)",
        glow: "0 0 34px rgba(255, 204, 228, 0.42)",
      },
      animation: {
        shimmer: "shimmer 7s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        fadeIn: "fadeIn 700ms ease-out both",
        twinkle: "twinkle 5.2s ease-in-out infinite",
        breathe: "breathe 6s ease-in-out infinite",
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.32), transparent 32%), radial-gradient(circle at 86% 10%, rgba(255,218,236,0.28), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))",
      },
    },
  },
  plugins: [],
};

export default config;
