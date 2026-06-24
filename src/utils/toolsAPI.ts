import { requestUrl } from "obsidian";

export function sortResponsesByTitle(titles: string[], responses: unknown[]) {
	return responses.sort((a: any, b: any) => titles.indexOf(a.title) - titles.indexOf(b.title));
}

export function titlesToURLParameter(titles: string[]) {
	return titles.map((title) => encodeURIComponent(title)).join("|");
}

export class RateLimitError extends Error {
	retryAfter: number | null;
	constructor(retryAfter: number | null = null) {
		super(
			retryAfter
				? `Rate limit hit. Please wait ${retryAfter} seconds and try again.`
				: "Rate limit hit. Please try again later."
		);
		this.name = "RateLimitError";
		this.retryAfter = retryAfter;
	}
}

export async function fetchData(url: string): Promise<any> {
	const response = await requestUrl({
		url,
		headers: {
			"User-Agent":
				"Obsidian-Wikipedia-Helper/2.7.1 (https://github.com/StrangeGirlMurph/obsidian-wikipedia-search; mailto:work@murphy.science)",
		},
	}).catch((e) => {
		if (e && e.status === 429) {
			const retryAfterStr = e.headers?.["retry-after"] || e.headers?.["Retry-After"];
			const retryAfter = retryAfterStr ? parseInt(retryAfterStr, 10) : null;
			throw new RateLimitError(Number.isNaN(retryAfter) ? null : retryAfter);
		}
		return null;
	});

	// Request failed
	if (!response) return null;

	// Request failed with status
	if (response.status !== 200) {
		return null;
	}

	try {
		return response.json;
	} catch (e) {
		// The page wasn't in JSON. There probably isn't an API in this language.
		return null;
	}
}
