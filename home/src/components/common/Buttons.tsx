import { UnstyledButton, createStyles, px } from '@mantine/core';
import React, { forwardRef } from 'react';

const useStyles = createStyles((theme) => ({
	iconStyle: {
		width: '24px',
		height: '24px',
		margin: '0 auto',
		pointerEvents: 'none',

		[theme.fn.smallerThan('md')]: {
			width: '18px',
			height: '18px',
		},
	},

	controlButton: {
		backgroundColor: 'transparent',
		borderRadius: '0.2rem',
		color: theme.white,
		padding: '0.5rem',
		// margin: 0,
		// position: 'relative',
		// width: 2 * px(theme.spacing.lg),
		// height: 2 * px(theme.spacing.lg),
		// opacity: 0.7,
		transition: 'opacity 150ms ease, transform 150ms ease',
		willChange: 'opacity, transform',
		...theme.fn.focusStyles(),

		'&:hover, &:focus-visible': {
			opacity: 1,
			// transform: 'scale(1.15)',
		},
	},
}));

export const IconButton = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<'button'>
>((props, forwardedRef) => {
	const { children, ...buttonProps } = props;
	const { classes } = useStyles();

	return (
		<UnstyledButton
			className={classes.controlButton}
			{...props}
			ref={forwardedRef}
		>
			{children}
		</UnstyledButton>
	);
});
