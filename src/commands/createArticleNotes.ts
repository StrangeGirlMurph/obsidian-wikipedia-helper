import { App, Editor, Notice, TFile } from "obsidian";
import { Template, WikipediaHelperSettings } from "../settings";
import { Article } from "src/utils/searchModal";
import { SearchModal } from "src/utils/searchModal";
import { TemplateModal } from "src/utils/templateModal";
import { generateInsert } from "src/utils/generateInsert";
import { createNoteInActiveNotesFolderMarker, createNoteInFolder } from "src/utils/createNote";
import { Wiki } from "src/main";

export class CreateArticleNoteModal extends SearchModal {
	async onChooseSuggestion(article: Article) {
		const templates = this.settings.templates.filter((template) => template.createNote);
		if (templates.length > 1) {
			new CreateArticleNoteTemplateModal(
				this.app,
				this.settings,
				this.editor!,
				article,
				this.wiki,
				true
			).open();
		} else {
			createArticleNote(this.app, this.settings, article, this.wiki, templates[0]);
		}
	}
}

class CreateArticleNoteTemplateModal extends TemplateModal {
	constructor(
		app: App,
		settings: WikipediaHelperSettings,
		editor: Editor,
		article: Article,
		wiki: Wiki,
		noteTemplatesOnly = false
	) {
		super(app, settings, editor, article, wiki, noteTemplatesOnly);
	}

	async onChooseSuggestion(template: Template) {
		createArticleNote(this.app, this.settings, this.article, this.wiki, template);
	}
}

async function createArticleNote(
	app: App,
	settings: WikipediaHelperSettings,
	article: Article,
	wiki: Wiki,
	template: Template
) {
	let templateString = template.templateString;
	if (template.useTemplateFile) {
		const templateFile = app.vault.getAbstractFileByPath(template.templateFilePath);
		if (!templateFile || !(templateFile instanceof TFile)) {
			new Notice(`Aborting! Template file '${template.templateFilePath}' not found!`);
			return;
		}
		templateString = await app.vault.read(templateFile);
	}

	let folderPath: string | null = template.customPath === "" ? settings.defaultNotePath : template.customPath;
	if (folderPath === createNoteInActiveNotesFolderMarker) {
		folderPath = app.workspace.getActiveFile()?.parent?.path || null;
		if (folderPath == null) {
			new Notice(
				"Aborted! You have to have an active file to create a note in the current files parent folder."
			);
			return;
		}
	}

	const result = await generateInsert(settings, article, wiki, templateString, "");
	const filePath = await createNoteInFolder(
		app,
		article.title,
		result.insert,
		folderPath,
		settings.overrideFiles
	);
	if (!filePath) return;
	if (settings.openCreatedNotes) {
		app.workspace
			.getLeaf(settings.openArticleInFullscreen ? "tab" : "split")
			.openFile(app.vault.getAbstractFileByPath(filePath)! as TFile);
	}
}
