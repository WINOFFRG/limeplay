import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
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
    },

    iconStyle: {
        width: '24px',
        height: '24px',
        margin: 'auto',
        pointerEvents: 'none',
    },
}));

export default useStyles;
