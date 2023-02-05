import { LinksGroupProps } from '@/components/Footer/LinksGroup/LinksGroup';

export const FOOTER_LINKS_DATA: LinksGroupProps[] = [
    {
        title: 'Community',
        data: [
            {
                type: 'link',
                label: 'Follow on Github',
                link: 'https://github.com/winoffrg',
            },
        ],
    },
];

export const meta = {
    docsLink: 'https://docs.limeplay.me',

    discordLink: 'https://discord.gg/',
    twitterLink: 'https://twitter.com/',

    npmLink: 'https://www.npmjs.com/org/mantine',

    discordColor: '#5865f2',
    twitterColor: '#1C8CD8',

    gitHubLinks: {
        mantine: 'https://github.com/winoffrg/limeplay',
        discussions: 'https://github.com/winoffrg/limeplay/discussions',
        organization: 'https://github.com/winoffrg',
        releases: 'https://github.com/winoffrg/limeplay/releases',
    },
};
