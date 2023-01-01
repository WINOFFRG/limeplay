import { createStyles } from '@mantine/styles';

const useStyles = createStyles((theme) => ({
    overlayWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default useStyles;
