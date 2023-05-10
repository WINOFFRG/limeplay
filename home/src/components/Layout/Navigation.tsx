import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { makeStyles } from '@/styles';
import { moreHitArea } from '@/styles/mixins';

interface NavigationItemProps {
	href: string;
	active?: boolean;
	children: React.ReactNode;
	type?: 'link' | 'icon';
	variant?: 'default' | 'dimmed';
	target?: HTMLAnchorElement['target'];
}

const useStyles = makeStyles<NavigationItemProps>()(
	(theme, { active, variant }) => ({
		menuItem: {
			listStyleType: 'none',
			display: 'flex',
			alignItems: 'center',
			flexShrink: 0,
			margin: 0,
		},

		anchorLink: {
			whiteSpace: 'nowrap',
			fontSize: '1rem',
			lineHeight: 'var(--header-height)',
			height: 'var(--header-height)',
			color:
				variant === 'default'
					? theme.color.labelBase
					: theme.color.labelMuted,
			fontWeight: active ? 600 : 500,
			textAlign: 'center',
			textShadow:
				'1px 1px 4px rgba(0, 0, 0, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.1)',

			'&:hover, &:focus-visible': {
				color: theme.color.labelBase,
			},

			/* We reserve space for making the font-weight 600, which changes width */
			/* This way none of the other elements layout shift when the active link changes */
			'&::after': {
				content: 'attr(data-text)',
				display: 'block',
				textAlign: 'center',
				fontWeight: 600,
				height: 0,
				opacity: 0,
				visibility: 'hidden',
				overflow: 'hidden',
			},

			[theme.breakpoints.max.mobile]: {
				fontSize: '0.8rem',
			},
		},

		anchorIcon: {
			display: 'flex',
			color: theme.color.labelMuted,
			transition: 'color 80ms',
			...moreHitArea(8),

			/* Fighting the global rule for > a svg path */
			'& svg path': {
				color: theme.color.labelMuted,
			},

			'&:hover, &:hover svg path': {
				color: theme.color.labelBase,
			},

			'&:focus-visible, &:focus-visible svg path': {
				color: theme.color.labelBase,
			},
		},
	})
);

function NavigationItem({
	href,
	active = false,
	children,
	type = 'link',
	variant = 'default',
	target,
}: NavigationItemProps) {
	const router = useRouter();
	const isActive = active ?? router.asPath.startsWith(href);
	const metaKeyRef = useRef(false);
	const { classes } = useStyles({
		active,
		href,
		children,
		variant,
	});

	return (
		<NavigationMenu.Item className={classes.menuItem}>
			<NextLink href={href} passHref legacyBehavior>
				<NavigationMenu.Link
					active={isActive}
					asChild
					onClick={(e) => {
						if (e.metaKey) {
							metaKeyRef.current = true;
						}
					}}
					onSelect={(e) => {
						// If meta was held while a link was clicked, prevent Radix default of closing the menu
						// https://github.com/radix-ui/primitives/issues/2074
						if (metaKeyRef.current) {
							metaKeyRef.current = false;
							e.preventDefault();
						}
					}}
				>
					<a
						href={href}
						target={target ?? '_blank'}
						data-text={
							typeof children === 'string' ? children : undefined
						}
						className={
							type === 'link'
								? classes.anchorLink
								: classes.anchorIcon
						}
						rel="noreferrer"
					>
						{children}
					</a>
				</NavigationMenu.Link>
			</NextLink>
		</NavigationMenu.Item>
	);
}

export default NavigationItem;
