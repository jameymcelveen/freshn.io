import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                fresh: {
                    emerald: "#10b981",
                    slate: "#020617",
                },
            },
        },
    },
    plugins: [],
};
export default config;