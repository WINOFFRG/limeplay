import { LinksGroupProps } from '@/components/Footer/LinksGroup/LinksGroup';

export const FOOTER_LINKS_DATA: LinksGroupProps[] = [
    {
        title: 'About',
        data: [
            {
                type: 'next',
                label: 'Contribute',
                link: '/pages/contributing/',
            },
            { type: 'next', label: 'About Mantine', link: '/pages/about/' },
            { type: 'next', label: 'Changelog', link: '/pages/changelog/' },
        ],
    },

    {
        title: 'Community',
        data: [
            {
                type: 'link',
                label: 'Follow on Github',
                link: 'https://github.com/rtivital',
            },
        ],
    },
    {
        title: 'Project',
        data: [
            //   { type: 'link', label: 'Mantine UI', link: meta.uiLink },
            //   { type: 'link', label: 'Documentation', link: meta.docsLink },
            //   { type: 'link', label: 'Github organization', link: meta.gitHubLinks.organization },
            //   { type: 'link', label: 'npm organization', link: meta.npmLink },
        ],
    },
];

export const meta = {
    docsLink: 'https://mantine.dev',
    uiLink: 'https://ui.mantine.dev/',

    discordLink: 'https://discord.gg/eUZpPbpxb4',
    twitterLink: 'https://twitter.com/mantinedev',

    npmLink: 'https://www.npmjs.com/org/mantine',

    discordColor: '#5865f2',
    twitterColor: '#1C8CD8',

    gitHubLinks: {
        mantine: 'https://github.com/mantinedev/mantine',
        mantineUi: 'https://github.com/mantinedev/ui.mantine.dev',
        discussions: 'https://github.com/mantinedev/mantine/discussions',
        organization: 'https://github.com/mantinedev',
        releases: 'https://github.com/mantinedev/mantine/releases',
    },
};
