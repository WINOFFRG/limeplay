import * as React from 'react';
import { Icon, type IconProps } from '@/components/Icon';

export function PauseIcon(props: IconProps) {
	return (
		<Icon {...props}>
			<svg>
				<path d="M3.5 3.5a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-9ZM9 3.5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-9Z" />
			</svg>
		</Icon>
	);
}
