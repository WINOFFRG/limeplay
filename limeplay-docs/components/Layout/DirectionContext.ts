import { useContext, createContext } from 'react';

interface DirectionContextProps {
  dir: 'rtl' | 'ltr';
  toggleDirection(): void;
}

export const DirectionContext = createContext<DirectionContextProps | null>(null);

export function useDirectionContext() {
  return useContext(DirectionContext);
}
