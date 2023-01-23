import React from 'react';
import { SimpleGrid } from '@mantine/core';
import { MdxSibling } from './MdxSibling/MdxSibling';
import { DocumentTypeMap } from '.contentlayer/generated';
import { getPageSiblings } from '@/utils/get-page-siblings';

export function MdxSiblings({
    type,
    route,
}: {
    type: keyof DocumentTypeMap;
    route: string;
}) {
    const siblings = getPageSiblings(type, route);

    return (
        <SimpleGrid
            mt={40}
            cols={2}
            breakpoints={[{ maxWidth: 1000, cols: 1 }]}
        >
            {siblings.prev && <MdxSibling type="prev" data={siblings.prev} />}
            {siblings.next && <MdxSibling type="next" data={siblings.next} />}
        </SimpleGrid>
    );
}
