import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
    { ignores: ["node_modules", ".next", "dist"] },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: "latest",
                sourceType: "module",
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            "@next/next": nextPlugin,
        },
        rules: {
            ...pluginJs.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs["core-web-vitals"].rules,
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    }
);
