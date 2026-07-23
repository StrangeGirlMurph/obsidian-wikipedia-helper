import { Workspace, Modal, Platform, App, Editor } from "obsidian";
import WikipediaHelperPlugin, { Wiki } from "src/main";
import { WikipediaHelperSettings } from "src/settings";
import { Article } from "src/utils/searchModal";
import { SearchModal } from "src/utils/searchModal";

export class OpenArticleModal extends SearchModal {
	workspace: Workspace;
	plugin: WikipediaHelperPlugin;

	constructor(
		plugin: WikipediaHelperPlugin,
		app: App,
		settings: WikipediaHelperSettings,
		wiki: Wiki,
		editor?: Editor
	) {
		super(app, settings, wiki, editor);
		this.workspace = app.workspace;
		this.plugin = plugin;
	}

	onChooseSuggestion(article: Article): void {
		void this.handleChooseSuggestion(article);
	}

	private async handleChooseSuggestion(article: Article): Promise<void> {
		if (
			// @ts-expect-error undocumented
			this.app.setting.pluginTabs.find((e) => e.id == "webviewer") &&
			Platform.isDesktopApp
		) {
			await this.app.workspace.getLeaf(this.settings.openArticleInFullscreen ? "tab" : "split").setViewState({
				type: "webviewer",
				active: true,
				state: { url: article.url },
			});
		} else if (!this.settings.showedWebviewerMessage && Platform.isDesktopApp) {
			const modal = new Modal(this.app);
			modal.onClose = () => {
				void this.handleChooseSuggestion(article);
			};
			modal.titleEl.setText("Wikipedia Helper plugin ♥ Web viewer plugin");
			modal.contentEl.createEl("p", {
				text: "The Wikipedia Helper plugin integrates with the Web viewer core plugin to enable you to open articles directly inside of Obsidian! You just need to enable it. It does the heavy lifting of loading the website itself in Obsidian. In this case the Wikipedia Helper plugin just provides the search functionality. Using the Web viewer plugin is completely optional but I highly recommend you check it out! Without it enabled all articles will be opened in your default browser. Note: This will only be shown to you once. ~ Murphy :)",
			});
			modal.contentEl.createEl("br");
			modal.contentEl.createEl("strong", {
				text: "tl;dr: Enable the Web viewer plugin (Settings > Core plugins > Web viewer) to open Wiki articles directly inside of Obsidian!",
			});
			modal.open();

			this.settings.showedWebviewerMessage = true;
			await this.plugin.saveSettings();
		} else {
			window.open(article.url);
		}
	}
}
