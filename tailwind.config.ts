import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      display: ["var(--grandstander)", "-apple-system", "san-serif"],
    },
    screens: {
      sm: "480px",
      md: "768px",
    },
    container: {
      center: true,
      padding: "20px",
      screens: {
        sm: "480px",
        md: "768px",
      },
    },
    extend: {
      colors: {
        primary: "#fedb8b",
      },
    },
  },
  plugins: [],
};
export default config;
