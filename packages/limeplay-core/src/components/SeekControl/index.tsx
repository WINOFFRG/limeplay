import { forwardRef } from 'react';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface SeekButtonProps extends PrimitiveButtonProps {
	seekValue?: number;
	seekType: 'forward' | 'backward';
}

const SeekButton = forwardRef<HTMLButtonElement, SeekButtonProps>(
	(props, forwardedRef) => {
		const { children, seekValue = 10, seekType, ...buttonProps } = props;

		return (
			<button
				type="button"
				aria-label={`Seek ${seekType} ${seekValue} seconds`}
				data-disabled={props.disabled ? '' : undefined}
				ref={forwardedRef}
				{...buttonProps}
			>
				{children}
			</button>
		);
	}
);

export { SeekButton };
