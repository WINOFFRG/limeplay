import type { StorybookConfig } from '@storybook/react-webpack5';
const config: StorybookConfig = {
	stories: [
		// '../packages/limeplay-core/src/**/*.mdx',
		'../packages/limeplay-core/src/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-links',
		'@storybook/addon-a11y',
		'@storybook/addon-storysource',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	core: {
		builder: '@storybook/builder-vite',
	},
};
export default config;
