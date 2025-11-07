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

	async onChooseSuggestion(article: Article) {
		if (
			// @ts-expect-error undocumented
			this.app.setting.pluginTabs.find((e) => e.id == "webviewer") &&
			Platform.isDesktopApp
		) {
			this.app.workspace.getLeaf(this.settings.openArticleInFullscreen ? "tab" : "split").setViewState({
				type: "webviewer",
				active: true,
				state: { url: article.url },
			});
		} else if (!this.settings.showedWebviewerMessage && Platform.isDesktopApp) {
			const modal = new Modal(this.app);
			modal.onClose = () => this.onChooseSuggestion(article);
			modal.titleEl.setText("Wikipedia Helper plugin ♥ Web viewer plugin");
			modal.contentEl.innerHTML = `The Wikipedia Helper plugin integrates with the Web viewer core plugin to enable you to open articles directly inside of Obsidian! You just need to enable it. It does the heavy lifting of loading the website itself in Obsidian. In this case the Wikipedia Helper plugin just provides the search functionality. Using the Web viewer plugin is completely optional but I highly recommend you check it out! Without it enabled all articles will be opened in your default browser. Note: This will only be shown to you once. ~ Murphy :)<br><br>
			<b>tl;dr: Enable the Web viewer plugin (Settings > Core plugins > Web viewer) to open Wiki articles directly inside of Obsidian!</b>`;
			modal.open();

			this.settings.showedWebviewerMessage = true;
			this.plugin.saveSettings();
		} else {
			window.open(article.url);
		}
	}
}
