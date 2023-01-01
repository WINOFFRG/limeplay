import { createStyles, keyframes } from '@mantine/styles';

const spin = keyframes({
    '0%': {
        transform: 'translateX(-50%) rotate(0deg)',
    },
    '100%': {
        transform: 'translateX(-50%) rotate(360deg)',
    },
});

const useStyles = createStyles((theme) => ({
    playerLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
        margin: 'auto',
        backgroundImage:
            'radial-gradient(circle closest-side at 50% 50%, rgba(0,0,0,0.2), rgba(0,0,0,0.06) 50%, transparent)',

        '&:after': {
            content: '""',
            height: '74px',
            width: '74px',
            left: '50%',
            top: '50%',
            marginTop: '-37px',
            position: 'absolute',
            borderRadius: theme.defaultRadius,
            transform: 'translateX(-50%)',
            border: `3px solid ${theme.white}`,
            borderRightColor: 'transparent',
            borderTopColor: 'transparent',
            animation: `${spin} 800ms linear infinite`,
        },

        '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
    },
}));

export default useStyles;
