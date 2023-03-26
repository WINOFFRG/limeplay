import { State, StateCreator, StoreMutatorIdentifier } from 'zustand';

type Logger = <
	T extends State,
	Mps extends [StoreMutatorIdentifier, unknown][] = [],
	Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
	f: StateCreator<T, Mps, Mcs>,
	name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends State>(
	f: StateCreator<T, [], []>,
	name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
	type T = ReturnType<typeof f>;
	const loggedSet: typeof set = (...a) => {
		// console.log(`Setting Property`, ...a);
		set(...a);
	};
	store.setState = loggedSet;

	return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;
