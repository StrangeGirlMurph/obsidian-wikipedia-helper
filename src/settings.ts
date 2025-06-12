import { App, Notice, PluginSettingTab, SearchComponent, Setting } from "obsidian";
import { languages } from "./utils/languages";
import WikipediaHelperPlugin from "./main";
import { FolderSuggest } from "./utils/suggesters/folderSuggest";
import { FileSuggest } from "./utils/suggesters/fileSuggest";

export interface Template {
	name: string;
	templateString: string;
	createNote: boolean;
	customPath: string; // use the default if empty string
	useTemplateFile: boolean;
	templateFilePath: string;
}

const DEFAULT_TEMPLATE_STRING_INLINE = "[{title}]({url})";
const DEFAULT_TEMPLATE_STRING_NOTE = "{thumbnail}\n[{title}]({url}): {intro}";

export const DEFAULT_TEMPLATE: Template = {
	name: "Default",
	templateString: DEFAULT_TEMPLATE_STRING_INLINE,
	createNote: false,
	customPath: "",
	useTemplateFile: false,
	templateFilePath: "",
};

export interface WikipediaHelperSettings {
	language: string;
	searchLimit: number;
	thumbnailWidth: number;
	defaultNotePath: string;
	templates: Template[];
	autoInsertSingleResponseQueries: boolean;
	autoSearchNoteTitle: boolean;
	prioritizeArticleTitle: boolean;
	cleanupIntros: boolean;
	openArticleInFullscreen: boolean;
	openCreatedNotes: boolean;
	overrideFiles: boolean;
	showedWebviewerMessage: boolean;
}

export const DEFAULT_SETTINGS: WikipediaHelperSettings = {
	language: "en",
	searchLimit: 10,
	thumbnailWidth: NaN,
	defaultNotePath: "/",
	templates: [DEFAULT_TEMPLATE],
	autoInsertSingleResponseQueries: false,
	autoSearchNoteTitle: false,
	prioritizeArticleTitle: false,
	cleanupIntros: true,
	openArticleInFullscreen: false,
	openCreatedNotes: false,
	overrideFiles: false,
	showedWebviewerMessage: false,
};

export class WikipediaHelperSettingTab extends PluginSettingTab {
	plugin: WikipediaHelperPlugin;
	settings: WikipediaHelperSettings;

