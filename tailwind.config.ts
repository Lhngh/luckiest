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
        midnight: "#0f1d3d",
        moon: "#f4f0d8",
        starlight: "#fef7d8",
        aurora: "#6e87d6",
        glow: "#ffd987",
        pine: "#24324f",
        blush: "#f7d2b2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        paper: "0 18px 50px rgba(15, 29, 61, 0.16)",
        glow: "0 0 30px rgba(255, 217, 135, 0.28)",
      },
      animation: {
        shimmer: "shimmer 7s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        fadeIn: "fadeIn 700ms ease-out both",
        twinkle: "twinkle 5.2s ease-in-out infinite",
        breathe: "breathe 6s ease-in-out infinite",
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 34%), radial-gradient(circle at 80% 0%, rgba(255,248,221,0.18), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.05))",
      },
    },
  },
  plugins: [],
};

export default config;
