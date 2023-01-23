import { Category } from './types';

const CORE_ORDER = ['data-display', 'overlay'] as const;

const CORE_CATEGORIZES: Record<typeof CORE_ORDER[number], Category> = {
    'data-display': {
        title: 'Data display Scam',
    },

    overlay: {
        title: 'Overlays Lol',
        // icon: IconBoxMultiple,
    },
};

export const CORE_CATEGORIZED = {
    group: 'core',
    categories: CORE_CATEGORIZES,
    order: CORE_ORDER,
};

export const CATEGORIZED = [CORE_CATEGORIZED];
