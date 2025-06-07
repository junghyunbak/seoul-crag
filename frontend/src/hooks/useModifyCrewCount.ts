import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyCrewCount() {
  const [setCrewCount] = useStore(useShallow((s) => [s.setCrewCount]));

  const updateCrewCount = useCallback(
    (crewCount: CrewCount) => {
      setCrewCount(() => crewCount);
    },
    [setCrewCount]
  );

  const rotateCrewCount = useCallback(() => {
    setCrewCount((prev) => {
      if (prev === 1) {
        return 5;
      } else if (prev === 5) {
        return 10;
      } else {
        return 1;
      }
    });
  }, [setCrewCount]);

  return {
    rotateCrewCount,
    updateCrewCount,
  };
}
