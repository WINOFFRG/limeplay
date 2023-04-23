import { GlobalStyles } from 'tss-react';
import { memo } from 'react';
import resetCss from './reset';
import globalCss from './global';
import { useStyles } from './theme';

function _AppStyles() {
	const { theme } = useStyles();

	return (
		<GlobalStyles
			styles={{
				...resetCss(),
				...globalCss(theme),
			}}
		/>
	);
}

const AppStyles = memo(_AppStyles);
export default AppStyles;
