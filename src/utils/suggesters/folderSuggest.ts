import { AbstractInputSuggest, App, TAbstractFile, TFolder } from "obsidian";
import { createNoteInActiveNotesFolderMarker } from "../createNote";

export class FolderSuggest extends AbstractInputSuggest<string> {
	private inputEl: HTMLInputElement;

	constructor(app: App, textInputEl: HTMLInputElement) {
		super(app, textInputEl);
		this.inputEl = textInputEl;
	}

	getSuggestions(inputStr: string): string[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const folders: string[] = [];
		const lowerCaseInputStr = inputStr.toLowerCase();

		["[default note path]", createNoteInActiveNotesFolderMarker].forEach((marker) => {
			if (marker.toLowerCase().contains(lowerCaseInputStr)) {
				folders.push(marker);
			}
		});

		abstractFiles.forEach((folder: TAbstractFile) => {
			if (folder instanceof TFolder) {
				const path = folder.path === "/" ? "/" : "/" + folder.path;
				if (path.toLowerCase().contains(lowerCaseInputStr)) {
					folders.push(path);
				}
			}
		});

		folders.sort((a, b) => a.localeCompare(b));

		return folders;
	}

	renderSuggestion(folderPath: string, el: HTMLElement): void {
		el.setText(folderPath);
	}

	selectSuggestion(folderPath: string, evt: MouseEvent | KeyboardEvent): void {
		this.inputEl.value = folderPath === "[default note path]" ? "" : folderPath;
		this.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
		this.close();
	}
}
