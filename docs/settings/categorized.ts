import { Category } from './types';

const CORE_ORDER = ['components', 'hooks'] as const;

const CORE_CATEGORIZES: Record<(typeof CORE_ORDER)[number], Category> = {
	components: {
		title: 'Components',
	},
	hooks: {
		title: 'Hooks',
	},
};

export const CORE_CATEGORIZED = {
	group: 'limeplay',
	categories: CORE_CATEGORIZES,
	order: CORE_ORDER,
};

export const CATEGORIZED = [CORE_CATEGORIZED];
