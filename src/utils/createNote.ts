import { App, normalizePath, Notice, TFile } from "obsidian";

export const createNoteInActiveNotesFolderMarker = "[current folder]";

export async function createNoteInFolder(
	app: App,
	title: string,
	content: string,
	folderPath: string,
	overrideExisting: boolean
): Promise<string | null> {
	if (
		!(await app.vault.adapter.exists(folderPath)) ||
		app.vault.getAbstractFileByPath(folderPath) instanceof TFile
	) {
		new Notice(
			"Aborted! The folder you specified in the settings to create this new note in does not exist. Please visit the plugin settings and change the path!",
			15000
		);
		return null;
	}

	const sanitizedTitle = title.replaceAll(`"`, `'`).replace(/[\\/:*?]/g, "~");
	const filePath = normalizePath(`${folderPath}/${sanitizedTitle}.md`);
	const file = app.vault.getAbstractFileByPath(filePath);

	if (file && !overrideExisting) {
		new Notice(`Aborted! '${filePath}' already exists.`);
		return null;
	} else if (file && file instanceof TFile && overrideExisting) {
		await app.vault.modify(file, content);
		new Notice(`Note successfully overwritten.`);
		return filePath;
	} else {
		await app.vault.create(filePath, content);
		new Notice("New note created successfully.");
		return filePath;
	}
}
