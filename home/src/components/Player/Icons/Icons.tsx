import { memo, forwardRef, SVGProps } from 'react';
import useStyles from './styles';

function _UnmuteIcon() {
	return (
		<SVG>
			<path
				d="M11.765 2.627L5.176 9.19 5 9.262H1a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.589 6.562c.624.622.985.472.985-.42V3.048c0-.888-.361-1.041-.985-.42zm3.564.076a.744.744 0 00.335 1c4.405 2.194 6.586 4.94 6.586 8.298 0 3.357-2.18 6.103-6.586 8.297a.744.744 0 00-.335 1 .752.752 0 001.007.335c4.927-2.454 7.414-5.684 7.414-9.632 0-3.948-2.487-7.178-7.414-9.632a.752.752 0 00-1.007.334zm.028 4.93a.744.744 0 00.257 1.023c1.44.86 2.136 1.949 2.136 3.345 0 1.395-.696 2.484-2.136 3.344a.744.744 0 00-.257 1.024.752.752 0 001.03.256c1.892-1.131 2.863-2.699 2.863-4.624 0-1.926-.971-3.493-2.864-4.624a.752.752 0 00-1.03.256z"
				stroke="#FFF"
				strokeWidth=".5"
				fill="#FFF"
				fillRule="evenodd"
			/>
		</SVG>
	);
}

function _MuteIcon() {
	return (
		<SVG>
			<g fill="#FFF" fillRule="evenodd">
				<path
					d="M1.626 9.262H1a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.584 6.558.092.087c.573.517.898.351.898-.502v-4.641L1.626 9.262zm10.139-6.635L8.46 5.92l4.29 2.72V3.047c0-.888-.361-1.041-.985-.42z"
					stroke="#FFF"
					strokeWidth=".5"
				/>
				<path
					d="M17.458 19.029l1.835 1.168a20.86 20.86 0 01-2.846 1.697 1 1 0 11-.894-1.789 20.354 20.354 0 001.905-1.076zm-1.01-16.923C21.422 4.594 24 7.906 24 12a8.82 8.82 0 01-.748 3.604l-1.716-1.091c.31-.798.464-1.635.464-2.513 0-3.24-2.09-5.927-6.447-8.105a1 1 0 01.894-1.79zm.067 5.037C18.47 8.316 19.5 9.964 19.5 12c0 .395-.039.776-.116 1.142l-1.886-1.2-.004-.156c-.067-1.196-.706-2.147-2.008-2.928a1 1 0 011.029-1.715z"
					fillRule="nonzero"
					opacity=".5"
				/>
				<path
					d="M.463 5.844l22 14a1 1 0 001.074-1.688l-22-14A1 1 0 00.463 5.844z"
					fillRule="nonzero"
				/>
			</g>
		</SVG>
	);
}

function _VolumeHalf() {
	return (
		<SVG>
			<g fill="#FFF" fillRule="evenodd">
				<path
					d="M7.176 9.19L7 9.262H3a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.589 6.562c.624.622.985.472.985-.42V3.048c0-.888-.361-1.041-.985-.42L7.176 9.19z"
					stroke="#FFF"
					strokeWidth=".5"
				/>
				<path
					d="M17.486 8.87c1.378.824 2.014 1.838 2.014 3.13 0 1.293-.636 2.307-2.014 3.13a.994.994 0 00-.343 1.368c.284.471.898.624 1.371.341 1.955-1.168 2.986-2.81 2.986-4.838s-1.03-3.67-2.986-4.839a1.002 1.002 0 00-1.371.342.994.994 0 00.343 1.366z"
					fillRule="nonzero"
				/>
			</g>
		</SVG>
	);
}

function _PlayIcon() {
	return (
		<SVG>
			<path
				d="M4.245 2.563a.5.5 0 00-.745.435v18.004a.5.5 0 00.745.435l15.997-9.001a.5.5 0 000-.872L4.245 2.563z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</SVG>
	);
}

function _PauseIcon() {
	return (
		<SVG>
			<path
				d="M18 2.5A1.5 1.5 0 0016.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 0018 2.5zm-12 0A1.5 1.5 0 004.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 006 2.5z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</SVG>
	);
}

