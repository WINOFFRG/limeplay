import { IconNotebook, IconBoxMultiple } from '@tabler/icons';
import { Category } from './types';

export const MANTINE_CORE_ORDER = ['data-display', 'overlay'] as const;

export const MANTINE_CORE_CATEGORIES: Record<
    typeof MANTINE_CORE_ORDER[number],
    Category
> = {
    'data-display': {
        title: 'Data display',
        icon: IconNotebook,
    },

    overlay: {
        title: 'Overlays',
        icon: IconBoxMultiple,
    },
};
