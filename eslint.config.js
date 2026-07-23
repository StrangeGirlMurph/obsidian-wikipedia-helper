import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
	{
		ignores: ["node_modules/", "docs/", "main.js"],
	},
	js.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		files: ["src/**/*.ts", "*.mjs"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				sourceType: "module",
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			"@typescript-eslint": typescriptPlugin,
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
			"@typescript-eslint/ban-ts-comment": "off",
			"no-prototype-builtins": "off",
			"@typescript-eslint/no-empty-function": "off",
		},
	},
];
