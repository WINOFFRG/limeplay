import { LinksGroupProps } from './LinksGroup/LinksGroup';

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
