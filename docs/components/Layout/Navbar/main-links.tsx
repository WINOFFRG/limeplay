import React from 'react';
import { DEFAULT_THEME } from '@mantine/core';
import { IconCode, IconStar, IconRocket } from '@tabler/icons';

export default [
    {
        to: '/pages/getting-started/',
        label: 'Getting started',
        color: DEFAULT_THEME.colors.blue[5],
        icon: IconRocket,
    },
    {
        to: '/pages/basics/',
        label: 'Learn the basics',
        color: DEFAULT_THEME.colors.violet[5],
        icon: IconStar,
    },
    {
        to: '/pages/contributing/',
        label: 'Contribute',
        color: '#000',
        icon: IconCode,
    },
];
