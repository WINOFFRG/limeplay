/* eslint-disable import/no-relative-packages */
import React from 'react';
import { Burger } from '@mantine/core';
import { Logo } from '../../Logo/Logo';
import useStyles from './HeaderMobile.styles';
import { ColorSchemeControl } from './HeaderControls/ColorSchemeControl';

interface HeaderProps {
	navbarOpened: boolean;
	toggleNavbar(): void;
}

export function HeaderMobile({ navbarOpened, toggleNavbar }: HeaderProps) {
	const { classes } = useStyles();

	return (
		<div className={classes.header}>
			<div className={classes.inner}>
				<Burger
					opened={navbarOpened}
					size="sm"
					onClick={toggleNavbar}
					aria-label="Toggle navbar"
				/>
				<div className={classes.logo}>
					<Logo />
				</div>
				<ColorSchemeControl />
			</div>
		</div>
	);
}
