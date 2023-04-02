import { DEFAULT_THEME } from '@mantine/core';
import {
	IconCode,
	IconStar,
	IconRocket,
	IconQuestionMark,
	IconSearch,
	IconBook,
} from '@tabler/icons';

export default [
	{
		to: '/pages/getting-started',
		label: 'Getting Started',
		color: DEFAULT_THEME.colors.blue[5],
		icon: IconRocket,
		rawIcon: false,
	},
	{
		to: '/pages/basics',
		label: 'Learn the basics',
		color: DEFAULT_THEME.colors.violet[5],
		icon: IconStar,
		rawIcon: false,
	},
	{
		to: '/pages/research',
		label: 'Player Research',
		color: DEFAULT_THEME.colors.orange[5],
		icon: IconSearch,
		rawIcon: false,
	},
	{
		to: '/pages/about',
		label: 'About Limeplay',
		color: DEFAULT_THEME.colors.yellow[5],
		icon: IconQuestionMark,
		rawIcon: false,
	},
	{
		to: '/pages/contributing',
		label: 'Contribute',
		color: DEFAULT_THEME.colors.cyan[5],
		icon: IconCode,
		rawIcon: false,
	},
	{
		to: '/pages/concepts',
		label: 'Concepts',
		color: DEFAULT_THEME.colors.indigo[5],
		icon: IconBook,
		rawIcon: false,
	},
];
