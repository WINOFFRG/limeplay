import * as React from 'react';
import { Icon, type IconProps } from '@/components/Icon';

export function PlayIcon(props: IconProps) {
	return (
		<Icon {...props}>
			<svg>
				<path d="m5.604 2.41 7.23 4.502a1.375 1.375 0 0 1-.02 2.345L5.585 13.6a1.375 1.375 0 0 1-2.083-1.18V3.576A1.375 1.375 0 0 1 5.604 2.41Z" />
			</svg>
		</Icon>
	);
}
