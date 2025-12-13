import { Notice } from "obsidian";
import { WikipediaHelperSettings } from "src/settings";
import { languages } from "./languages";
import { Article } from "./searchModal";
import {
	getWikipediaArticleDescriptions,
	getWikipediaArticleIntros,
	getWikipediaArticleThumbnails,
} from "../API/wikipedia";
import { getWikiArticleCategories } from "../API/mediawiki";
import { Wiki } from "src/main";

export async function generateInsert(
	settings: WikipediaHelperSettings,
	article: Article,
	wiki: Wiki,
	content: string,
	selection: string
): Promise<{ insert: string; cursorPosition: number | null }> {
	const title = settings.prioritizeArticleTitle || selection === "" ? article.title : selection;
	let insert = content
		.replaceAll("{title}", title)
		.replaceAll("{url}", article.url)
		.replaceAll("{language}", languages[article.languageCode])
		.replaceAll("{languageCode}", article.languageCode);

	if (wiki != "Wikivoyage") {
		if (content.includes("{categories}")) {
			const categories: string | null =
				(await getWikiArticleCategories([article.title], settings.language, wiki))?.[0] ?? null;
			insert = insert.replaceAll("{categories}", categories ?? "");
			if (!categories) new Notice("Could not fetch the articles categories.");
		}
	} else {
		insert = insert.replaceAll("{categories}", "");
	}

	if (wiki == "Wikipedia") {
		if (content.includes("{description}")) {
			const description: string | null =
				(await getWikipediaArticleDescriptions([article.title], settings.language))?.[0] ?? null;
			insert = insert.replaceAll("{description}", description ?? "");
			if (!description) new Notice("Could not fetch the articles description.");
		}

		if (content.includes("{intro}")) {
			const intro: string | null =
				(await getWikipediaArticleIntros([article.title], settings.language, settings.cleanupIntros))?.[0] ??
				null;
			insert = insert.replaceAll("{intro}", intro ?? "");
			if (!intro) new Notice("Could not fetch the articles introduction.");
		}

		if (content.includes("{thumbnail}") || content.includes("{thumbnailUrl}")) {
			const thumbnailUrl: string | null =
				(await getWikipediaArticleThumbnails([article.title], settings.language))?.[0] ?? null;
			insert = insert
				.replaceAll(
					"{thumbnail}",
					thumbnailUrl
						? `![${article.title} Thumbnail${
								settings.thumbnailWidth ? ` | ${settings.thumbnailWidth}` : ""
							}](${thumbnailUrl})`
						: ""
				)
				.replaceAll("{thumbnailUrl}", thumbnailUrl ?? "");
			if (!thumbnailUrl) new Notice("Could not fetch the articles thumbnail.");
		}
	} else {
		insert = insert
			.replaceAll("{description}", "")
			.replaceAll("{intro}", "")
			.replaceAll("{thumbnail}", "")
			.replaceAll("{thumbnailUrl}", "");
	}

	let cursorPosition: number | null = insert.search("{cursor}");
	cursorPosition = cursorPosition != -1 ? cursorPosition : null;

	insert = insert.replaceAll("{cursor}", "");

	return { insert, cursorPosition };
}
