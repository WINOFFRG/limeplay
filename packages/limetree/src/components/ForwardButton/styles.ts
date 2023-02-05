import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
    controlButton: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '44px',
        opacity: 0.7,
        transition: 'all 0.1s ease-in-out',
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
}));

export default useStyles;
