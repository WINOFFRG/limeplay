import React, { useState } from 'react';
import { randomId, useMediaQuery } from '@mantine/hooks';
import { SpotlightProvider, SpotlightAction } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons';
import { ModalsProvider, ContextModalProps } from '@mantine/modals';
import Navbar from './Navbar/Navbar';
import Header from './Header/Header';
import { NAVBAR_BREAKPOINT } from './Navbar/Navbar.styles';
import {
	shouldExcludeNavbar,
	shouldExcludeHeader,
} from '../../settings/exclude-layout';
import { getDocsData } from '../../utils/get-docs-data';
import useStyles from './Layout.styles';
import useRawPath from '@/hooks/use-raw-path';

function getActions(data: ReturnType<typeof getDocsData>): SpotlightAction[] {
	return data.reduce<SpotlightAction[]>((acc, part) => {
		if (!part || !Array.isArray(part.groups)) {
			return acc;
		}

		part.groups.forEach((group) => {
			if (group && Array.isArray(group.pages)) {
				acc.push(
					...group.pages.map((item) => ({
						title: item.title,
						description: item.search || item.description,
						onTrigger: () => {},
					}))
				);
			}
		});

		part.uncategorized
			.filter(
				(page) =>
					page.title.toLowerCase() !== 'getting started' &&
					!page.title.toLowerCase().includes('version')
			)
			.forEach((page) => {
				acc.push({
					title: page.title,
					description: page.search || page.description,
					onTrigger: () => {},
				});
			});

		return acc;
	}, []);
}

export function LayoutInner({ children }: { children: React.ReactNode }) {
	const navbarCollapsed = useMediaQuery(
		`(max-width: ${NAVBAR_BREAKPOINT}px)`
	);

	const { router } = useRawPath();
	const data = getDocsData();
	const shouldRenderHeader = !shouldExcludeHeader(router.pathname);
	const shouldRenderNavbar =
		!shouldExcludeNavbar(router.pathname) || navbarCollapsed;
	const { classes, cx } = useStyles({ shouldRenderHeader });
	const [navbarOpened, setNavbarState] = useState(false);

	return (
		<SpotlightProvider
			actions={getActions(data)}
			searchIcon={<IconSearch size={18} />}
			searchPlaceholder="Search documentation"
			shortcut={['mod + K', 'mod + P', '/']}
			highlightQuery
			searchInputProps={{
				id: randomId(),
				name: randomId(),
				autoComplete: 'nope',
			}}
			transition={{
				in: { transform: 'translateY(0)', opacity: 1 },
				out: { transform: 'translateY(-20px)', opacity: 0 },
				transitionProperty: 'transform, opacity',
			}}
		>
			<div
				className={cx({
					[classes.withNavbar]: shouldRenderNavbar,
					[classes.withoutHeader]: !shouldRenderHeader,
				})}
			>
				{shouldRenderHeader && (
					<Header
						navbarOpened={navbarOpened}
						toggleNavbar={() => setNavbarState((o) => !o)}
					/>
				)}

				{shouldRenderNavbar && (
					<Navbar
						data={data}
						opened={navbarOpened}
						onClose={() => setNavbarState(false)}
					/>
				)}

				<main className={classes.main}>
					<div className={classes.content}>
						<ModalsProvider
							labels={{ confirm: 'Confirm', cancel: 'Cancel' }}
						>
							{children}
						</ModalsProvider>
					</div>
				</main>
			</div>
		</SpotlightProvider>
	);
}
