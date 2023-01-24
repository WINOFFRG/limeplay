import React from 'react';
import { Box, Group } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons';
import NextLink from '../../MdxProvider/NextLink/NextLink';
import { StylesApiItem } from './StylesApiItem/StylesApiItem';

interface StylesApiProps {
    components: string[];
}

export function StylesApi({ components }: StylesApiProps) {
    if (!Array.isArray(components)) {
        return null;
    }

    const items = components.map((component) => (
        <StylesApiItem key={component} component={component} />
    ));

    return (
        <>
            {/* No Items bcoz Sttyles API need separate data source */}
            {items}
            <Box mt="xl">
                <NextLink href="/styles/styles-api/">
                    <Group spacing={4}>
                        <span>Learn more about Styles API</span>
                        <IconArrowRight size={14} stroke={1.5} />
                    </Group>
                </NextLink>
            </Box>
        </>
    );
}
