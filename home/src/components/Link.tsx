import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';
import { createStyles } from '@mantine/styles';

export type LinkKind = 'primary' | 'dimmed';

export type LinkProps = React.HTMLProps<HTMLAnchorElement> &
	Omit<NextLinkProps, 'as'> & {
		tab?: boolean;
		kind?: LinkKind;
		active?: boolean;
		children?: React.ReactNode;
	};

export const VariantLink = forwardRef<HTMLAnchorElement, LinkProps>(
	({ kind = 'primary', active = false, ...props }, forwardedRef) => {
		const { tab, href, onClick, ...etc } = props;
		const { classes } = useStyles({
			kind: kind ?? 'primary',
			active: active ?? false,
		});

		return (
			<NextLink
				className={classes.anchorLink}
				// @ts-ignore
				ref={forwardedRef}
				href={href}
				target={tab ? '_blank' : undefined}
				rel="noopener"
				aria-current={active ? 'page' : undefined}
				onClick={onClick}
				{...etc}
			/>
		);
	}
);

const useStyles = createStyles(
	(
		theme,
		{
			kind,
			active,
		}: {
			kind: LinkKind;
			active: boolean;
		}
	) => ({
		anchorLink: {
			textDecoration: 'none',
			color: 'inherit',
			outline: 'none',
			cursor: 'pointer',
			...theme.fn.focusStyles(),

			'&.focus-visible': {
				outlineStyle: 'solid',
				outlineColor: theme.other.color.labelLink,
				outlineWidth: 'thin',
				outlineOffset: '4px',
				boxShadow: 'none',
			},

			...(kind === 'primary' && {
				fontWeight: 500,
				color: theme.other.color.labelLink,
				transition: 'color var(--speed-quickTransition)',

				'&:hover': {
					color: theme.other.color.labelLinkHover,
				},
			}),

			...(kind === 'dimmed' && {
				color: active
					? theme.other.color.labelTitle
					: theme.other.color.labelMuted,
				transition: 'color var(--speed-quickTransition)',
				'&:hover': {
					color: theme.other.color.labelTitle,
				},
			}),
		},
	})
);
