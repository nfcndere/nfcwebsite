import type { Config } from "tailwindcss";
import { NFC_THEME } from "./src/constants/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nfc: {
          green: NFC_THEME.colors.green,
          yellow: NFC_THEME.colors.yellow,
          neutral: NFC_THEME.colors.neutral,
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Source Sans 3", "Inter", "sans-serif"],
        body: ["var(--font-sans)", "Source Sans 3", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Oswald", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
