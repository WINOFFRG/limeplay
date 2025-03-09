'use client';

import * as React from 'react';
import clsx from 'clsx';
// import { useTheme } from "styled-components";
// import type { Colors } from "../styles/Theme";

/** Props accepted by <Icon /> */
export type IconProps = Omit<
	React.SVGProps<SVGSVGElement>,
	'color' | 'fill' | 'size'
> & {
	/** Size of the icon. Defaults to 16x16 */
	size?: number | string;
	/** View box — only used occasionally, most icons should be 16x16 base */
	viewBox?: string;
	/** If a fill should be not be applied to the base svg */
	noFill?: boolean;
	/**
	 * Color of the icon. Defaults to `labelMuted`.
	 */
	color?: string;
	/** Additional style applied to the <svg> element. */
	style?: React.CSSProperties;
	/** Additional className applied to the <svg> element. */
	className?: string;
	/** Whether to include the --icon-color variable in the svg definition to allow color override. */
	includeColorVariables?: boolean;
	/** Announced label for the icon. Most icons should not be announced. */
	'aria-label'?: string;
};

/**
 * Wraps an SVG from our icon library with default props and sizing.
 */
export const Icon = (
	props: IconProps & {
		// Children must be a single <svg /> child
		children: React.ReactElement<React.SVGAttributes<SVGSVGElement>>;
	}
) => {
	const {
		size = 16,
		width,
		height,
		viewBox = '0 0 16 16',
		color = '#fff',
		style,
		noFill = false,
		className,
		children,
		...etc
	} = props;
	const child = React.Children.only(children);

	const resolvedColor =
		// color in theme.color
		//   ? theme.color[color as Colors]
		//   : color === "brand"
		//   ? undefined
		//   :
		color;

	const svgProps: React.SVGProps<SVGSVGElement> = {
		...etc,
		className: clsx(className, {
			// Brand icons should avoid color overrides in menus, lists, etc.
			'color-override': color === 'brand',
		}),
		style: {
			...style,
			['--icon-color' as string]: resolvedColor,
		},
		width: width ?? size,
		height: height ?? size,
		viewBox,
		fill: noFill ? 'none' : resolvedColor,
		role: 'img',
		focusable: 'false',
		// Icons are decorative by default, but can be made accessible by setting aria-label
		'aria-hidden':
			'aria-hidden' in etc
				? etc['aria-hidden']
				: 'aria-label' in etc
				? undefined
				: true,
		// These icons are rendered on the server for mobile clients, the xmlns attribute is required for proper rendering
		xmlns: 'http://www.w3.org/2000/svg',
	};

	if (React.isValidElement(child)) {
		return React.cloneElement(child, svgProps);
	}

	return null;
};

/**
 * Returns the color to use for the icon – note this is required as icons are rendered on the server
 * and in this case should not include css variables.
 *
 * @param props The icon props
 * @param color The color to use
 * @returns The color to use, with or without css variables.
 */
export const fill = (
	{ includeColorVariables = true }: IconProps,
	color: string = 'currentColor'
) => {
	return includeColorVariables ? `var(--icon-color, ${color})` : color;
};
