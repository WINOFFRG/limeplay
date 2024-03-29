import React from 'react';
import { Alert } from '@mantine/core';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { MdxPageBase } from '../MdxPageBase/MdxPageBase';
import MdxTitle from '../MdxProvider/MdxTitle/MdxTitle';
import { MdxPageProps } from '../../../types';
import useStyles from './MdxErrorPage.styles';

export function MdxErrorPage() {
	const { classes } = useStyles();
	// const Component = useMDXComponent(data.body.code);

	return (
		<MdxPageBase>
			<div className={classes.wrapper}>
				<div className={classes.container}>
					{/* <MdxTitle order={1}>{data.title}</MdxTitle> */}
					<Alert
						className={classes.error}
						color="red"
						title="Error message"
					>
						{/* {data.error} */}
					</Alert>
					{/* <Component>{children}</Component> */}
				</div>
			</div>
		</MdxPageBase>
	);
}
