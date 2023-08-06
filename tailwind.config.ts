import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        lg: "992px",
        xl: "1200px",
      },
      colors: {
        gray: {
          150: "rgb(237,240,242)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
