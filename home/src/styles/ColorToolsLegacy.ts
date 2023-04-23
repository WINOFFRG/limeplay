import { clamp } from 'lodash';

/** Helper functions to working with colors. */
export class ColorToolsLegacy {
	/**
	 * Parses a hex string to a color.
	 *
	 * @color The color string to parse.
	 * @returns The parsed color.
	 */
	public static hexToColor(color: string): ColorRGBA {
		let normalized = color;
		if (color.indexOf('#') === 0) {
			normalized = color.substr(1, color.length);
		}
		let r = 0;
		let g = 0;
		let b = 0;
		let a = 1;

		if (normalized.length === 3 || normalized.length === 4) {
			r = parseInt(normalized.charAt(0) + normalized.charAt(0), 16);
			g = parseInt(normalized.charAt(1) + normalized.charAt(1), 16);
			b = parseInt(normalized.charAt(2) + normalized.charAt(2), 16);
			if (normalized.length === 4) {
				a =
					parseInt(normalized.charAt(3) + normalized.charAt(3), 16) /
					255;
			}
		} else if (normalized.length === 6 || normalized.length === 8) {
			r = parseInt(normalized.substr(0, 2), 16);
			g = parseInt(normalized.substr(2, 2), 16);
			b = parseInt(normalized.substr(4, 2), 16);
			if (normalized.length === 8) {
				a = parseInt(normalized.substr(6, 2), 16) / 255;
			}
		}

		return { r, g, b, a };
	}

	/**
	 * Convert a hex color to rgba() with a specific alpha value.
	 *
	 * @param color The hex color string to parse.
	 * @param alpha The desired alpha of the output color, betweeen 0.0 and 1.0
	 * @returns An rgba() color with the given alpha.
	 */
	public static hexWithAlpha(color: string, alpha: number) {
		const rgba = ColorToolsLegacy.hexToColor(color);
		return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${clamp(alpha, 0, 1)})`;
	}
}

/** A representation of a color. */
export interface ColorRGBA {
	/** The red value of the color. Ranges from 0 to 255. */
	r: number;
	/** The green value of the color. Ranges from 0 to 255. */
	g: number;
	/** The blue value of the color. Ranges from 0 to 255. */
	b: number;
	/** The alpha value of the color. Ranges from 0 to 1. */
	a: number;
}

export interface ColorHSL {
	/** The hue value of the color. Ranges from 0 to 360. */
	h: number;
	/** The saturation value of the color. Ranges from 0 to 100. */
	s: number;
	/** The lightness value of the color. Ranges from 0 to 100. */
	l: number;
	/** The alpha value of the color. Ranges from 0 to 1. */
	a: number;
}

export interface HSLAdjustments {
	/** The amount of the saturation value of the color to adjust. Ranges from -100 to 100. */
	s?: number;
	/** The amount of the lightness value of the color to adjust. Ranges from -100 to 100. */
	l?: number;
	/** The amount of the alpha value of the color to adjust. Ranges from -1 to 1. */
	a?: number;
}
