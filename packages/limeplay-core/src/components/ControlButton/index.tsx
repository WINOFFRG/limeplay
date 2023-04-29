import { DefaultProps } from '@mantine/styles';
import useStyles from './styles';

interface ControlButtonProps
	extends DefaultProps,
		React.ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
}

export default function ControlButton({
	children,
	className,
	...others
}: ControlButtonProps) {
	const { classes, cx } = useStyles();

	return (
		// <Box
		// 	component="button"
		// 	type="button"
		// 	className={cx(classes.controlButton, className)}
		// 	{...others}
		// >
		// {children && (
		<div role="presentation" className={classes.controlElementWrapper}>
			{children}
		</div>
		// )}
		// </Box>
	);
}
