import type { Config } from "tailwindcss";

export default {
    content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
