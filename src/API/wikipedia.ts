import { Article } from "../utils/searchModal";
import { fetchData, sortResponsesByTitle, titlesToURLParameter } from "../utils/toolsAPI";

export async function getWikipediaArticles(
	query: string,
	languageCode: string,
	limit: number
): Promise<Article[] | null> {
	// https://en.wikipedia.org/w/api.php?format=json&action=opensearch&profile=fuzzy&redirects=resolve&search=Wikipedia
	const url =
		getAPIBaseURL(languageCode) +
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

export async function getWikipediaArticleDescriptions(
	titles: string[],
	languageCode: string
): Promise<(string | null)[] | null> {
	// https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=pageprops&ppprop=wikibase-shortdesc&titles=Wikipedia
	const url =
		getAPIBaseURL(languageCode) +
		"&action=query" +
		"&prop=description" +
		"&titles=" +
		titlesToURLParameter(titles);

	const response = await fetchData(url);
	if (!response?.query?.pages) return null;

	return sortResponsesByTitle(titles, Object.values(response.query.pages) as any[]).map(
		(page: any) => page.description || null
	);
}

export async function getWikipediaArticleIntros(
	titles: string[],
	languageCode: string,
	cleanup: boolean
): Promise<(string | null)[] | null> {
	// https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=extracts&exintro&explaintext&titles=Wikipedia
	const url =
		getAPIBaseURL(languageCode) +
		"&action=query" +
		"&prop=extracts" +
		"&exintro" +
		"&explaintext" +
		"&titles=" +
		titlesToURLParameter(titles);

	const response = await fetchData(url);
	if (!response?.query?.pages) return null;

	return sortResponsesByTitle(titles, Object.values(response.query.pages) as any[]).map((page: any) => {
		const extract: string = page.extract.trim() ?? null;
		if (extract && cleanup) {
			// auto-cleanup of intros
			return (
				extract
					// turns all "{\displaystyle ... }" occurrences into a proper LaTeX equation.
					.replaceAll(/{\\displaystyle [^\n]+}/g, (text: string) => "$" + text.slice(15, -1).trim() + "$")
					// removes the unicode characters that try to replace the LaTeX and all the unnecessary linebreakes
					.replaceAll("$\n  \n", "$")
					.replaceAll(/\n {2}\n {4}\n {6}\n[^$]* {6}\n {4}\n {4}[$]/g, "$")
					// take care of some other quirks that can occur
					.replaceAll("  ", " ")
					// escape some markdown syntax
					.replaceAll("`", "\\`")
			);
		}
		return extract;
	});
}

export async function getWikipediaArticleThumbnails(
	titles: string[],
	languageCode: string
): Promise<(string | null)[] | null> {
	//https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=pageimages&piprop=original|name&pilicense=any&titles=Wikipedia
	const url =
		getAPIBaseURL(languageCode) +
		"&action=query" +
		"&prop=pageimages" +
		"&piprop=original|name" +
		"&pilicense=any" +
		"&titles=" +
		titlesToURLParameter(titles);

	const response = await fetchData(url);
	if (!response?.query?.pages) return null;

	return sortResponsesByTitle(titles, Object.values(response.query.pages) as any[]).map(
		(page: any) => page.original?.source ?? null
	);
}

function getAPIBaseURL(languageCode: string) {
	return `https://${languageCode}.wikipedia.org/w/api.php?format=json`;
}
