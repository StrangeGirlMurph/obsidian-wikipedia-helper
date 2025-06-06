import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Obsidian Wikipedia Helper",
	description: "A better Wikipedia plugin: Search, link, insert and open Wikipedia/Wikimedia articles.",
	lang: "en-US",
	base: "/obsidian-wikipedia-helper/",

	themeConfig: {
		search: {
			provider: "local",
		},
		nav: [
			{ text: "Getting Started", link: "/getting-started" },
			{ text: "Settings", link: "/settings" },
			{ text: "Commands", link: "/commands" },
		],
		outline: [2, 3],
		sidebar: [
			{
				text: "",
				items: [
					{ text: "Getting Started", link: "/getting-started" },
					{ text: "Installation", link: "/installation" },
					{ text: "Settings", link: "/settings" },
					{ text: "Commands", link: "/commands" },
					{ text: "Help", link: "/help" },
					{ text: "Roadmap", link: "/roadmap" },
					{ text: "Changelog", link: "/changelog" },
					{ text: "Support", link: "/support" },
					{ text: "License", link: "/license" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper" }],

		editLink: {
			pattern: "https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/edit/master/docs/:path",
		},
	},
});
