import { App, Editor, Notice, TFile } from "obsidian";
import { Template, WikipediaHelperSettings } from "../settings";
import { Article } from "src/utils/searchModal";
import { SearchModal } from "src/utils/searchModal";
import { TemplateModal } from "src/utils/templateModal";
import { generateInsert } from "src/utils/generateInsert";
import { createNoteInActiveNotesFolderMarker, createNoteInFolder } from "src/utils/createNote";
import { Wiki } from "src/main";

export class LinkArticleModal extends SearchModal {
	async onChooseSuggestion(article: Article) {
		if (this.settings.templates.length > 1) {
			new LinkArticleTemplateModal(this.app, this.settings, this.editor!, article, this.wiki).open();
		} else {
			linkArticle(this.app, this.editor!, this.settings, article, this.wiki, this.settings.templates[0]);
		}
	}
}

class LinkArticleTemplateModal extends TemplateModal {
	async onChooseSuggestion(template: Template) {
		linkArticle(this.app, this.editor, this.settings, this.article, this.wiki, template);
	}
}

async function linkArticle(
	app: App,
	editor: Editor,
	settings: WikipediaHelperSettings,
	article: Article,
	wiki: Wiki,
	template: Template
) {
	let templateString = template.templateString;
	const selection = editor.getSelection();

	if (template.createNote) {
		if (template.useTemplateFile) {
			const templateFile = app.vault.getAbstractFileByPath(template.templateFilePath);
			if (!templateFile || !(templateFile instanceof TFile)) {
				new Notice(`Aborting! Template file '${template.templateFilePath}' not found!`);
				return;
			}
			templateString = await app.vault.read(templateFile);
		}

		const content = await generateInsert(settings, article, wiki, templateString, selection);

		let folderPath: string | null =
			template.customPath === "" ? settings.defaultNotePath : template.customPath;
		if (folderPath === createNoteInActiveNotesFolderMarker) {
			folderPath = app.workspace.getActiveFile()?.parent?.path || null;
			if (folderPath == null) {
				new Notice(
					"Aborted! You have to have an active file to create a note in the current files parent folder."
				);
				return;
			}
		}

		const notePath = await createNoteInFolder(
			app,
			article.title,
			content.insert,
			folderPath,
			settings.overrideFiles
		);
		if (notePath == null) return;

		editor.replaceSelection(
			`[[${notePath}|${settings.prioritizeArticleTitle || selection === "" ? article.title : selection}]]`
		);
	} else {
		const internalCursorMarker = "{cursorMarker}";

		let content = editor.getValue();
		content =
			content.substring(0, editor.posToOffset(editor.getCursor("from"))) +
			templateString +
			internalCursorMarker +
			content.substring(editor.posToOffset(editor.getCursor("to")));

		const result = await generateInsert(settings, article, wiki, content, selection);
		let newContent = result.insert;
		let cursorPosition = result.cursorPosition;
		if (cursorPosition == null) cursorPosition = newContent.search(internalCursorMarker);
		newContent = newContent.replace(internalCursorMarker, "");

		editor.setValue(newContent);
		const cursorPos = editor.offsetToPos(cursorPosition!);
		editor.setCursor(cursorPos);
		editor.scrollIntoView({ from: cursorPos, to: cursorPos }, true);
	}
}
