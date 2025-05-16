import { createContext } from 'react';

type CragsContextValue = {
  crags: Crag[];
};

export const cragsContext = createContext<CragsContextValue>({ crags: [] });
