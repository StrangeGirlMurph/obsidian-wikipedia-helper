import { AbstractInputSuggest, App, TAbstractFile, TFile } from "obsidian";

export class FileSuggest extends AbstractInputSuggest<TFile> {
	private inputEl: HTMLInputElement;

	constructor(app: App, textInputEl: HTMLInputElement) {
		super(app, textInputEl);
		this.inputEl = textInputEl;
	}

	getSuggestions(inputStr: string): TFile[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const files: TFile[] = [];
		const lowerCaseInputStr = inputStr.toLowerCase();

		abstractFiles.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile &&
				file.extension === "md" &&
				file.path.toLowerCase().contains(lowerCaseInputStr)
			) {
				files.push(file);
			}
		});

		return files;
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path.slice(0, -3));
	}

	selectSuggestion(file: TFile, evt: MouseEvent | KeyboardEvent): void {
		this.inputEl.value = file.path.slice(0, -3);
		this.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
		this.close();
	}
}
