import { forwardRef } from 'react';
import { composeEventHandlers } from '../../utils/primitive';
import { useControllableState } from '../../utils/useControllableState';

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<'button'>;

interface ToggleProps extends PrimitiveButtonProps {
	/**
	 * The controlled state of the toggle.
	 */
	pressed?: boolean;
	/**
	 * The state of the toggle when initially rendered. Use `defaultPressed`
	 * if you do not need to control the state of the toggle.
	 * @defaultValue false
	 */
	defaultPressed?: boolean;
	/**
	 * The callback that fires when the state of the toggle changes.
	 */
	onPressedChange?(pressed: boolean): void;
}

const VolumeButton = forwardRef<HTMLButtonElement, ToggleProps>(
	(props, forwardedRef) => {
		const {
			pressed: pressedProp,
			defaultPressed = false,
			onPressedChange,
			children,
			...buttonProps
		} = props;

		const [pressed = false, setPressed] = useControllableState({
			prop: pressedProp,
			onChange: onPressedChange,
			defaultProp: defaultPressed,
		});

		return (
			<button
				type="button"
				aria-pressed={pressed}
				aria-label={!pressed ? 'Mute' : 'Unmute'}
				data-state={pressed ? 'on' : 'off'}
				data-disabled={props.disabled ? '' : undefined}
				{...buttonProps}
				ref={forwardedRef}
				onClick={composeEventHandlers(props.onClick, () => {
					if (!props.disabled) {
						setPressed(!pressed);
					}
				})}
			>
				{children}
			</button>
		);
	}
);

export { VolumeButton };