function _Reverse10() {
	return (
		<SVG viewBox="0 0 32 32" width="1em" height="1em">
			<path
				fill="#ffffff"
				d="M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z"
			/>
			<path
				fill="#ffffff"
				d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.57 3.57 0 0 1-.52-1.25a7.69 7.69 0 0 1-.17-1.68a7.83 7.83 0 0 1 .17-1.68a3.65 3.65 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08zm0-1.22a1.07 1.07 0 0 0 1-.55a3.38 3.38 0 0 0 .37-1.51v-1.38a3.31 3.31 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.31 3.31 0 0 0-.29 1.5v1.38a3.38 3.38 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55zm-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"
			/>
		</SVG>
	);
}

function _Forward10() {
	return (
		<SVG viewBox="0 0 32 32" width="1em" height="1em">
			<path
				fill="#ffffff"
				d="M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z"
			/>
			<path
				fill="#ffffff"
				d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.57 3.57 0 0 1-.52-1.25a7.69 7.69 0 0 1-.17-1.68a7.83 7.83 0 0 1 .17-1.68a3.65 3.65 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08zm0-1.22a1.07 1.07 0 0 0 1-.55a3.38 3.38 0 0 0 .37-1.51v-1.38a3.31 3.31 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.31 3.31 0 0 0-.29 1.5v1.38a3.38 3.38 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55zm-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"
			/>
		</SVG>
	);
}

function _PipExit() {
	return (
		<SVG>
			<g
				stroke="#FFF"
				fill="none"
				strokeWidth={2}
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
				<path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" />
				<path d="M7 9l4 4" />
				<path d="M7 12v-3h3" />
			</g>
		</SVG>
	);
}

function _PipEnter() {
	return (
		<SVG>
			<g
				stroke="#FFF"
				fill="none"
				strokeWidth={2}
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M11 19h-6a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v4" />
				<path d="M14 14m0 1a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1z" />
				<path d="M7 9l4 4" />
				<path d="M8 13h3v-3" />
			</g>
		</SVG>
	);
}

function _FullscreenExit() {
	return (
		<SVG>
			<g fill="none" fillRule="evenodd">
				<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
				<path
					fill="#ffffff"
					d="M20 7h-3V4a1 1 0 1 0-2 0v3a2 2 0 0 0 2 2h3a1 1 0 1 0 0-2ZM7 9a2 2 0 0 0 2-2V4a1 1 0 1 0-2 0v3H4a1 1 0 1 0 0 2h3Zm0 8H4a1 1 0 1 1 0-2h3a2 2 0 0 1 2 2v3a1 1 0 1 1-2 0v-3Zm10-2a2 2 0 0 0-2 2v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3Z"
				/>
			</g>
		</SVG>
	);
}

function _FullscreenEnter() {
	return (
		<SVG>
			<g fill="none">
				<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
				<path
					fill="#ffffff"
					d="M4 15a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2v-3a1 1 0 0 1 1-1Zm16 0a1 1 0 0 1 .993.883L21 16v3a2 2 0 0 1-1.85 1.995L19 21h-3a1 1 0 0 1-.117-1.993L16 19h3v-3a1 1 0 0 1 1-1ZM19 3a2 2 0 0 1 1.995 1.85L21 5v3a1 1 0 0 1-1.993.117L19 8V5h-3a1 1 0 0 1-.117-1.993L16 3h3ZM8 3a1 1 0 0 1 .117 1.993L8 5H5v3a1 1 0 0 1-1.993.117L3 8V5a2 2 0 0 1 1.85-1.995L5 3h3Z"
				/>
			</g>
		</SVG>
	);
}

function _SettingsIcon() {
	return (
		<SVG>
			<path
				d="M9.273 0l1.444 2.87a9.209 9.209 0 012.654.025L15.104.113s.872.229 1.693.577c.822.349 1.068.5 1.563.805l-.797 3.176a9.584 9.584 0 011.87 1.89l3.188-.734S23.723 8.097 24 9.34l-2.87 1.442a9.202 9.202 0 01-.026 2.653l2.783 1.732a12.14 12.14 0 01-1.382 3.255l-3.178-.797a9.246 9.246 0 01-1.894 1.859l.743 3.193A12.181 12.181 0 0114.895 24l-1.683-2.81a9.215 9.215 0 01-2.654-.025l-1.733 2.782a12.381 12.381 0 01-1.693-.577 11.82 11.82 0 01-1.564-.804l.798-3.177a9.246 9.246 0 01-1.86-1.893l-3.177.739A12.295 12.295 0 010 14.952l2.8-1.675a9.196 9.196 0 01.025-2.653L.042 8.892a12.14 12.14 0 011.382-3.255l3.178.797a9.261 9.261 0 011.893-1.859l-.742-3.193A12.319 12.319 0 019.273 0zM12 7a5 5 0 100 10 5 5 0 000-10z"
				fill="#FEFEFE"
				fillRule="evenodd"
			/>
		</SVG>
	);
}

