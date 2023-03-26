import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { Button, Text, UnstyledButton } from '@mantine/core';
import { getDocsData } from '../../../../utils/get-docs-data';
import useStyles from './NavbarDocsCategory.styles';
import { HEADER_HEIGHT } from '../../Header/HeaderDesktop.styles';
import useRawPath from '@/hooks/use-raw-path';
import CategoryLinks from './CategoryLinks';

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
			<div className={classes.linkWrapper}>
				<div className={classes.rootWrapper}>
					{!collapsed &&
						Array.isArray(group.groups) &&
						group.groups.map((part) => (
							<CategoryLinks
								part={part}
								onLinkClick={onLinkClick}
								itemRefs={itemRefs}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