	constructor(app: App, plugin: WikipediaHelperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const fragment = new DocumentFragment();
		fragment.createEl("span").innerHTML =
			"Wikipedia Helper Settings > Read the <a href='https://strangegirlmurph.github.io/obsidian-wikipedia-helper/'>documentation</a>!";
		new Setting(containerEl).setName(fragment).setHeading();

		new Setting(containerEl)
			.setName("Language")
			.setDesc("The default Wikipedia to browse.")
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(
						Object.entries(languages).reduce(
							(pre, lang) => ({
								...pre,
								[lang[0]]: `${lang[0]} - ${lang[1]}`,
							}),
							{}
						)
					)
					.setValue(this.settings.language)
					.onChange(async (value) => {
						this.settings.language = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Search limit")
			.setDesc("Maximum number of search results to show. (1≤limit≤500)")
			.addText((text) =>
				text
					.setPlaceholder("limit")
					.setValue(this.settings.searchLimit ? this.settings.searchLimit.toString() : "")
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (parsed < 1 || parsed > 500) return;
						this.settings.searchLimit = parsed;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Thumbnail width")
			.setDesc("The width of the thumbnails in pixels. (Leave empty to use the original size.)")
			.addText((text) =>
				text
					.setPlaceholder("width")
					.setValue(this.settings.thumbnailWidth ? this.settings.thumbnailWidth.toString() : "")
					.onChange(async (value) => {
						const parsed = parseInt(value);
						if (typeof parsed !== "number") return;
						this.settings.thumbnailWidth = parsed;
						await this.plugin.saveSettings();
					})
			);

		new Setting(this.containerEl)
			.setName("Default note path")
			.setDesc("Default folder where notes should be created.")
			.addSearch((search: SearchComponent) => {
				new FolderSuggest(this.app, search.inputEl);
				return search
					.setPlaceholder("Example: folder/subfolder")
					.setValue(this.settings.defaultNotePath)
					.onChange(async (newFolder: string) => {
						if (newFolder.length == 0) {
							this.settings.defaultNotePath = DEFAULT_SETTINGS.defaultNotePath;
							search.setValue(this.settings.defaultNotePath);
						} else {
							this.settings.defaultNotePath = newFolder;
						}
						await this.plugin.saveSettings();
					});
			});

		const templateSettings = new DocumentFragment();
		templateSettings.createEl("span").innerHTML =
			"Templates (<a href='https://strangegirlmurph.github.io/obsidian-wikipedia-helper/settings.html#template-settings'>Guide</a>)";
		new Setting(containerEl).setName(templateSettings).setHeading();

		this.addTemplateSettings(containerEl);

		new Setting(containerEl).setName("Workflow optimizations").setHeading();

		new Setting(containerEl)
			.setName("Auto-search note title")
			.setDesc(
				"Whether or not to automatically use the active notes title when searching for articles and nothing is selected."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.autoSearchNoteTitle).onChange(async (value) => {
					this.settings.autoSearchNoteTitle = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Auto-select single response queries")
			.setDesc(
				"Whether or not to automatically select the response to a query when there is only one article to choose from."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.autoInsertSingleResponseQueries).onChange(async (value) => {
					this.settings.autoInsertSingleResponseQueries = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Use article title instead of selection")
			.setDesc(
				"When hyperlinking: Whether or not to use the articles title instead of the selected text for the '{title}' tag of your template."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.prioritizeArticleTitle).onChange(async (value) => {
					this.settings.prioritizeArticleTitle = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Stop auto-cleanup of intros")
			.setDesc("Whether or not to stop auto-cleaning the articles intros for better readability.")
			.addToggle((toggle) =>
				toggle.setValue(!this.settings.cleanupIntros).onChange(async (value) => {
					this.settings.cleanupIntros = !value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Article tab placement")
			.setDesc(
				"Whether or not to open articles in a fullscreen tab instead of a split view when using the Web viewer plugin or creating an article note."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.settings.openArticleInFullscreen).onChange(async (value) => {
					this.settings.openArticleInFullscreen = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Open created article notes")
			.setDesc("Whether or not to open the newly created article notes after creating them.")
			.addToggle((toggle) =>
				toggle.setValue(this.settings.openCreatedNotes).onChange(async (value) => {
					this.settings.openCreatedNotes = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Override files")
			.setDesc("Whether or not to override existing files when creating article notes.")
			.addToggle((toggle) =>
				toggle.setValue(this.settings.overrideFiles).onChange(async (value) => {
					this.settings.overrideFiles = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl).setName("Feedback, bug reports and feature requests 🌿").setHeading();
		const appendix = `<p style="border-top:1px solid var(--background-modifier-border); padding: 0.75em 0; margin: unset;">If you have any kind of feedback, please let me know! No matter how small! I want to make this plugin as useful as possible for everyone and the only way I can improve this plugin for you is if you tell me about it. I love to hear about your ideas for new features, all the bugs you found and everything that annoys you. Don't be shy! I can also obsess a lot about small details. Just <a href="https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/issues/new/choose">create an issue on GitHub</a> or <a href="mailto:work@murphy.science">write me an email</a> and I'll get back to you ASAP. ~ Murphy :)</p>`;
		const div = containerEl.createEl("div");
		div.innerHTML = appendix;
	}

	addTemplateSettings(containerEl: HTMLElement) {
		for (let [i, template] of this.settings.templates.entries()) {
			const isDefaultTemplate = i == 0;

			let setting = new Setting(containerEl);
			setting.settingEl.removeChild(setting.infoEl);
			setting.controlEl.style.flexWrap = "wrap";
			setting.controlEl.style.justifyContent = "center";

			setting.addText((text) => {
				if (isDefaultTemplate) text.setDisabled(true);
				return text
					.setPlaceholder("Name")
					.setValue(isDefaultTemplate ? "Default Template" : template.name)
					.onChange(async (value) => {
						template.name = value;
						await this.plugin.saveSettings();
					});
			});
			setting.controlEl.children[setting.controlEl.children.length - 1].setAttr("style", "width: 140px;");

			setting.addToggle((toggle) =>
				toggle
					.setTooltip("creates a note")
					.setValue(template.createNote)
					.onChange(async (value) => {
						template.createNote = value;
						if (
							template.createNote &&
							(template.templateString == DEFAULT_TEMPLATE_STRING_INLINE || template.templateString === "")
						) {
							template.templateString = DEFAULT_TEMPLATE_STRING_NOTE;
						} else if (
							!template.createNote &&
							(template.templateString == DEFAULT_TEMPLATE_STRING_NOTE || template.templateString === "")
						) {
							template.templateString = DEFAULT_TEMPLATE_STRING_INLINE;
						}
						await this.plugin.saveSettings();
						this.display();
					})
			);

			const firstGroup = setting.controlEl.createDiv();
			firstGroup.setAttr("style", "display:flex;gap:var(--size-4-2);align-items:center;");
			firstGroup.appendChild(setting.controlEl.children[0]);
			firstGroup.appendChild(setting.controlEl.children[0]);

			if (template.createNote) {
				setting.addSearch((search: SearchComponent) => {
					new FolderSuggest(this.app, search.inputEl);
					search
						.setPlaceholder("custom note path")
						.setValue(template.customPath)
						.onChange(async (newFolder: string) => {
							template.customPath = newFolder;
							await this.plugin.saveSettings();
						});
				});

				setting.controlEl.children[setting.controlEl.children.length - 1].setAttr(
					"style",
					"flex-grow:1;width:170px;"
				);

				setting.addToggle((toggle) =>
					toggle
						.setTooltip("uses a template file")
						.setValue(template.useTemplateFile)
						.onChange(async (value) => {
							template.useTemplateFile = value;
							await this.plugin.saveSettings();
							this.display();
						})
				);

				const secondGroup = setting.controlEl.createDiv();
				secondGroup.setAttr("style", "display:flex;flex-grow:1;gap:var(--size-4-2);align-items:center;");
				secondGroup.appendChild(setting.controlEl.children[1]);
				secondGroup.appendChild(setting.controlEl.children[1]);
			}

			if (template.useTemplateFile && template.createNote) {
				setting.addSearch((search: SearchComponent) => {
					new FileSuggest(this.app, search.inputEl);
					search
						.setPlaceholder("template file path")
						.setValue(template.templateFilePath)
						.onChange(async (newFolder: string) => {
							template.templateFilePath = newFolder;
							await this.plugin.saveSettings();
						});
				});
				setting.controlEl.children[setting.controlEl.children.length - 1].setAttr(
					"style",
					"flex-grow:1;width:170px;"
				);
			} else {
				setting.addTextArea((text) => {
					text.inputEl.setAttr(
						"style",
						"white-space:pre;overflow-wrap:normal;overflow:hidden;resize:none;flex-grow:1;width:220px;"
					);
					text.inputEl.setAttr("rows", template.createNote ? "3" : "2");

					return text
						.setPlaceholder("template string")
						.setValue(template.templateString)
						.onChange(async (value) => {
							template.templateString = value;
							await this.plugin.saveSettings();
						});
				});
			}

			setting.addExtraButton((button) => {
				if (isDefaultTemplate) button.setDisabled(true);
				button.extraSettingsEl.style.height = "min-content";
				return button
					.setTooltip("delete template")
					.setIcon("minus")
					.onClick(async () => {
						this.settings.templates.splice(i, 1);
						await this.plugin.saveSettings();
						this.display();
					});
			});

			const thirdGroup = setting.controlEl.createDiv();
			thirdGroup.setAttr("style", "display:flex;flex-grow:1;gap:var(--size-4-2);align-items:center;");
			thirdGroup.appendChild(setting.controlEl.children[setting.controlEl.children.length - 3]);
			thirdGroup.appendChild(setting.controlEl.children[setting.controlEl.children.length - 2]);
		}

		new Setting(containerEl).addExtraButton((button) =>
			button
				.setTooltip("add template")
				.setIcon("plus")
				.onClick(async () => {
					if (this.settings.templates.length == 21)
						return new Notice(
							"Easy buddy... I need to stop you right there. You can only have up to 20 templates. It's for your own good! (I think) If you really need more write me. If you convince me I'll let you have more.",
							15000
						);

					this.settings.templates.push({
						...DEFAULT_TEMPLATE,
						name: `Additional Template`,
					});
					await this.plugin.saveSettings();
					this.display();
				})
		);
	}
}