function _Maximize() {
	return (
		<SVG>
			<g
				stroke="#FFF"
				fill="none"
				strokeWidth={2}
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z" />
				<path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6" />
				<path d="M12 8h4v4" />
				<path d="M16 8l-5 5" />
			</g>
		</SVG>
	);
}

function _Minimize() {
	return (
		<SVG>
			<g
				stroke="#FFF"
				fill="none"
				strokeWidth={2}
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z" />
				<path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6" />
				<path d="M15 13h-4v-4" />
				<path d="M11 13l5 -5" />
			</g>
		</SVG>
	);
}

function _NfPauseIcon() {
	return (
		<SVG>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
				fill="currentColor"
			/>
		</SVG>
	);
}

function _NfPlayIcon() {
	return (
		<SVG>
			<path
				d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
				fill="currentColor"
			/>
		</SVG>
	);
}

export function OcticonVideo24() {
	return (
		<SVG>
			<path
				fill="#ffffff"
				d="M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0 1 22.25 21H1.75A1.75 1.75 0 0 1 0 19.25Zm1.75-.25a.25.25 0 0 0-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 0 0 .25-.25V4.75a.25.25 0 0 0-.25-.25Z"
			/>
			<path
				fill="#ffffff"
				d="M9 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.583a.5.5 0 0 1 0 .842L9.77 16.005a.5.5 0 0 1-.77-.42Z"
			/>
		</SVG>
	);
}

export function SubtitleIcons() {
	return (
		<SVG>
			<g fill="none">
				<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
				<path
					fill="#ffffff"
					d="M19 3a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7.333L4 21.5c-.824.618-2 .03-2-1V6a3 3 0 0 1 3-3h14Zm0 2H5a1 1 0 0 0-1 1v13l2.133-1.6a2 2 0 0 1 1.2-.4H19a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Zm-8 7a1 1 0 0 1 .117 1.993L11 14H8a1 1 0 0 1-.117-1.993L8 12h3Zm5-4a1 1 0 1 1 0 2H8a1 1 0 0 1 0-2h8Z"
				/>
			</g>
		</SVG>
	);
}

function _VideoQuality() {
	return (
		<SVG>
			<path
				fill="#ffffff"
				d="M0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0 1 22.25 21H1.75A1.75 1.75 0 0 1 0 19.25Zm1.75-.25a.25.25 0 0 0-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 0 0 .25-.25V4.75a.25.25 0 0 0-.25-.25Z"
			/>
			<path
				fill="#ffffff"
				d="M9 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.583a.5.5 0 0 1 0 .842L9.77 16.005a.5.5 0 0 1-.77-.42Z"
			/>
		</SVG>
	);
}

const SVG = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
	({ children, ...props }, ref) => {
		const { classes } = useStyles();

		return (
			<svg
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				className={classes.iconStyle}
				fill="none"
				ref={ref}
				{...props}
			>
				{children}
			</svg>
		);
	}
);

export const UnmuteIcon = memo(_UnmuteIcon);
export const MuteIcon = memo(_MuteIcon);
export const VolumeHalf = memo(_VolumeHalf);
export const PlayIcon = memo(_PlayIcon);
export const PauseIcon = memo(_PauseIcon);
export const Reverse10 = memo(_Reverse10);
export const Forward10 = memo(_Forward10);
export const PipExit = memo(_PipExit);
export const PipEnter = memo(_PipEnter);
export const FullscreenExit = memo(_FullscreenExit);
export const FullscreenEnter = memo(_FullscreenEnter);
export const SettingsIcon = memo(_SettingsIcon);
export const MaximizeIcon = memo(_Maximize);
export const MinimizeIcon = memo(_Minimize);
export const NfPlayIcon = memo(_NfPlayIcon);
export const NfPauseIcon = memo(_NfPauseIcon);
export const VideoQuality = memo(_VideoQuality);
