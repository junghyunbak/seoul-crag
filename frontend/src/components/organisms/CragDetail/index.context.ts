import { createContext } from 'react';

type CragDetailContextValue = {
  crag: Crag | null | undefined;
  onClose: () => void;
};

export const CragDetailContext = createContext<CragDetailContextValue>({
  crag: null,
  onClose: () => {},
});
