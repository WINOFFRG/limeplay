import { forwardRef } from 'react';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface PlaybackProps extends PrimitiveButtonProps {
	isPlaying?: boolean;
}

const PlaybackButton = forwardRef<HTMLButtonElement, PlaybackProps>(
	(props, forwardedRef) => {
		const { children, isPlaying, ...buttonProps } = props;

		return (
			<button
				type="button"
				aria-label={isPlaying ? 'Pause' : 'Play'}
				data-disabled={props.disabled ? '' : undefined}
				ref={forwardedRef}
				{...buttonProps}
			>
				{children}
			</button>
		);
	}
);

export { PlaybackButton };
