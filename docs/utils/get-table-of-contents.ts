import { slug } from 'github-slugger';

export interface Heading {
	value: string;
	id?: string;
	level: string;
	depth: number;
}

export function getTableOfContents(mdxContent: string) {
	const regexp = new RegExp(/^(### |## )(.*)(\n|\r)/, 'gm');
	const headings = [...mdxContent.matchAll(regexp)];

	let tableOfContents: Heading[] = [];

	if (headings.length) {
		tableOfContents = headings.map((heading) => {
			const headingText = heading[2].trim();
			const headingType = heading[1].trim() === '##' ? 'h2' : 'h3';
			const headingLink = slug(headingText, false);

			return {
				value: headingText,
				id: headingLink,
				level: headingType,
				depth: parseInt(headingType.replace('h', ''), 10),
			};
		});
	}

	return tableOfContents;
}
