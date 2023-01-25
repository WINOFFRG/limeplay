/* eslint-disable import/no-relative-packages */
import React from 'react';
import { IconChevronDown, IconExternalLink } from '@tabler/icons';
import { Code, Menu, UnstyledButton, Text } from '@mantine/core';
import { useSpotlight } from '@mantine/spotlight';
import corePackageJson from '../../../package.json';
import { Logo } from '../../Logo/Logo';
import { useDirectionContext } from '../DirectionContext';
import useStyles from './HeaderDesktop.styles';
import { HeaderControls } from './HeaderControls';
import siteConfig from '@/settings/site-config.json';

interface Version {
    v: string;
    name: string;
    link: string;
}

const versions: Version[] = [];

export function HeaderDesktop() {
    const { classes } = useStyles();
    const { dir, toggleDirection } = useDirectionContext();
    const spotlight = useSpotlight();

    const versionItems = versions.map((item) => (
        <Menu.Item
            key={item.name}
            component="a"
            href={item.link}
            target="_blank"
            rightSection={<IconExternalLink size={14} stroke={1.5} />}
        >
            <b>{item.v}</b>{' '}
            <Text span color="dimmed" fz="xs">
                ({item.name})
            </Text>
        </Menu.Item>
    ));

    return (
        <div className={classes.header}>
            <div className={classes.mainSection}>
                <div className={classes.logoWrapper}>
                    <div className={classes.logo}>
                        <Logo />
                    </div>

                    <Menu width={160} position="bottom-start" withArrow>
                        <Menu.Target>
                            <UnstyledButton mt={2}>
                                <Code className={classes.version}>
                                    v{corePackageJson.version}{' '}
                                    <IconChevronDown
                                        size={12}
                                        className={classes.chevron}
                                    />
                                </Code>
                            </UnstyledButton>
                        </Menu.Target>

                        {versions.length > 0 && (
                            <Menu.Dropdown>{versionItems}</Menu.Dropdown>
                        )}
                    </Menu>
                </div>
            </div>
            <HeaderControls
                pr="md"
                onSearch={spotlight.openSpotlight}
                githubLink={siteConfig.repo.url}
                direction={dir}
                toggleDirection={toggleDirection}
            />
        </div>
    );
}
