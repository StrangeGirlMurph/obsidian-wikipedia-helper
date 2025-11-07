import { Editor, Notice, Plugin, addIcon } from "obsidian";
import { LinkArticleModal } from "./commands/linkArticles";
import {
	DEFAULT_SETTINGS,
	DEFAULT_TEMPLATE,
	WikipediaHelperSettings,
	WikipediaHelperSettingTab,
} from "./settings";
import { OpenArticleModal } from "./commands/openArticles";
import { wikipediaIcon } from "./utils/wikipediaIcon";
import { CreateArticleNoteModal } from "./commands/createArticleNotes";

// Missing Commons and Wikidata
export type Wiki =
	| "Wikipedia"
	| "Wiktionary"
	| "Wikibooks"
	| "Wikiquote"
	| "Wikiversity"
	| "Wikivoyage"
	| "Wikisource"
	| "Wikinews";

export const wikilist: Wiki[] = [
	"Wikipedia",
	"Wiktionary",
	"Wikibooks",
	"Wikiquote",
	"Wikiversity",
	"Wikivoyage",
	"Wikisource",
	"Wikinews",
];

export default class WikipediaHelperPlugin extends Plugin {
	settings: WikipediaHelperSettings;

	async onload() {
		console.log("Loading Wikipedia Helper plugin");

		await this.loadSettings();

		this.addCommand({
			id: "create-wikipedia-article-note",
			name: "Create Wikipedia Article Note",
			callback: () => {
				if (this.settings.templates.filter((template) => template.createNote).length === 0) {
					new Notice("To use this command you have to create a note template first!");
					return;
				}
				new CreateArticleNoteModal(this.app, this.settings, "Wikipedia").open();
			},
		});

		addIcon("wikipedia", wikipediaIcon);
		this.addRibbonIcon("wikipedia", "Open Article", () =>
			new OpenArticleModal(this, this.app, this.settings, "Wikipedia").open()
		);

		for (const wiki of wikilist) {
			this.addCommand({
				id: `link-${wiki.toLowerCase()}-article`,
				name: `Link ${wiki} Article`,
				editorCallback: (editor: Editor) =>
					new LinkArticleModal(this.app, this.settings, wiki, editor).open(),
			});

			this.addCommand({
				id: `open-${wiki.toLowerCase()}-article`,
				name: `Open ${wiki} Article`,
				callback: () =>
					new OpenArticleModal(
						this,
						this.app,
						this.settings,
						wiki,
						this.app.workspace.activeEditor?.editor
					).open(),
			});
		}

		this.addSettingTab(new WikipediaHelperSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		// Data migration
		if ("defaultTemplate" in settings) {
			settings.templates.unshift(
				Object.assign(DEFAULT_TEMPLATE, { templateString: settings.defaultTemplate })
			);
			Object.keys(settings).forEach((key) => {
				if (!(key in DEFAULT_SETTINGS)) delete settings[key];
			});
		}

		this.settings = settings;
		this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
