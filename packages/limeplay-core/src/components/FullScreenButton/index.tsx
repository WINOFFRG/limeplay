import { forwardRef } from 'react';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface FullScreenProps extends PrimitiveButtonProps {
	isFullScreen?: boolean;
}

const FullScreenButton = forwardRef<HTMLButtonElement, FullScreenProps>(
	(props, forwardedRef) => {
		const { children, isFullScreen, ...buttonProps } = props;

		return (
			<button
				type="button"
				aria-label={isFullScreen ? 'Pause' : 'Play'}
				data-disabled={props.disabled ? '' : undefined}
				ref={forwardedRef}
				{...buttonProps}
			>
				{children}
			</button>
		);
	}
);

export { FullScreenButton };
