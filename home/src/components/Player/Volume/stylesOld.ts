import { createStyles, getStylesRef as getRef } from '@mantine/styles';

const useStyles = createStyles((theme, _params) => ({
	volumeSlider: {
		display: 'flex',
		height: '44px',
		margin: '0 8px',
		alignItems: 'center',
		flexDirection: 'row',
		cursor: 'pointer',
		touchAction: 'none',
		borderRadius: '0.2rem',
		WebkitUserSelect: 'none',
		...theme.fn.focusStyles(),

		[`&:focus-visible .${getRef('volumeSlider__Slider')}`]: {
			width: '100px',
			opacity: 1,
		},

		[`&:focus-visible .${getRef('volumeSlider__Progress')}`]: {
			opacity: 1,
		},

		[`&:focus-visible .${getRef('volumeSlider__Head')}`]: {
			opacity: 1,
		},
	},

	volumeSlider__Slider: {
		ref: getRef('volumeSlider__Slider'),
		position: 'relative',
		width: '0',
		padding: '0 2px',
		transition: 'width 0.35s ease-in-out',
	},

	volumeSlider__Duration: {
		display: 'flex',
		borderRadius: '2px',
		width: '100%',
		height: '4px',
		background: '#5e5e5e',
	},

	volumeSlider__Progress: {
		ref: getRef('volumeSlider__Progress'),
		width: '70%',
		height: '100%',
		borderRadius: '2px',
		background: '#fff',
		cursor: 'pointer',
		opacity: 0,
		transition:
			'opacity .2s cubic-bezier(0.4,0,0.2,1) ,transform .2s cubic-bezier(0.4,0,0.2,1)',
	},

	volumeSlider__Head: {
		ref: getRef('volumeSlider__Head'),
		position: 'absolute',
		width: '12px',
		height: '12px',
		borderRadius: '50%',
		background: '#fff',
		transform: 'translate(-50%, -25%)',
		cursor: 'pointer',
		opacity: 0,
		transition:
			'opacity .2s cubic-bezier(0.4,0,0.2,1) ,transform .2s cubic-bezier(0.4,0,0.2,1)',
	},
}));

export default useStyles;
