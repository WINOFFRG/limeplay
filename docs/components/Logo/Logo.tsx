import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Text } from '@mantine/core';
import useStyles from './Logo.styles';

export function Logo() {
	const { classes } = useStyles();

	return (
		<Link href="/" className={classes.logo} aria-label="Mantine">
			<Text
				style={{
					fontSize: '1.2rem',
					paddingBottom: '0.4rem',
					fontWeight: 500,
				}}
			>
				<Image
					src="/tint.png"
					alt="Mantine Logo"
					width={30}
					height={30}
					style={{
						borderRadius: '50%',
					}}
				/>
			</Text>
		</Link>
	);
}
