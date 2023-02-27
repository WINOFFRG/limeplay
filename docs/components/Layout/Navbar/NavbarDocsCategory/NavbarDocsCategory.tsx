import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { Button, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { getDocsData } from '../../../../utils/get-docs-data';
import useStyles from './NavbarDocsCategory.styles';
import { HEADER_HEIGHT } from '../../Header/HeaderDesktop.styles';
import useRawPath from '@/hooks/use-raw-path';

interface NavbarDocsCategoryProps {
	group: ReturnType<typeof getDocsData>[number];
	onLinkClick(): void;
}

function hasActiveLink(
	group: ReturnType<typeof getDocsData>[number],
	pathname: string
) {
	if (group.uncategorized.some((link) => link.slug === pathname)) {
		return true;
	}

	if (
		group.groups.some((_group) =>
			_group.pages.some((link) => link.slug === pathname)
		)
	) {
		return true;
	}

	return false;
}

export default function NavbarDocsCategory({
	group,
	onLinkClick,
}: NavbarDocsCategoryProps) {
	const { rawPath, router } = useRawPath();
	const routePath = rawPath.slice(0, -1);
	// !hasActiveLink(group, routePath) ||
	const [collapsed, setCollapsed] = useState(false);
	const { classes, cx } = useStyles(collapsed);

	const itemRefs = useRef<Record<string, HTMLElement>>({});

	useEffect(() => {
		if (hasActiveLink(group, routePath) && itemRefs.current[routePath]) {
			const element = itemRefs.current[routePath];
			const height =
				typeof window !== 'undefined' ? window.innerHeight : 0;
			const { top, bottom } = element.getBoundingClientRect();

			if (top < HEADER_HEIGHT || bottom > height) {
				element.scrollIntoView({ block: 'center' });
			}
		}
	}, [routePath]);

	const uncategorized = (
		group.group === 'changelog'
			? [...group.uncategorized].reverse()
			: group.uncategorized
	).map((link) => (
		<Link
			key={link.slug}
			className={cx(
				classes.link,
				...(routePath === link.slug ? [classes.linkActive] : [])
			)}
			href={link.slug}
			onClick={onLinkClick}
			ref={(r) => {
				if (r) itemRefs.current[link.slug] = r;
			}}
		>
			{link.title}
		</Link>
	));

	const categorized = !Array.isArray(group.groups)
		? []
		: group.groups.map((part) => {
				const slugs = part.pages.map((link) => link.slug);
				const [isCollapsed, setIsCollapsed] = useState(
					!slugs.includes(routePath)
				);

				if (!part || !Array.isArray(part.pages)) {
					return null;
				}

				const links = part.pages.map((link) => (
					<Link
						key={link.slug}
						className={cx(
							classes.link,
							...(routePath === link.slug
								? [classes.linkActive]
								: [])
						)}
						href={link.slug}
						onClick={onLinkClick}
						ref={(r) => {
							if (r) itemRefs.current[link.slug] = r;
						}}
					>
						{link.title}
					</Link>
				));

				return (
					<div
						className={classes.innerCategory}
						key={part.category.title}
					>
						<Text className={classes.innerCategoryTitle}>
							{part.category.icon && (
								<part.category.icon
									className={classes.innerCategoryIcon}
								/>
							)}
							{part.category.title}
							<UnstyledButton
								onClick={() => setIsCollapsed(!isCollapsed)}
							>
								{!isCollapsed ? (
									<IconChevronDown
										className={cx(classes.icon, {
											[classes.iconCollapsed]: collapsed,
										})}
									/>
								) : (
									<IconChevronUp
										className={cx(classes.icon, {
											[classes.iconCollapsed]: collapsed,
										})}
									/>
								)}
							</UnstyledButton>
						</Text>
						<div
							style={{
								//   display: isCollapsed ? 'none' : 'block',
								padding: isCollapsed ? '0' : '0.5rem',
								paddingRight: 0,
								maxHeight: isCollapsed ? 0 : 1000,
								overflow: 'hidden',
								transition: 'all 250ms ease-in-out',
								transitionTimingFunction:
									'cubic-bezier(.4,0,.2,1)',
								opacity: isCollapsed ? 0 : 1,
							}}
						>
							<div className={classes.listWrapper} style={{}}>
								{links}
							</div>
						</div>
					</div>
				);
		  });

	return (
		<div
			className={cx(classes.category, {
				[classes.categoryCollapsed]: collapsed,
			})}
		>
			<button
				style={{
					display: 'none',
				}}
				className={classes.header}
				type="button"
				onClick={() => setCollapsed((c) => !c)}
			>
				<Text
					// className={classes.title}
					className={classes.title}
					weight={700}
					size="xs"
					transform="uppercase"
				>
					{group.group.replace('-', ' ')}
				</Text>
				<IconChevronDown
					className={cx(classes.icon, {
						[classes.iconCollapsed]: collapsed,
					})}
				/>
			</button>
			<div
				style={{
					display: collapsed ? 'none' : 'block',
					padding: collapsed ? '0' : '0.5rem',
					paddingRight: 0,
					paddingLeft: 0,
					maxHeight: collapsed ? 0 : 1000,
					overflow: 'hidden',
					transition: 'all 250ms ease-in-out',
					transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
					opacity: collapsed ? 0 : 1,
				}}
			>
				<div className={classes.rootWrapper} style={{}}>
					{!collapsed && uncategorized}
					{!collapsed && categorized}
				</div>
			</div>
		</div>
	);
}
