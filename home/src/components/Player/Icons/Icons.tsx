import { memo } from 'react';
import useStyles from './styles';

function _UnmuteIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M11.765 2.627L5.176 9.19 5 9.262H1a.75.75 0 00-.75.75v3.977c0 .416.333.75.75.75h4l.176.073 6.589 6.562c.624.622.985.472.985-.42V3.048c0-.888-.361-1.041-.985-.42zm3.564.076a.744.744 0 00.335 1c4.405 2.194 6.586 4.94 6.586 8.298 0 3.357-2.18 6.103-6.586 8.297a.744.744 0 00-.335 1 .752.752 0 001.007.335c4.927-2.454 7.414-5.684 7.414-9.632 0-3.948-2.487-7.178-7.414-9.632a.752.752 0 00-1.007.334zm.028 4.93a.744.744 0 00.257 1.023c1.44.86 2.136 1.949 2.136 3.345 0 1.395-.696 2.484-2.136 3.344a.744.744 0 00-.257 1.024.752.752 0 001.03.256c1.892-1.131 2.863-2.699 2.863-4.624 0-1.926-.971-3.493-2.864-4.624a.752.752 0 00-1.03.256z"
				stroke="#FFF"
				strokeWidth=".5"
				fill="#FFF"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function _MuteIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
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
		</svg>
	);
}

function _VolumeHalf() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
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
		</svg>
	);
}

function _PlayIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M4.245 2.563a.5.5 0 00-.745.435v18.004a.5.5 0 00.745.435l15.997-9.001a.5.5 0 000-.872L4.245 2.563z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function _PauseIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M18 2.5A1.5 1.5 0 0016.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 0018 2.5zm-12 0A1.5 1.5 0 004.5 4v16a1.5 1.5 0 003 0V4A1.5 1.5 0 006 2.5z"
				fill="#FFF"
				stroke="#FFF"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function _Reverse10() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 28 28"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<g fill="none" fillRule="evenodd">
				<path
					d="M15 8.066V1.934a.5.5 0 00-.777-.416L9.624 4.584a.5.5 0 000 .832l4.599 3.066A.5.5 0 0015 8.066z"
					fill="#FFF"
				/>
				<path
					d="M4 16c0 6.075 4.925 11 11 11h0c6.075 0 11-4.925 11-11S21.075 5 15 5"
					stroke="#FFF"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<text
					fontFamily="Graphik-Medium"
					fontSize={10}
					fontWeight={400}
					fill="#FFF"
					transform="translate(4 2)"
				>
					<tspan x="5.4" y={18}>
						10
					</tspan>
				</text>
			</g>
		</svg>
	);
}

function _Forward10() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 28 28"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<g fill="none" fillRule="evenodd">
				<path
					d="M14 8.066V1.934a.5.5 0 01.777-.416l4.599 3.066a.5.5 0 010 .832l-4.599 3.066A.5.5 0 0114 8.066z"
					fill="#FFF"
				/>
				<path
					d="M25 16c0 6.075-4.925 11-11 11S3 22.075 3 16 7.925 5 14 5"
					stroke="#FFF"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<text
					fontFamily="Graphik-Medium, Graphik"
					fontSize={10}
					fontWeight={400}
					fill="#FFF"
					transform="translate(0 1)"
				>
					<tspan x="8.4" y={19}>
						10
					</tspan>
				</text>
			</g>
		</svg>
	);
}

function _PipExit() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 28 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			style={{
				width: '2.5rem',
				height: '2.5rem',
			}}
		>
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
		</svg>
	);
}

function _PipEnter() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 28 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			style={{
				width: '2.5rem',
				height: '2.5rem',
			}}
		>
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
		</svg>
	);
}

function _FullscreenExit() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<g
				stroke="#FFF"
				strokeWidth={2}
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M1 1l6 6m1-5v6H2m21-7l-6 6m-1-5v6h6M1 23l6-6m1 5v-6H2M23 23l-6-6m-1 5v-6h6" />
			</g>
		</svg>
	);
}

function _FullscreenEnter() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<g
				stroke="#FFF"
				strokeWidth={2}
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M8 8L2 2M1 7V1h6m9 7l6-6m1 5V1h-6M8 16l-6 6m-1-5v6h6M16 16l6 6m1-5v6h-6" />
			</g>
		</svg>
	);
}

function _SettingsIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
		>
			<path
				d="M9.273 0l1.444 2.87a9.209 9.209 0 012.654.025L15.104.113s.872.229 1.693.577c.822.349 1.068.5 1.563.805l-.797 3.176a9.584 9.584 0 011.87 1.89l3.188-.734S23.723 8.097 24 9.34l-2.87 1.442a9.202 9.202 0 01-.026 2.653l2.783 1.732a12.14 12.14 0 01-1.382 3.255l-3.178-.797a9.246 9.246 0 01-1.894 1.859l.743 3.193A12.181 12.181 0 0114.895 24l-1.683-2.81a9.215 9.215 0 01-2.654-.025l-1.733 2.782a12.381 12.381 0 01-1.693-.577 11.82 11.82 0 01-1.564-.804l.798-3.177a9.246 9.246 0 01-1.86-1.893l-3.177.739A12.295 12.295 0 010 14.952l2.8-1.675a9.196 9.196 0 01.025-2.653L.042 8.892a12.14 12.14 0 011.382-3.255l3.178.797a9.261 9.261 0 011.893-1.859l-.742-3.193A12.319 12.319 0 019.273 0zM12 7a5 5 0 100 10 5 5 0 000-10z"
				fill="#FEFEFE"
				fillRule="evenodd"
			/>
		</svg>
	);
}

function _Maximize() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			style={{
				width: '2rem',
				height: '2rem',
				margin: '0',
			}}
		>
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
		</svg>
	);
}

function _Minimize() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			style={{
				width: '2rem',
				height: '2rem',
				margin: '0',
			}}
		>
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
		</svg>
	);
}

function _NfPauseIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			fill="none"
			style={{
				width: '2rem',
				height: '2rem',
				margin: '0',
			}}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function _NfPlayIcon() {
	const { classes } = useStyles();

	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			className={classes.iconStyle}
			fill="none"
			style={{
				width: '2rem',
				height: '2rem',
				margin: '0',
			}}
		>
			<path
				d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
				fill="currentColor"
			/>
		</svg>
	);
}

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
