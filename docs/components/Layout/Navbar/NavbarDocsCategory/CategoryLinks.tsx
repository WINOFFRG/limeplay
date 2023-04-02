import React, { useState } from 'react';
import Link from 'next/link';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { Text, UnstyledButton } from '@mantine/core';
import { getDocsData } from '../../../../utils/get-docs-data';
import useStyles from './NavbarDocsCategory.styles';
import useRawPath from '@/hooks/use-raw-path';

export default function CategoryLinks({
	part,
	onLinkClick,
	itemRefs,
}: {
	part: ReturnType<typeof getDocsData>[number]['groups'][number];
	onLinkClick(): void;
	itemRefs: React.MutableRefObject<Record<string, HTMLElement>>;
}) {
	const slugs = part.pages.map((link) => link.slug);
	const { rawPath, router } = useRawPath();
	const routePath = rawPath.slice(0, -1);

	const [isCollapsed, setIsCollapsed] = useState<boolean>(
		!slugs.includes(routePath)
	);
	const { classes, cx } = useStyles(isCollapsed);

	if (!part || !Array.isArray(part.pages)) {
		return null;
	}

	const links = part.pages.map((link, index) => (
		<Link
			// eslint-disable-next-line react/no-array-index-key
			key={`${link.slug} ${index}`}
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

	return (
		<div className={classes.innerCategory} key={part.category.title}>
			<Text className={classes.innerCategoryTitle}>
				{part.category.icon && (
					<part.category.icon className={classes.innerCategoryIcon} />
				)}
				{part.category.title}
				<UnstyledButton onClick={() => setIsCollapsed(!isCollapsed)}>
					{!isCollapsed ? (
						<IconChevronDown
							className={cx(classes.icon, {
								[classes.iconCollapsed]: isCollapsed,
							})}
						/>
					) : (
						<IconChevronUp
							className={cx(classes.icon, {
								[classes.iconCollapsed]: isCollapsed,
							})}
						/>
					)}
				</UnstyledButton>
			</Text>
			<div className={cx(classes.listWrapper, classes.blueLinkActive)}>
				{links}
			</div>
		</div>
	);
}
