import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default [
	{
		ignores: ["node_modules/", "docs/", "main.js", "*.mjs"],
	},
	js.configs.recommended,
	...obsidianmd.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				project: "./tsconfig.json",
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
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "off",
		},
	},
];
