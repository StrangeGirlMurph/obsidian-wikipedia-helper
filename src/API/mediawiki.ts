import { Wiki } from "src/main";
import { Article } from "../utils/searchModal";
import { fetchData, sortResponsesByTitle, titlesToURLParameter } from "../utils/toolsAPI";

export async function getWikiArticles(
	query: string,
	languageCode: string,
	wiki: Wiki,
	limit: number
): Promise<Article[] | null> {
	// https://en.wiktionary.org/w/api.php?format=json&action=opensearch&profile=fuzzy&redirects=resolve&search=Wikipedia
	const url =
		getAPIBaseURL(wiki, languageCode) +
		"&action=opensearch" +
		"&profile=fuzzy" +
		"&redirects=resolve" +
		`&limit=${limit ?? 10}` +
		"&search=" +
		encodeURIComponent(query);
	const response = await fetchData(url);
	if (!response) return null;
	return response[1].map((title: string, index: number) => ({
		title,
		url: response[3][index],
		languageCode,
	}));
}

export async function getWikiArticleCategories(
	titles: string[],
	languageCode: string,
	wiki: Exclude<Wiki, "Wikivoyage">
): Promise<(string | null)[] | null> {
	// https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=categories&cllimit=500&clshow=!hidden&titles=Wikipedia
	const url =
		getAPIBaseURL(wiki, languageCode) +
		"&action=query" +
		"&prop=categories" +
		"&cllimit=500" +
		"&clshow=!hidden" +
		"&titles=" +
		titlesToURLParameter(titles);

	const response = await fetchData(url);
	if (!response.query) return null;

	return sortResponsesByTitle(titles, Object.values(response.query.pages))
		.map((page: any) => page.categories || null)
		.map((v) => v.map((c: any) => c.title.split(":")[1]).join(", "));
}

function getAPIBaseURL(wiki: Wiki, languageCode: string) {
	return `https://${languageCode}.${wiki.toLowerCase()}.org/w/api.php?format=json`;
}
