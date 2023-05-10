import React from 'react';
import { Container, Text, Group } from '@mantine/core';
import { Logo } from '../Logo/Logo';
import { LinksGroup } from './LinksGroup/LinksGroup';
import { FOOTER_LINKS_DATA } from '@/settings/config';
import useStyles from './Footer.styles';
import siteConfig from '@/settings/site-config.json';
import { DiscordButton, TwitterButton } from '../SocialButton';

interface FooterProps {
	withNavbar?: boolean;
}

export function Footer({ withNavbar }: FooterProps) {
	const { classes, cx } = useStyles();
	const groups = FOOTER_LINKS_DATA.map((group) => (
		<LinksGroup data={group.data} title={group.title} key={group.title} />
	));

	return (
		<>
			<div className={classes.spacer} />
			<div
				className={cx(classes.wrapper, {
					[classes.withNavbar]: withNavbar,
				})}
			>
				<Container size={1100}>
					<div className={classes.inner}>
						<div className={classes.logoSection}>
							<Logo />
							<Text className={classes.description} size="sm">
								{siteConfig.seo.description}
							</Text>
						</div>

						<div className={classes.groups}>{groups}</div>
					</div>

					<div className={classes.afterFooter}>
						<Group position="apart">
							<Text size="xs" className={classes.afterFooterNote}>
								Built by{' '}
								<a href={siteConfig.author.github}>
									{siteConfig.author.name}
								</a>{' '}
								and{' '}
								<a
									href={`${siteConfig.repo.url}/graphs/contributors`}
								>
									these awesome people
								</a>
							</Text>
							<div className={classes.social}>
								<DiscordButton
									className={classes.socialButton}
								/>
								<TwitterButton
									className={classes.socialButton}
									ml="md"
								/>
							</div>
						</Group>
					</div>
				</Container>
			</div>
		</>
	);
}
