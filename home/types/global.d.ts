import { GlobalTheme } from '@/pages/_app';

declare module '@mantine/core' {
	export interface MantineThemeOther extends GlobalTheme {}
}
