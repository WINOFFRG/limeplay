import React from 'react';
import { Title, Text, Badge } from '@mantine/core';
import { IconPencil, IconLicense, IconCalendar } from '@tabler/icons';
import Link from 'next/link';
import { type DocumentTypes } from 'contentlayer/generated';
import { ImportStatement } from './ImportStatement/ImportStatement';
import { LinkItem } from './LinkItem/LinkItem';
import useStyles from './MdxPageHeader.styles';
import siteConfig from '@/settings/site-config.json';
import { GithubIcon, NpmIcon } from '@/components/SocialButton/Icons';

const REPO_BASE = siteConfig.repo.editUrl;
const DOCS_BASE = `${REPO_BASE}/docs/src/docs`;
const SOURCE_BASE = `${REPO_BASE}/packages/limeplay/src`;

export function MdxPageHeader({ frontmatter }: { frontmatter: DocumentTypes }) {
	const { classes, cx } = useStyles();

	const hasTabs = Array.isArray(frontmatter.props);
	const hasLinks = !!(
		frontmatter.import ||
		frontmatter.source ||
		frontmatter.installation
	);

	if (!hasLinks && !hasTabs && !frontmatter.release) {
		return null;
	}

	return (
		<div className={classes.wrapper}>
			<div
				className={cx(classes.header, { [classes.withTabs]: hasTabs })}
			>
				<Title className={classes.title}>
					{frontmatter.pageTitle || frontmatter.title}
					{frontmatter.polymorphic && (
						<Badge
							component={Link}
							href="/pages/hooks#singleton"
							variant="gradient"
							sx={(theme) => ({
								cursor: 'pointer',
							})}
						>
							Singleton
						</Badge>
					)}
				</Title>

				<Text size="lg" className={classes.description}>
					{frontmatter.description}
				</Text>

				{frontmatter.import && (
					<ImportStatement code={frontmatter.import} />
				)}

				{frontmatter.source && (
					<LinkItem
						label="Source"
						icon={<GithubIcon size={14} />}
						link={`${SOURCE_BASE}/${frontmatter.source}`}
					>
						View source code
					</LinkItem>
				)}

				{frontmatter.release && (
					<LinkItem
						label="Source code"
						icon={<GithubIcon size={14} />}
						link={frontmatter.release}
					>
						Release on GitHub
					</LinkItem>
				)}

				{frontmatter.date && frontmatter.release && (
					<LinkItem
						label="Release date"
						icon={<IconCalendar size={14} stroke={1.5} />}
						link={frontmatter.release}
					>
						{frontmatter.date}
					</LinkItem>
				)}

				{frontmatter.docs && (
					<LinkItem
						label="Docs"
						icon={<IconPencil size={14} stroke={1.5} />}
						link={`${DOCS_BASE}/${frontmatter.docs}`}
					>
						Edit this page
					</LinkItem>
				)}

				{/* {frontmatter.package && (
                    <LinkItem
                        label="Package"
                        icon={<NpmIcon size={14} />}
                        link={`https://www.npmjs.com/package/${frontmatter.package.replace(
                            'mantine-',
                            '@mantine/'
                        )}`}
                    >
                        {frontmatter.package.replace('mantine-', '@mantine/')}
                    </LinkItem>
                )} */}

				{frontmatter.license && (
					<LinkItem
						label="License"
						icon={<IconLicense size={14} stroke={1.5} />}
						link="https://github.com/mantinedev/mantine/blob/master/LICENSE"
					>
						MIT
					</LinkItem>
				)}
			</div>
		</div>
	);
}
