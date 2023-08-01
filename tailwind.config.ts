import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        lg: "992px",
        xl: "1200px",
      },
    },
  },
  plugins: [],
} satisfies Config;
