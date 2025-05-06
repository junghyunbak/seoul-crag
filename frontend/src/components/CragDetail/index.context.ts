import { createContext } from 'react';

type CragDetailContextValue = {
  crag: Crag | null | undefined;
  images: Image[] | null | undefined;
  onClose: () => void;
};

export const CragDetailContext = createContext<CragDetailContextValue>({
  crag: null,
  images: null,
  onClose: () => {},
});
