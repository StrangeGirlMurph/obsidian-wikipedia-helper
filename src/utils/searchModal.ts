import { App, Editor, Notice, SuggestModal } from "obsidian";
import { languages } from "../utils/languages";
import { getWikipediaArticleDescriptions, getWikipediaArticles } from "../API/wikipedia";
import { WikipediaHelperSettings } from "../settings";
import { getWikiArticles } from "../API/mediawiki";
import { Wiki } from "src/main";

export interface Article {
	title: string;
	url: string;
	languageCode: string;
}

export interface ArticleWithDescription extends Article {
	description: string | null;
}

export abstract class SearchModal extends SuggestModal<Article> {
	settings: WikipediaHelperSettings;
	editor: Editor | undefined;
	wiki: Wiki;

	constructor(app: App, settings: WikipediaHelperSettings, wiki: Wiki, editor?: Editor) {
		super(app);
		this.settings = settings;
		this.wiki = wiki;
		this.editor = editor;
		this.setPlaceholder(`Search ${wiki}...`);
	}

	onOpen(): void {
		super.onOpen();
		if (this.settings.autoSearchNoteTitle) {
			const fileName = this.app.workspace.getActiveFile()?.basename;
			if (fileName && fileName != "") this.inputEl.value = fileName;
		}
		if (this.editor) {
			const selection = this.editor.getSelection();
			if (selection.trim() != "") this.inputEl.value = selection;
		}
		//@ts-ignore - private method
		super.updateSuggestions();
	}

	renderSuggestion(article: Article | ArticleWithDescription, el: HTMLElement) {
		el.createEl("div", { text: article.title });
		if ("description" in article)
			el.createEl("small", {
				text: article.description || article.url.slice(8),
			});
	}

	async getSuggestions(query: string): Promise<Article[] | ArticleWithDescription[]> {
		if (!window.navigator.onLine) {
			this.emptyStateText = "You have to be connected to the internet to search!";
			return [];
		}

		let languageCode = this.settings.language;

		const queryArgs = query.split(":", 2);
		if (queryArgs.length > 1) {
			const queryCode = queryArgs[0]?.trim();
			const queryText = queryArgs[1]?.trim();
			if (queryCode && Object.keys(languages).includes(queryCode) && queryCode !== languageCode) {
				languageCode = queryCode;
				query = queryText;
			}
		}

		if (query.trim() === "") {
			this.emptyStateText = "What are you waiting for? Start typing :)";
			return [];
		}
		this.emptyStateText = "No results found.";

		let searchResponses: Article[] | null = null;

		if (this.wiki === "Wikipedia") {
			searchResponses = await getWikipediaArticles(query, languageCode, this.settings.searchLimit);
		} else {
			searchResponses = await getWikiArticles(query, languageCode, this.wiki, this.settings.searchLimit);
		}

		if (searchResponses == null) {
			this.emptyStateText = `Couldn't fetch any search results. Are you sure that ${this.wiki} supports this language?`;
			return [];
		} else if (searchResponses.length === 0) {
			return [];
		}

		if (this.settings.autoInsertSingleResponseQueries && searchResponses.length === 1) {
			this.close();
			this.onChooseSuggestion(searchResponses[0]);
		}

		let descriptions: (string | null)[] | null = [];

		if (this.wiki == "Wikipedia") {
			descriptions = await getWikipediaArticleDescriptions(
				searchResponses?.map((a) => a.title) ?? [],
				languageCode
			);
		}

		if (descriptions == null) {
			new Notice("Couldn't fetch any article descriptions.");
			descriptions = new Array(searchResponses.length).fill(null);
		}

		if (descriptions.length === 0) {
			return searchResponses;
		} else {
			return searchResponses.map((article, index) => ({
				description: descriptions[index],
				...article,
			}));
		}
	}

	abstract onChooseSuggestion(article: Article): void;
}
