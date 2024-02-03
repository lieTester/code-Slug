import type { Config } from "tailwindcss";

const config: Config = {
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         screens: {
            smM: { raw: "(max-width: 640px)" },
            // => custom for maxwidth use to remove main nav bar after width is lesser than 640px

            sm: "540px",
            // => @media (min-width: 640px) { ... }

            md: "668px",
            // => @media (min-width: 768px) { ... }

            lg: "924px",
            // => @media (min-width: 1024px) { ... }

            xl: "1180px",
            // => @media (min-width: 1280px) { ... }

            "2xl": "1436px",
            // => @media (min-width: 1536px) { ... }
         },
         fontFamily: {
            caglisotro: ["Cagliostro", "sans-serif"],
            baloo: ["baloo2"],
            sofiaPro: ["sofiapro", "sans-serif"],
            openSans: ["pt sans", "sans-serif"],
         },
         colors: {
            backg1: "var(--backg-cl1)",
            backg2: "var(--backg-cl2)",
            front1: "var(--front-cl1)",
            front2: "var(--front-cl2)",
            bordr1: "var(--bordr-cl1)",
            secod1: "var(--secod-cl1)",
            secod2: "var(--secod-cl2)",
            secod3: "var(--secod-cl3)",
         },
         textColor: {
            prim1: "var(--text-prim1)",
            prim2: "var(--text-prim2)",
            seco1: "var(--text-seco1)",
            seco2: "var(--text-seco2)",
            extra1: "var(--text-extra2)",
            extra2: "var(--text-extra2)",
            hard: "var(--hard)",
            medium: "var(--medium)",
            easy: "var(--easy)",
         },
         backgroundColor: {
            backg1: "var(--backg-cl1)",
            backg2: "var(--backg-cl2)",
            front1: "var(--front-cl1)",
            front2: "var(--front-cl2)",
            secod1: "var(--secod-cl1)",
            secod2: "var(--secod-cl2)",
            secod3: "var(--secod-cl3)",
            glass: "rgba(255, 255, 255, 0.1)", // Semi-transparent white
         },
         backdropFilter: {
            none: "none",
            blur: "blur(20px)",
         },
         boxShadow: {
            around: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow for depth
         },
      },
   },
   plugins: [],
};
export default config;
