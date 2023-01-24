import { allDocuments, type DocumentTypes } from '@/.contentlayer/generated';
import { CATEGORIZED } from '../settings';
import { Frontmatter } from '../types';
import React from 'react';
import { Icon2fa } from '@tabler/icons';

export interface Category {
    title: string;
    icon: (props: React.ComponentProps<typeof Icon2fa>) => JSX.Element;
}

interface GroupPages {
    categories: Record<string, Category>;
    order: readonly string[];
    group: string;
}

function sortPages(pages: DocumentTypes[]) {
    if (!pages) {
        return [];
    }

    const clone = [...pages];

    clone.sort((a, b) => {
        if ('order' in a && 'order' in b) {
            if (a.order === b.order) {
                return a.title
                    .toLowerCase()
                    .localeCompare(b.title.toLowerCase());
            }

            return a.order - b.order;
        }

        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    return clone;
}

export function groupPages({ categories, order, group }: GroupPages): {
    uncategorized: DocumentTypes[];
    groups: { category: Category; pages: DocumentTypes[] }[];
    group: string;
} {

    const pages = allDocuments
        .map((node) => node)
        .filter((page) => !page.hidden)
        .filter((page) => page.group === group);

    const uncategorized: DocumentTypes[] = [];

    const categorized = pages.reduce((acc: any, page) => {
        if (!(page.category in categories)) {
            uncategorized.push({ ...page, order: page.order || 0 });
            return acc;
        }

        if (!(page.category in acc)) {
            acc[page.category] = [];
        }

        acc[page.category].push({ ...page, order: page.order || 0 });
        return acc;
    }, {} as { category: Category; pages: DocumentTypes[] });

    const groups = order.map((category) => ({
        category: categories[category],
        pages: sortPages(categorized[category]),
    }));

    return { uncategorized: sortPages(uncategorized), groups, group };
}

export function getDocsData() {
    return CATEGORIZED.map((data) =>
        groupPages({
            // @ts-ignore
            categories: data.categories,
            order: data.order,
            group: data.group,
        })
    );
}
