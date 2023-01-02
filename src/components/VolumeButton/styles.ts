import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme, _params, getRef) => ({
    controlButton: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        opacity: 0.7,
        transition: 'opacity 0.1s ease-in-out',
        backgroundColor: 'transparent',
        border: 'none',
        ...theme.fn.focusStyles(),

        '&:hover': {
            opacity: 1,
            cursor: 'pointer',
            transform: 'scale(1.1)',
        },

        '&:disabled': {
            opacity: 0.3,
            cursor: 'not-allowed',
            transform: 'none',
        },
    },

    iconStyle: {
        width: '24px',
        height: '24px',
        margin: 'auto',
        pointerEvents: 'none',
    },

    volumeControl: {
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        [`& ${getRef('volumeSlider__Slider')}`]: {
            width: '100px',
        },
    },

    volumeSlider: {
        display: 'flex',
        height: '44px',
        padding: '0 8px',
        alignItems: 'center',
        flexDirection: 'row',
    },

    volumeSlider__Slider: {
        position: 'relative',
        width: 0,
        marginLeft: '-4px',
        transition: 'width 0.35s ease-in-out',

        // '&:hover': {
        //     cursor: 'pointer',
        //     width: '100px',
        // },
    },

    volumeSlider__Duration: {
        display: 'flex',
        borderRadius: '2px',
        width: '100%',
        height: '4px',
        background: '#5e5e5e',
    },

    volumeSlider__Progress: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100px',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
}));

export default useStyles;
