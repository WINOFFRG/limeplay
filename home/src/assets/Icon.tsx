import * as React from 'react';

export type IconProps = {
	size?: number;
	color?: string;
	children?: React.ReactElement;
};

export function Icon({
	size = 16,
	color = 'currentColor',
	children,
	...etc
}: IconProps) {
	const child = React.Children.only(children);

	if (React.isValidElement(child)) {
		return React.cloneElement(child as React.ReactElement<any>, {
			...etc,
			width: size,
			height: size,
			viewBox: '0 0 16 16',
			fill: color,
			role: 'img',
			focusable: 'false',
			xmlns: undefined,
		});
	}

	return null;
}
