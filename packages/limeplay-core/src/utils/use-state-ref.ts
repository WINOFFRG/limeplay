import { useCallback, useRef, useState, SetStateAction, Dispatch } from 'react';

const isFunction = <S>(
	setStateAction: SetStateAction<S>
): setStateAction is (prevState: S) => S =>
	typeof setStateAction === 'function';

type ReadOnlyRefObject<T> = {
	readonly current: T;
};

type UseStateRef = {
	<S>(initialState: S | (() => S)): [
		S,
		Dispatch<SetStateAction<S>>,
		ReadOnlyRefObject<S>
	];
	<S = undefined>(): [
		S | undefined,
		Dispatch<SetStateAction<S | undefined>>,
		ReadOnlyRefObject<S | undefined>
	];
};

const useStateRef: UseStateRef = <S>(
	initialState?: S | (() => S)
): [
	S | undefined,
	Dispatch<SetStateAction<S | undefined>>,
	ReadOnlyRefObject<S | undefined>
] => {
	const [state, setState] = useState<S | undefined>(initialState);
	const ref = useRef<S | undefined>(state);

	const dispatch: Dispatch<SetStateAction<S | undefined>> = useCallback(
		(setStateAction: SetStateAction<S | undefined>) => {
			ref.current = isFunction(setStateAction)
				? setStateAction(ref.current)
				: setStateAction;

			setState(ref.current);
		},
		[]
	);

	return [state, dispatch, ref];
};

export default useStateRef;
