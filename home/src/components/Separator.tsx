import * as RadixSeparator from '@radix-ui/react-separator';
import { createStyles } from '@mantine/styles';

export type SeparatorProps = RadixSeparator.SeparatorProps & {
	/** The visual style of this separator */
	kind?: 'fading' | 'glass';
	/** Optional margin to apply to this element */
	margin?: number | string;
};

export function Separator({ kind, margin }: SeparatorProps) {
	const { classes } = useStyles({ kind, margin });

	return <RadixSeparator.Root className={classes.separator} />;
}

const useStyles = createStyles((theme, { kind, margin }: SeparatorProps) => ({
	separator: {
		background: theme.other.color.bgBorder,
		margin: margin ?? 0,

		'&[data-orientation="horizontal"]': {
			height: '1px',
			width: '100%',
			'--direction': 'to right',
		},

		'&[data-orientation="vertical"]': {
			width: '1px',
			height: '100%',
			'--direction': 'to bottom',
		},

		...(kind === 'fading' && {
			background:
				'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1) 50%, transparent)',
		}),

		...(kind === 'glass' && {
			background: 'background: rgba(180, 188, 208, 0.1)',
		}),
	},
}));
