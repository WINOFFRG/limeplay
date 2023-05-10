import { LinksGroupProps } from '@/components/Footer/LinksGroup/LinksGroup';

export const FOOTER_LINKS_DATA: LinksGroupProps[] = [
	{
		title: 'Community',
		data: [
			{
				type: 'link',
				label: 'Chat on Discord',
				link: 'https://discord.gg/ZjXFzqmqjn',
			},
			{
				type: 'link',
				label: 'Follow on Github',
				link: 'https://github.com/WINOFFRG/limeplay',
			},
			{
				type: 'link',
				label: 'Follow on Twitter',
				link: 'https://twitter.com/winoffrg',
			},
			{
				type: 'link',
				label: 'GitHub discussions',
				link: 'https://github.com/WINOFFRG/limeplay/issues',
			},
		],
	},
	{
		title: 'About',
		data: [
			{
				type: 'link',
				label: 'About Limeplay',
				link: 'https://docs.limeplay.me/about',
			},
			{
				type: 'link',
				label: 'Changelog',
				link: 'https://github.com/WINOFFRG/limeplay/blob/main/CHANGELOG.md',
			},
			{
				type: 'link',
				label: 'Releases',
				link: 'https://github.com/WINOFFRG/limeplay/releases',
			},
		],
	},
	{
		title: 'Project',
		data: [
			{
				type: 'link',
				label: 'Limeplay UI',
				link: 'https://limeplay.me',
			},
			{
				type: 'link',
				label: 'Documentation',
				link: 'https://docs.limeplay.me',
			},
			{
				type: 'link',
				label: 'npm organization',
				link: 'https://www.npmjs.com/org/limeplay',
			},
		],
	},
];

// 					<FooterLink href={Config.GITHUB_URL}>Contribute</FooterLink>
// 					<FooterLink href={`${Config.DOCS_BASE}about`}>
// 						About Limeplay
// 					</FooterLink>
// 					<FooterLink href={`${Config.DOCS_BASE}about`}>
// 						Changelog
// 					</FooterLink>
// 					<FooterLink href={`${Config.DOCS_BASE}about`}>
// 						Releases
// 					</FooterLink>
// 				</Section>
// 				<Section title="Community">
// 					<FooterLink href={Config.DISCORD_URL}>
// 						Chat on Discord
// 					</FooterLink>
// 					<FooterLink href={Config.AUTHOR_GITHUB}>
// 						Follow on Github
// 					</FooterLink>
// 					<FooterLink href={Config.AUTHOR_TWITTER}>
// 						Follow on Twitter
// 					</FooterLink>
// 					<FooterLink href={`${Config.GITHUB_URL}/issues`}>
// 						GitHub discussions
// 					</FooterLink>
// 				</Section>
// 				<Section title="Project">
// 					<FooterLink href="/">Limeplay UI</FooterLink>
// 					<FooterLink href={Config.DOCS_BASE}>
// 						Documentation
// 					</FooterLink>
// 					<FooterLink href={Config.NPM_URL}>
// 						npm organization
// 					</FooterLink>
export const meta = {
	docsLink: 'https://docs.limeplay.me',

	discordLink: 'https://discord.gg/ZjXFzqmqjn',
	twitterLink: 'https://twitter.com/winoffrg',

	npmLink: 'https://www.npmjs.com/org/limeplay',

	discordColor: '#5865f2',
	twitterColor: '#1C8CD8',

	gitHubLinks: {
		mantine: 'https://github.com/winoffrg/limeplay',
		discussions: 'https://github.com/winoffrg/limeplay/discussions',
		organization: 'https://github.com/winoffrg',
		releases: 'https://github.com/winoffrg/limeplay/releases',
	},
};
