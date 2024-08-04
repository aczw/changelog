import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,md,mdx,ts,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    fontFamily: {
      mono: ["Berkeley Mono Variable", ...defaultTheme.fontFamily.mono],
    },
    fontWeight: {
      100: "100",
      200: "200",
      300: "300",
      400: "400",
      500: "500",
    },
    extend: {
      maxWidth: {
        content: "902.5px",
      },
      colors: {
        sweater: {
          1: "#EAE9FF",
          2: "#D6D3FF",
          3: "#C3BDFF",
          4: "#ADA6FF",
          5: "#9A91FE",
          6: "#6B62CB",
          7: "#484390",
          8: "#312D65",
          9: "#1D193D",
          10: "#0A0919",
        },
      },
      screens: {
        content: "902.5px",
      },
    },
  },
};

export default config;
