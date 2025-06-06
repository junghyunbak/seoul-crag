import { createContext } from 'react';

type CragFormContextValue = { crag: Crag; revalidateCrag: () => void };

export const cragFormContext = createContext<CragFormContextValue>({} as CragFormContextValue);
