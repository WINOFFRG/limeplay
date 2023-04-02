import { createContext } from 'react';
import { LimeplayStore } from '.';

export const LimeplayContext = createContext<LimeplayStore | null>(null);
